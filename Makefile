
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
GOKU=goku

# Paths
CURRENT_DIR=$(shell pwd)

PATH_TO_APP=.
APP_NAME=$(shell basename "${PWD}")
PATH_TO_MODELS=$(PATH_TO_APP)/models/example.json
PATH_TO_GEN=../goku/generator
DB_USER=${USER}

# Group commands: do more than one thing at once
all: clean goku-generate db-start-if-stopped create-dbs generate-db-migration migrate-db remove-empty-migration-files

generate: clean goku-generate 

check-env-GOKU_BIN_DIR:
ifndef GOKU_BIN_DIR
	$(error GOKU_BIN_DIR is undefined)
endif

# Run Commands: 

goku-generate: check-env-GOKU_BIN_DIR clean
	@echo "$(YELLOW)Running Goku...$(RESET)"
		${GOKU_BIN_DIR}/goku \
		--generator-dir="$(PATH_TO_GEN)" \
		--models-json-file="$(PATH_TO_MODELS)" \
		--app-root-dir="$(PATH_TO_APP)" \
		--app-go-module-name="github.com/teejays/goku-example-one" \
		--sql-yaml-schema=true --sql-yaml-schema-dir="$(PATH_TO_APP)/db/schema" \
		--golang-type-definitions=true --golang-type-definitions-dir="$(PATH_TO_APP)/backend/types" \
		--golang-meta-info=true --golang-meta-info-dir="$(PATH_TO_APP)/backend/meta" \
 		--golang-dal=true --golang-dal-dir="$(PATH_TO_APP)/backend/dal" \
		--golang-type-filters=true --golang-type-filters-dir="$(PATH_TO_APP)/backend/filters" \
		--golang-generics=true --golang-generics-dir="$(PATH_TO_APP)/backend" \
		--golang-methods=true --golang-methods-dir="$(PATH_TO_APP)/backend/methods" \
		--golang-http-handlers=true --golang-http-handlers-dir="$(PATH_TO_APP)/backend/httphandlers" \
		--golang-db-connection=true --golang-db-connection-dir="$(PATH_TO_APP)/backend" \
		--type-script-types=true --type-script-types-dir="$(PATH_TO_APP)/frontend/admin/src" \
		--graphql-schema=true --graphql-schema-dir="$(PATH_TO_APP)/backend" \
		--graphql-resolver=true --graphql-resolver-dir="$(PATH_TO_APP)/backend"

docker-goku-generate:
	docker compose exec builder make -C /go-goku/app goku-generate

