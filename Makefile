
# Color Control Sequences for easy printing
RESET=\033[0m
RED=\033[31;1m
GREEN=\033[32;1m
YELLOW=\033[33;1m
BLUE=\033[34;1m
MAGENTA=\033[35;1m
CYAN=\033[36;1m
WHITE=\033[37;1m

# DIRs
CURRENT_DIR=$(shell pwd)
APP_NAME=$(shell basename ${CURRENT_DIR})

GOGOKU_ROOT_DIR ?= ${CURRENT_DIR}/..

CONTAINER_GOGOKU_ROOT_DIR = /go-goku
CONTAINER_APP_ROOT_DIR = ${CONTAINER_GOGOKU_ROOT_DIR}/${APP_NAME}


# Paths

# MAKE command that references the makefile to use within the container
MAKE=make -C ${CONTAINER_APP_ROOT_DIR} -f container.Makefile

# Group commands: do more than one thing at once
all: docker-all

stop: docker-stop

reset: docker-reset

destroy: docker-destroy

# Docker General Commands
docker-all: docker-up-builder docker-up-database docker-goku-generate docker-db-migrate docker-up-backend docker-up-frontend docker-logs

docker-logs:
	${DOCKER_UP_VARS} docker compose logs -f

docker-stop:
	${DOCKER_UP_VARS} docker compose stop

docker-reset: docker-stop docker-all

docker-destroy: docker-stop
	${DOCKER_UP_VARS} docker compose rm --force --stop --volumes


# Docker Setup

# GOKU_BIN_DIR_SRC needs to be set to the folder on the host that contains the built goku binaries. We will copy/mount the required goku binary from here.
GOKU_BIN_DIR_SRC ?= ${GOGOKU_ROOT_DIR}/goku/bin
DOCKER_GO_OS_ARCH=linux_amd64
GOKU_BIN_NAME=goku.${DOCKER_GO_OS_ARCH}.latest

# DOCKER_CMD simply calls `docker` but with some env variables setup which may be needed in the docker-compose.yml or Dockerfile
DOCKER_UP_VARS=GOKU_BIN_DIR_SRC=${GOKU_BIN_DIR_SRC} GOKU_BIN_NAME=${GOKU_BIN_NAME} GOGOKU_ROOT_DIR=${GOGOKU_ROOT_DIR} CONTAINER_APP_ROOT_DIR=${CONTAINER_APP_ROOT_DIR}

docker-status: 
	${DOCKER_UP_VARS} docker compose ps

docker-up-builder:
	${DOCKER_UP_VARS} docker compose up --build -d --remove-orphans builder

docker-up-database:
	${DOCKER_UP_VARS} docker compose up --build -d --remove-orphans database

docker-up-backend:
	${DOCKER_UP_VARS} docker compose up --build -d --remove-orphans backend

docker-up-frontend:
	${DOCKER_UP_VARS} docker compose up --build -d --remove-orphans frontend


# Goku Generation / Builder

docker-goku-generate: docker-up-builder
	${DOCKER_UP_VARS} docker compose exec -it builder ${MAKE} goku-generate

docker-connect-builder:
	${DOCKER_UP_VARS} docker compose exec -it builder /bin/bash

# Migration

docker-db-migrate: docker-up-builder docker-up-database
	${DOCKER_UP_VARS} docker compose exec builder ${MAKE} db-migrate


# Database 

docker-database-run: docker-up-database

docker-logs-database:
	${DOCKER_UP_VARS} docker compose logs -f database

docker-connect-database:
	${DOCKER_UP_VARS} docker compose exec builder ${MAKE} connect-db

# Backend

docker-backend-build: docker-up-builder
	${DOCKER_UP_VARS} docker compose exec backend ${MAKE} backend-build

docker-backend-build-dev: docker-up-builder
	${DOCKER_UP_VARS} docker compose exec backend ${MAKE} backend-build-dev

docker-backend-run: docker-up-database docker-up-backend
	${DOCKER_UP_VARS} docker compose exec backend ${MAKE} backend-run

docker-logs-backend:
	${DOCKER_UP_VARS} docker compose logs -f backend

docker-connect-backend:
	${DOCKER_UP_VARS} docker compose exec -it backend /bin/bash

docker-stop-backend:
	${DOCKER_UP_VARS} docker compose stop backend

docker-restart-backend:
	${DOCKER_UP_VARS} docker compose restart backend

# Frontend

docker-frontend-admin-install: docker-up-frontend
	${DOCKER_UP_VARS} docker compose exec -it frontend ${MAKE} frontend-admin-install

docker-frontend-admin-run:
	${DOCKER_UP_VARS} docker compose exec -it frontend ${MAKE} frontend-admin-run

docker-frontend-admin-run-bg:
	${DOCKER_UP_VARS} docker compose exec -it -d frontend ${MAKE} frontend-admin-run

docker-logs-frontend:
	${DOCKER_UP_VARS} docker compose logs -f frontend

docker-connect-frontend: docker-up-frontend
	${DOCKER_UP_VARS} docker compose exec -it frontend /bin/sh

docker-restart-frontend:
	${DOCKER_UP_VARS} docker compose restart frontend
