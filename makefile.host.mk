
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
APP_NAME?=$(shell basename ${CURRENT_DIR})

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
CONTAINER_MAKE=make -f ${CONTAINER_APP_ROOT_DIR}/${CONTAINER_MAKE_FILE_NAME}

DOCKER_GO_OS_ARCH=linux_amd64
GOKU_BIN_NAME=goku.${DOCKER_GO_OS_ARCH}.latest

# DOCKER_CMD simply calls `docker` but with some env variables setup which may be needed in the docker-compose.yml or Dockerfile
DOCKER_UP_VARS=APP_NAME=${APP_NAME} GOKU_BIN_DIR=${GOKU_BIN_DIR} GOKU_BIN_NAME=${GOKU_BIN_NAME} GOGOKU_ROOT_DIR=${GOGOKU_ROOT_DIR} CONTAINER_APP_ROOT_DIR=${CONTAINER_APP_ROOT_DIR} CONTAINER_MAKE_FILE_NAME=${CONTAINER_MAKE_FILE_NAME}

# Easy access commands
all: docker-builder-goku-generate docker-builder-db-migrate docker-up

goku-generate: docker-builder-goku-generate
db-migrate: docker-builder-db-migrate
backend-run: docker-backend-run
frontend-run: docker-frontend-run 

# Docker General Commands

docker-up:
	${DOCKER_UP_VARS} docker compose up --build  --remove-orphans backend frontend

docker-logs:
	${DOCKER_UP_VARS} docker compose logs -f

docker-stop:
	${DOCKER_UP_VARS} docker compose stop

docker-destroy:
	${DOCKER_UP_VARS} docker compose rm --force --stop --volumes

docker-status: 
	${DOCKER_UP_VARS} docker compose ps


# Builder

docker-builder-goku-generate:
	${DOCKER_UP_VARS} docker compose run --name goku_${APP_NAME}_builder --rm builder ${CONTAINER_MAKE} goku-generate

docker-builder-db-migrate: 
	${DOCKER_UP_VARS} docker compose run --name goku_${APP_NAME}_builder --rm builder ${CONTAINER_MAKE} db-migrate


docker-builder-connect:
	${DOCKER_UP_VARS} docker compose run --name goku_${APP_NAME}_builder --rm builder /bin/bash


# Database 

docker-database-logs:
	${DOCKER_UP_VARS} docker compose logs -f database

docker-database-connect:
	${DOCKER_UP_VARS} docker compose run --rm --service-ports builder ${CONTAINER_MAKE} connect-db

docker-database-up:
	${DOCKER_UP_VARS} docker compose up -d --build --remove-orphans database

docker-database-stop:
	${DOCKER_UP_VARS} docker compose stop database


# Backend

docker-backend: docker-backend-build docker-backend-run

docker-backend-build:
	${DOCKER_UP_VARS} docker compose run --name goku_${APP_NAME}_backend --rm backend ${CONTAINER_MAKE} backend-build

docker-backend-run:
	${DOCKER_UP_VARS} docker compose run --name goku_${APP_NAME}_backend --rm --service-ports backend ${CONTAINER_MAKE} backend-run

docker-backend-logs:
	${DOCKER_UP_VARS} docker compose logs -f backend

docker-backend-connect:
	${DOCKER_UP_VARS} docker compose run --name goku_${APP_NAME}_backend --rm backend /bin/bash

docker-backend-up:
	${DOCKER_UP_VARS} docker compose up --build --remove-orphans backend

docker-backend-stop:
	${DOCKER_UP_VARS} docker compose stop backend


# Frontend

docker-frontend-admin-install:
	${DOCKER_UP_VARS} docker compose run --name goku_${APP_NAME}_frontend --rm frontend ${CONTAINER_MAKE} frontend-admin-install

docker-frontend-admin-run:
	${DOCKER_UP_VARS} docker compose run --name goku_${APP_NAME}_frontend --rm frontend ${CONTAINER_MAKE} frontend-admin-run

docker-frontend-admin-run-bg:
	${DOCKER_UP_VARS} docker compose run --name goku_${APP_NAME}_frontend --rm -d frontend ${CONTAINER_MAKE} frontend-admin-run

docker-frontend-logs:
	${DOCKER_UP_VARS} docker compose logs -f frontend

docker-frontend-connect:
	${DOCKER_UP_VARS} docker compose run --rm frontend /bin/sh

docker-frontend-up:
	${DOCKER_UP_VARS} docker compose up --build --remove-orphans frontend

docker-frontend-stop:
	${DOCKER_UP_VARS} docker compose stop frontend
