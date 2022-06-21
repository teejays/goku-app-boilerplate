
# Color Control Sequences for easy printing
RESET=\033[0m
RED=\033[31;1m
GREEN=\033[32;1m
YELLOW=\033[33;1m
BLUE=\033[34;1m
MAGENTA=\033[35;1m
CYAN=\033[36;1m
WHITE=\033[37;1m

# Commands
GO=go
GOOS=$(shell go env GOOS)
GOARCH=$(shell go env GOARCH)

GOKU_BINARY_NAME=goku.$(GOOS)_$(GOARCH)

# Paths
CURRENT_DIR=$(shell pwd)

PATH_TO_APP=.
APP_NAME=$(shell basename "${PWD}")
PATH_TO_GEN=../goku/generator
DB_USER=${USER}

# Group commands: do more than one thing at once
all: docker-all

docker-all: docker-up docker-goku-generate docker-run-database docker-migrate-db docker-run-backend docker-run-frontend

# Docker Setup

docker-up: docker-up-builder docker-up-database docker-up-frontend


docker-up-builder:
	docker compose up --build -d --remove-orphans builder

docker-up-database:
	docker compose up --build -d --remove-orphans database

docker-up-frontend:
	docker compose up --build -d --remove-orphans frontend


docker-stop:
	docker compose stop

docker-connect-builder:
	docker compose exec -it builder /bin/bash


# Goku Generation

docker-goku-generate: docker-up-builder
	docker compose exec builder make -C /go-goku/app goku-generate

goku-generate: check-env-GOKU_BIN_DIR clean
	@echo "$(YELLOW)Running Goku...$(RESET)"
		${GOKU_BIN_DIR}/$(GOKU_BINARY_NAME) generate

# Migration

docker-migrate-db: docker-up-builder docker-up-database
	docker compose exec builder make migrate-db


migrate-db: create-dbs generate-db-migration remove-empty-migration-files run-db-migration

# Backend

docker-build-backend: docker-up-builder
	docker compose exec builder make build-backend

docker-run-backend: docker-up-builder docker-up-database
	docker compose exec builder make run-backend


build-backend: check-env-GOKU_BIN_DIR
	$(GO) mod tidy && \
	$(GO) build -o ${GOKU_BIN_DIR}/goku-app $(PATH_TO_APP)/backend/main.go

run-backend: check-env-GOKU_BIN_DIR build-backend migrate-db
	GOKU_APP_PATH=$(PATH_TO_APP) \
	${GOKU_BIN_DIR}/goku-app

# Frontend
PATH_TO_FRONTEND_ADMIN=$(PATH_TO_APP)/frontend/admin

docker-build-frontend-admin: docker-up-builder
	docker compose exec builder make build-frontend-admin

docker-install-frontend-admin: 
	docker compose exec frontend make install-frontend-admin

docker-run-frontend-admin: docker-up-builder docker-up-database
	docker compose up --build frontend

docker-logs-frontend-admin:
	docker compose logs -f frontend


build-frontend-admin:
	yarn --ignore-engines --cwd=$(PATH_TO_FRONTEND_ADMIN)

install-frontend-admin:
	yarn --ignore-engines --cwd=$(PATH_TO_FRONTEND_ADMIN) install

run-frontend-admin: build-frontend-admin
	yarn --ignore-engines --cwd=$(PATH_TO_FRONTEND_ADMIN) start

# Database 

docker-run-database: docker-up-database

docker-logs-database:
	docker compose logs -f database

docker-connect-database:
	docker compose exec builder make connect-db


connect-db:
	psql -h ${DATABASE_HOST} -p 5432 --username=${POSTGRES_USERNAME} --db=postgres

# -- Database: Create Databases (so we can create migrations)
create-dbs:
	@echo "$(YELLOW)Creating databases (if needed)...$(RESET)"
	@xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -I{} ./scripts/db_create.sh {}

# - Database: Generate migration SQL scripts
CMD_RM_MIGRATION=rm -rf $(PATH_TO_APP)/db/migration/future/*
CMD_CREATE_MIGRATION_FOLDER_FUTURE=mkdir -p $(PATH_TO_APP)/db/migration/future/{}
CMD_CREATE_MIGRATION_FOLDER_PRESENT=mkdir -p $(PATH_TO_APP)/db/migration/present/{}
CMD_CREATE_MIGRATION_FOLDER_PAST=mkdir -p $(PATH_TO_APP)/db/migration/past/{}
CMD_GENERATE_DB_MIGRATION=yamltodb -H ${DATABASE_HOST} -p 5432 -U ${POSTGRES_USERNAME} -r $(PATH_TO_APP)/db/schema/{} -c $(PATH_TO_APP)/db/pyrseas-yamltodb.config.yaml -m -o $(PATH_TO_APP)/db/migration/future/{}/db.{}.migration.sql {}
generate-db-migration: create-dbs
	@echo "$(YELLOW)Generating DB Migrations...$(RESET)"
	$(CMD_RM_MIGRATION) && \
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_CREATE_MIGRATION_FOLDER_FUTURE) && \
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_CREATE_MIGRATION_FOLDER_PRESENT) && \
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_CREATE_MIGRATION_FOLDER_PAST) && \
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_GENERATE_DB_MIGRATION)

# - Database: Run the migrations: Move the migration.sql file to 'present', run it, move it to 'past'
CMD_MOVE_MIGRATIONS_TO_PRESENT=mv $(PATH_TO_APP)/db/migration/future/{}/db.{}.migration.sql $(PATH_TO_APP)/db/migration/present/{}/db.{}.migration.sql
CMD_MOVE_MIGRATIONS_TO_PAST=mv $(PATH_TO_APP)/db/migration/present/{}/db.{}.migration.sql $(PATH_TO_APP)/db/migration/past/{}/db.{}.$$(date +%Y_%m_%d_%H%M%S).migration.sql
CMD_RUN_MIGRATIONS=psql -h ${DATABASE_HOST} -p 5432 --username=${POSTGRES_USERNAME} --dbname={} --single-transaction --file=$(PATH_TO_APP)/db/migration/present/{}/db.{}.migration.sql
run-db-migration:
	@echo "$(YELLOW)Running DB Migrations...$(RESET)"
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_MOVE_MIGRATIONS_TO_PRESENT) && \
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_RUN_MIGRATIONS) && \
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_MOVE_MIGRATIONS_TO_PAST)

CMD_TO_DELETE_EMPTY_FILES_IN_DIR=find $(PATH_TO_APP)/db/migration/past/{} -size  0 -print -delete
remove-empty-migration-files:
	@echo "$(YELLOW)Removing any empty migration files...$(RESET)"
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_TO_DELETE_EMPTY_FILES_IN_DIR)

clean-db-migration:
	@echo "$(YELLOW)Removing all migration generated files...$(RESET)"
	rm -rf ./bin/* && \
	rm -rf $(PATH_TO_APP)/db/schema/* && \
	rm -rf $(PATH_TO_APP)/db/migration/future/*


# Test Database

# - Test Database: Create a test database for each service, named <service>_test
CMD_CREATE_TEST_DB=./scripts/db_create.sh {}_test
create-test-dbs:
	DB_USER=${DB_USER} \
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -n 1 -I{} $(CMD_CREATE_TEST_DB) 

# - Test Databse: Migrations for the test-db: Copy schema of non-test TB to test-db
CMD_SYNC_TEST_DB=dbtoyaml {} | yamltodb --update {}_test
sync-test-dbs: create-test-dbs
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -n 1 -I{} sh -c "$(CMD_SYNC_TEST_DB)"

# Generic

# - Generic: Remove all generated & git ignored files.
clean: clean-db-migration
	@echo "$(YELLOW)Removing all goku.generated files...$(RESET)"
	find . -type d -name goku.generated -prune -exec rm -rf {} \;

check-env-GOKU_BIN_DIR:
ifndef GOKU_BIN_DIR
	$(error GOKU_BIN_DIR is undefined)
endif

# Database Setup/Reference Commands: Not needed often

db-start:
	pg_ctl -D /usr/local/var/postgres start
db-stop:
	pg_ctl -D /usr/local/var/postgres stop

db-destroy:
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -n 1 -I{} dropdb {}

CMD_DBTOYAML=dbtoyaml -c $(PATH_TO_APP)/db/pyrseas-dbtoyaml.config.yaml -r $(PATH_TO_APP)/db/schema/{} -m {}
dbtoyaml:
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_DBTOYAML)