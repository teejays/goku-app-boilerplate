
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

# GOGOKU_ROOT_DIR is the root directory of go-goku on the host machine.
# This is needed for us to copy/mount and use the local code for external packages.our builder to able to run goku binary.
GOGOKU_ROOT_DIR ?=

# GOKU_BIN_DIR is the directory on the host that contains the built goku binaries. We will copy/mount the required goku binary from here.
# This is needed for our builder to able to run goku binary.
GOKU_BIN_DIR ?=

# Variables corresponding paths within the container
CONTAINER_GOGOKU_ROOT_DIR = /go-goku
CONTAINER_APP_ROOT_DIR = ${CONTAINER_GOGOKU_ROOT_DIR}/${APP_NAME}
# CONTAINER_MAKE command that references the makefile to use within the container
CONTAINER_MAKE_FILE_NAME = makefile.container.mk
CONTAINER_MAKE=make -C ${CONTAINER_APP_ROOT_DIR} -f ${CONTAINER_MAKE_FILE_NAME}

DOCKER_GO_OS_ARCH=linux_amd64
GOKU_BIN_NAME=goku.${DOCKER_GO_OS_ARCH}.latest

# DOCKER_CMD simply calls `docker` but with some env variables setup which may be needed in the docker-compose.yml or Dockerfile
DOCKER_UP_VARS=APP_NAME=${APP_NAME} GOKU_BIN_DIR=${GOKU_BIN_DIR} GOKU_BIN_NAME=${GOKU_BIN_NAME} GOGOKU_ROOT_DIR=${GOGOKU_ROOT_DIR} CONTAINER_APP_ROOT_DIR=${CONTAINER_APP_ROOT_DIR} CONTAINER_MAKE_FILE_NAME=${CONTAINER_MAKE_FILE_NAME}

# Group commands: do more than one thing at once
all: docker-all

stop: docker-stop

reset: docker-reset

destroy: docker-destroy

# Docker General Commands
docker-all: docker-builder-up docker-database-up docker-builder-goku-generate docker-builder-db-migrate docker-backend-up docker-frontend-up docker-logs

docker-logs:
	${DOCKER_UP_VARS} docker compose logs -f

docker-stop:
	${DOCKER_UP_VARS} docker compose stop

docker-reset: docker-stop docker-all

docker-destroy: docker-stop
	${DOCKER_UP_VARS} docker compose rm --force --stop --volumes


# Docker Setup

docker-status: 
	${DOCKER_UP_VARS} docker compose ps

docker-builder-up:
	${DOCKER_UP_VARS} docker compose up --build -d --remove-orphans builder

docker-database-up:
	${DOCKER_UP_VARS} docker compose up --build -d --remove-orphans database

docker-backend-up:
	${DOCKER_UP_VARS} docker compose up --build -d --remove-orphans backend

docker-frontend-up:
	${DOCKER_UP_VARS} docker compose up --build -d --remove-orphans frontend


# Goku Generation / Builder

docker-builder-stop:
	${DOCKER_UP_VARS} docker compose stop builder

docker-builder-restart:
	${DOCKER_UP_VARS} docker compose restart builder


docker-builder-goku-generate: docker-builder-up
	${DOCKER_UP_VARS} docker compose exec -it builder ${CONTAINER_MAKE} goku-generate


docker-builder-connect:
	${DOCKER_UP_VARS} docker compose exec -it builder /bin/bash

# Migration

docker-builder-db-migrate: docker-builder-up 
	${DOCKER_UP_VARS} docker compose exec builder ${CONTAINER_MAKE} db-migrate


# Database 

docker-database-run: docker-database-up

docker-database-logs:
	${DOCKER_UP_VARS} docker compose logs -f database

docker-database-connect:
	${DOCKER_UP_VARS} docker compose exec builder ${CONTAINER_MAKE} connect-db

# Backend

docker-backend-build: docker-builder-up
	${DOCKER_UP_VARS} docker compose exec backend ${CONTAINER_MAKE} backend-build

docker-backend-run: docker-database-up docker-backend-up
	${DOCKER_UP_VARS} docker compose exec backend ${CONTAINER_MAKE} backend-run

docker-backend-logs:
	${DOCKER_UP_VARS} docker compose logs -f backend

docker-backend-connect:
	${DOCKER_UP_VARS} docker compose exec -it backend /bin/bash

docker-backend-stop:
	${DOCKER_UP_VARS} docker compose stop backend

docker-backend-restart:
	${DOCKER_UP_VARS} docker compose restart backend

# Frontend

docker-frontend-admin-install: docker-up-frontend
	${DOCKER_UP_VARS} docker compose exec -it frontend ${CONTAINER_MAKE} frontend-admin-install

docker-frontend-admin-run:
	${DOCKER_UP_VARS} docker compose exec -it frontend ${CONTAINER_MAKE} frontend-admin-run

docker-frontend-admin-run-bg:
	${DOCKER_UP_VARS} docker compose exec -it -d frontend ${CONTAINER_MAKE} frontend-admin-run

docker-frontend-logs:
	${DOCKER_UP_VARS} docker compose logs -f frontend

docker-frontend-conect: docker-up-frontend
	${DOCKER_UP_VARS} docker compose exec -it frontend /bin/sh

docker-frontend-restart:
	${DOCKER_UP_VARS} docker compose restart frontend
