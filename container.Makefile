
# This makefile contains commands to be run directly in the environment which has goku/app setup. In our case, it means these should be run from within the docker containers.

# Color Control Sequences for easy printing
RESET=\033[0m
RED=\033[31;1m
GREEN=\033[32;1m
YELLOW=\033[33;1m
BLUE=\033[34;1m
MAGENTA=\033[35;1m
CYAN=\033[36;1m
WHITE=\033[37;1m

# GOKU_BINARY_NAME is the name of goku binary that can be used in the docker. It will be copied from the source.
# Get what Go os_arch does the docker use, this will allow us to find and copy the correct goku binary file
GOOS=$(shell go env GOOS)
GOARCH=$(shell go env GOARCH)
GOKU_BINARY_NAME=goku.$(GOOS)_$(GOARCH).latest

# DIRs
CURRENT_DIR=$(shell pwd)
APP_NAME=$(shell basename ${CURRENT_DIR})

GOGOKU_ROOT_DIR ?= /go-goku
APP_ROOT_DIR=${CURRENT_DIR}
#${GOGOKU_ROOT_DIR}/${APP_NAME}

# GOKU_BIN_DIR is the dir in the container where goku binary will be put
GOKU_BIN_DIR = ${GOGOKU_ROOT_DIR}/goku/bin

# APP_BIN_DIR is the dir in the container where app binary will be put
APP_BIN_DIR ?= ${APP_ROOT_DIR}/bin

# # # # # # # # #
# Goku Generation
# # # # # # # # #
goku-generate: goku-clean
	@echo "$(YELLOW)Running Goku...$(RESET)"
	${GOKU_BIN_DIR}/$(GOKU_BINARY_NAME) generate


# # # # # # # # #
# Migration
# # # # # # # # #

db-migrate: dbs-create db-migration-generate db-migration-remove-empty-files db-migration-run

# # # # # # # # #
# Database
# # # # # # # # #

connect-db:
	psql -h ${DATABASE_HOST} -p 5432 --username=${POSTGRES_USERNAME} --db=postgres

# # # # # # # # #
# Backend
# # # # # # # # #

# Always run the command from /go-goku, because that would be more consistent with with go workspace calls (for development)

GO=go
CMD_BACKEND_BUILD=$(GO) build -o ${APP_BIN_DIR}/app $(APP_ROOT_DIR)/backend/main.go
CMD_BACKEND_RUN=GOKU_APP_PATH=$(APP_ROOT_DIR) ${APP_BIN_DIR}/app

backend-go-mod:
	$(GO) mod tidy

backend-build: backend-go-mod
	${CMD_BACKEND_BUILD}

+# This command is the same as above `backend-build` but calls the build from the parent GOGOKU dir,
+# which allows it to use the Go workspace (which points to local modules)
+backend-build-dev: backend-go-mod
	cd ${GOGOKU_ROOT_DIR}
	APP_NAME=${APP_NAME} make -C ${GOGOKU_ROOT_DIR} go-work-init-app
	${CMD_BACKEND_BUILD}
	cd ${CURRENT_DIR}

backend-run:
	${CMD_BACKEND_RUN}

backend: backend-build backend-run
backend-dev: backend-build-dev backend-run


# # # # # # # # #
# Frontend
# # # # # # # # #

CMD_FRONTEND_ADMIN_INSTALL=yarn workspace admin install
CMD_FRONTEND_ADMIN_RUN=yarn workspace admin start

frontend-admin-install:
	${CMD_FRONTEND_ADMIN_INSTALL}

frontend-admin-run: frontend-admin-install
	${CMD_FRONTEND_ADMIN_RUN}


# # # # # # # # #
# Database: Creation + Migration
# # # # # # # # #

DB_USER=${USER}
dbs-create:
	@echo "$(YELLOW)Creating databases (if needed)...$(RESET)"
	@xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -I{} ./scripts/db_create.sh {}

# - Database: Generate migration SQL scripts
CMD_RM_MIGRATION=rm -rf $(APP_ROOT_DIR)/db/migration/future/*
CMD_CREATE_MIGRATION_FOLDER_FUTURE=mkdir -p $(APP_ROOT_DIR)/db/migration/future/{}
CMD_CREATE_MIGRATION_FOLDER_PRESENT=mkdir -p $(APP_ROOT_DIR)/db/migration/present/{}
CMD_CREATE_MIGRATION_FOLDER_PAST=mkdir -p $(APP_ROOT_DIR)/db/migration/past/{}
CMD_GENERATE_DB_MIGRATION=yamltodb -H ${DATABASE_HOST} -p 5432 -U ${POSTGRES_USERNAME} -r $(APP_ROOT_DIR)/db/schema/{} -c $(APP_ROOT_DIR)/db/pyrseas-yamltodb.config.yaml -m -o $(APP_ROOT_DIR)/db/migration/future/{}/db.{}.migration.sql {}
db-migration-generate: dbs-create
	@echo "$(YELLOW)Generating DB Migrations...$(RESET)"
	$(CMD_RM_MIGRATION) && \
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -t -I{} $(CMD_CREATE_MIGRATION_FOLDER_FUTURE) && \
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -t -I{} $(CMD_CREATE_MIGRATION_FOLDER_PRESENT) && \
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -t -I{} $(CMD_CREATE_MIGRATION_FOLDER_PAST) && \
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -t -I{} $(CMD_GENERATE_DB_MIGRATION)

# - Database: Run the migrations: Move the migration.sql file to 'present', run it, move it to 'past'
CMD_MOVE_MIGRATIONS_TO_PRESENT=mv $(APP_ROOT_DIR)/db/migration/future/{}/db.{}.migration.sql $(APP_ROOT_DIR)/db/migration/present/{}/db.{}.migration.sql
CMD_MOVE_MIGRATIONS_TO_PAST=mv $(APP_ROOT_DIR)/db/migration/present/{}/db.{}.migration.sql $(APP_ROOT_DIR)/db/migration/past/{}/db.{}.$$(date +%Y_%m_%d_%H%M%S).migration.sql
CMD_RUN_MIGRATIONS=psql -h ${DATABASE_HOST} -p 5432 --username=${POSTGRES_USERNAME} --dbname={} --single-transaction --file=$(APP_ROOT_DIR)/db/migration/present/{}/db.{}.migration.sql
db-migration-run:
	@echo "$(YELLOW)Running DB Migrations...$(RESET)"
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -t -I{} $(CMD_MOVE_MIGRATIONS_TO_PRESENT) && \
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -t -I{} $(CMD_RUN_MIGRATIONS) && \
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -t -I{} $(CMD_MOVE_MIGRATIONS_TO_PAST)

CMD_TO_DELETE_EMPTY_FILES_IN_DIR=find $(APP_ROOT_DIR)/db/migration/past/{} -size  0 -print -delete
db-migration-remove-empty-files:
	@echo "$(YELLOW)Removing any empty migration files...$(RESET)"
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -t -I{} $(CMD_TO_DELETE_EMPTY_FILES_IN_DIR)

db-migration-clean:
	@echo "$(YELLOW)Removing all migration generated files...$(RESET)"
	rm -rf $(APP_ROOT_DIR)/db/schema/* && \
	rm -rf $(APP_ROOT_DIR)/db/migration/future/*


# Test Database

# - Test Database: Create a test database for each service, named <service>_test
CMD_CREATE_TEST_DB=./scripts/db_create.sh {}_test
dbs-test-create:
	DB_USER=${DB_USER} \
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -n 1 -I{} $(CMD_CREATE_TEST_DB) 

# - Test Databse: Migrations for the test-db: Copy schema of non-test TB to test-db
CMD_SYNC_TEST_DB=dbtoyaml {} | yamltodb --update {}_test
dbs-test-sync: dbs-test-create
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -n 1 -I{} sh -c "$(CMD_SYNC_TEST_DB)"

# # # # # # # # #
# Utils
# # # # # # # # #

# Remove all generated & git ignored files.
goku-clean: db-migration-clean
	@echo "$(YELLOW)Removing all goku.generated files...$(RESET)"
	find . -type d -name goku.generated -prune -exec rm -rf {} \;

backend-clean: 
	go clean -modcache
	go clean -cache
	rm $(APP_ROOT_DIR)/go.sum

frontend-clean: 
	yarn cache clean
	yarn workspace admin cache clean
	rm -rf $(APP_ROOT_DIR)/node_modules
	rm -rf $(APP_ROOT_DIR)/frontend/admin/node_modules
	rm $(APP_ROOT_DIR)/yarn.lock

# cleans remove a lot of things that don't need to be in the repository
clean: goku-clean frontend-clean
	rm -rf $(APP_ROOT_DIR)/bin
	rm -rf $(APP_ROOT_DIR)/debug

# # # # # # # # #
# Database Setup/Reference Commands:
#	- Not needed often
# # # # # # # # #

db-start:
	pg_ctl -D /usr/local/var/postgres start
db-stop:
	pg_ctl -D /usr/local/var/postgres stop

db-destroy:
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -n 1 -I{} dropdb {}

CMD_DBTOYAML=dbtoyaml -c $(APP_ROOT_DIR)/db/pyrseas-dbtoyaml.config.yaml -r $(APP_ROOT_DIR)/db/schema/{} -m {}
dbtoyaml:
	xargs -a $(APP_ROOT_DIR)/db/schema/databases.generated.txt -t -I{} $(CMD_DBTOYAML)