# Generate migration SQL scripts
CMD_RM_MIGRATION=rm -rf $(PATH_TO_APP)/db/migration/future/*
CMD_CREATE_MIGRATION_FOLDER_FUTURE=mkdir -p $(PATH_TO_APP)/db/migration/future/{}
CMD_CREATE_MIGRATION_FOLDER_PRESENT=mkdir -p $(PATH_TO_APP)/db/migration/present/{}
CMD_CREATE_MIGRATION_FOLDER_PAST=mkdir -p $(PATH_TO_APP)/db/migration/past/{}
CMD_GENERATE_DB_MIGRATION=yamltodb -H ${DATABASE_HOST} -p 5432 -U ${POSTGRES_USERNAME} -r $(PATH_TO_APP)/db/schema/{} -c $(PATH_TO_APP)/db/pyrseas-yamltodb.config.yaml -m -o $(PATH_TO_APP)/db/migration/future/{}/db.{}.migration.sql {}
generate-db-migration: create-dbs
	@echo "$(YELLOW)Generating DB Migrations...$(RESET)"
	$(CMD_RM_MIGRATION) && \
	xargs -t -I{} $(CMD_CREATE_MIGRATION_FOLDER_FUTURE) <$(PATH_TO_APP)/db/schema/databases.generated.txt && \
	xargs -t -I{} $(CMD_CREATE_MIGRATION_FOLDER_PRESENT) <$(PATH_TO_APP)/db/schema/databases.generated.txt && \
	xargs -t -I{} $(CMD_CREATE_MIGRATION_FOLDER_PAST) <$(PATH_TO_APP)/db/schema/databases.generated.txt && \
	xargs -t -I{} $(CMD_GENERATE_DB_MIGRATION) <$(PATH_TO_APP)/db/schema/databases.generated.txt

# Run the migrations: Move the migration.sql file to 'present', run it, move it to 'past'
CMD_MOVE_MIGRATIONS_TO_PRESENT=mv $(PATH_TO_APP)/db/migration/future/{}/db.{}.migration.sql $(PATH_TO_APP)/db/migration/present/{}/db.{}.migration.sql
CMD_MOVE_MIGRATIONS_TO_PAST=mv $(PATH_TO_APP)/db/migration/present/{}/db.{}.migration.sql $(PATH_TO_APP)/db/migration/past/{}/db.{}.$$(date +%Y_%m_%d_%H%M%S).migration.sql
CMD_RUN_MIGRATIONS=psql -h ${DATABASE_HOST} -p 5432 --username=${POSTGRES_USERNAME} --dbname={} --single-transaction --file=$(PATH_TO_APP)/db/migration/present/{}/db.{}.migration.sql
migrate-db:
	@echo "$(YELLOW)Running DB Migrations...$(RESET)"
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_MOVE_MIGRATIONS_TO_PRESENT) && \
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_RUN_MIGRATIONS) && \
	xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -t -I{} $(CMD_MOVE_MIGRATIONS_TO_PAST)

CMD_TO_DELETE_EMPTY_FILES_IN_DIR=find $(PATH_TO_APP)/db/migration/past/{} -size  0 -print -delete
remove-empty-migration-files:
	@echo "$(YELLOW)Removing any empty migration files...$(RESET)"
	xargs -t -I{} $(CMD_TO_DELETE_EMPTY_FILES_IN_DIR) <$(PATH_TO_APP)/db/schema/databases.generated.txt

# Migrations for the test-db: Copy schema of non-test TB to test-db
CMD_SYNC_TEST_DB=dbtoyaml {} | yamltodb --update {}_test
sync-test-dbs: create-test-dbs
	xargs -n 1 -I{} sh -c "$(CMD_SYNC_TEST_DB)" <$(PATH_TO_APP)/db/schema/databases.generated.txt

# Intent: Remove all generated & git ignored files.
clean:
	@echo "$(YELLOW)Removing all generated files...$(RESET)"
	rm -rf ./bin/* && \
	rm -rf $(PATH_TO_APP)/db/schema/* && \
	rm -rf $(PATH_TO_APP)/db/migration/future/* && \
	find . -type d -name goku.generated -prune -exec rm -rf {} \;

# Create Databases (so we can create migrations)
CMD_CREATE_DB=./scripts/db_create.sh {}
create-dbs:
	@echo "$(YELLOW)Creating databases (if needed)...$(RESET)"
	@xargs -a $(PATH_TO_APP)/db/schema/databases.generated.txt -I{} $(CMD_CREATE_DB)

# Create a test database for each service, named <service>_test
CMD_CREATE_TEST_DB=./scripts/db_create.sh {}_test
create-test-dbs:
	xargs -n 1 -I{} $(CMD_CREATE_TEST_DB) <$(PATH_TO_APP)/db/schema/databases.generated.txt DB_USER=${DB_USER}

# We need a postgres role in these databases
CMD_SETUP_DB_ROLES=psql -d {} -c "CREATE ROLE postgres WITH LOGIN SUPERUSER CREATEROLE CREATEDB REPLICATION;"
setup-db-roles:
	xargs -n 1 -I{} $(CMD_SETUP_DB_ROLES) <$(PATH_TO_APP)/db/schema/databases.generated.txt

# app-run
run-frontend: app-build-frontend-admin app-run-frontend-admin

build-backend:
	$(GO) build -o ${GOKU_BIN_DIR}/goku-app $(PATH_TO_APP)/backend/main.go

run-backend: check-env-GOKU_BIN_DIR build-backend
	GOKU_APP_PATH=$(PATH_TO_APP) \
	${GOKU_BIN_DIR}/goku-app

docker-run-backend:
ifdef ($(MAKE_GOKU_APP_DOCKER_BACKEND_SERVICE))
	docker compose exec ${MAKE_GOKU_APP_DOCKER_BACKEND_SERVICE} make -C /go-goku backend-run
else
	docker compose exec builder make -C /go-goku backend-run
endif

PATH_TO_FRONTEND_ADMIN=$(PATH_TO_APP)/frontend/admin

app-build-frontend-admin:
	yarn --cwd=$(PATH_TO_FRONTEND_ADMIN)

app-run-frontend-admin:
	yarn --cwd=$(PATH_TO_FRONTEND_ADMIN) start

# Reference Commands: not needed to run
db-start:
	pg_ctl -D /usr/local/var/postgres start
db-stop:
	pg_ctl -D /usr/local/var/postgres stop

db-start-if-stopped:
ifeq ($(shell pg_ctl -D /usr/local/var/postgres status > /dev/null; echo $$?),3)
	pg_ctl -D /usr/local/var/postgres start
endif

db-destroy:
	xargs -n 1 -I{} dropdb {} <$(PATH_TO_APP)/db/schema/databases.generated.txt

db-connect:
	psql -h ${DATABASE_HOST} -p 5432 --username=${POSTGRES_USERNAME} --db=postgres

CMD_DBTOYAML=dbtoyaml -c $(PATH_TO_APP)/db/pyrseas-dbtoyaml.config.yaml -r $(PATH_TO_APP)/db/schema/{} -m {}

dbtoyaml:
	xargs -t -I{} $(CMD_DBTOYAML) <$(PATH_TO_APP)/db/schema/databases.generated.txt

# Setup on a new machine
setup: setup-yamltodb setup-postgres
	brew install yamllint && \
	brew install python-yq

setup-postgres:
	brew install postgres

setup-yamltodb: setup-postgres
	python3 -m pip install --upgrade pip && \
	brew install openssl && \
	export LDFLAGS="-L/usr/local/opt/openssl@1.1/lib" && \
	export CPPFLAGS="-I/usr/local/opt/openssl@1.1/include" && \
	pip install psycopg2 && \
	pip3 install Pyrseas
