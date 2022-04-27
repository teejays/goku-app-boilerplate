# Could use ubuntu:20.04 image, but we need Go to build the Goku binary
FROM golang:1.18.1 AS goku_builder

# default workdir for this image is /go

# Optional: Create a user, with user dirs?

# Update System
RUN apt-get update && \
    apt-get install -y \
    git \
    openssh-client \
    openssl \
    python \
    libpq-dev \
    python3-pip \
    postgresql \
    npm \
    vim

RUN pip3 install psycopg2-binary
RUN pip3 install yamlfmt

RUN npm install --global yarn
RUN npm install --global prettier

# Access Goku: Need to install Goku binary (Why is it needed?) There are two ways of doing this:
# 1) Copy the binary from host? But then binary needs to be copied to the host folder where Docker has access
# 2) Clone Goku from Git, but need to have SSH access to the private git repo

# - Second approach: Setup SSH stuff so we can clone Goku private repo 
RUN mkdir ${HOME}/.ssh && \
    touch ${HOME}/.ssh/known_hosts && \
    touch ${HOME}/.ssh/config
RUN ssh-keyscan -H github.com >> ${HOME}/.ssh/known_hosts
RUN echo "Host github.com\n\tStrictHostKeyChecking no\n" >> ${HOME}/.ssh/config

ARG GIT_CLONE_GOKU
ARG GIT_CLONE_GOKU_UTIL

# Install yamltodb/dbtoyaml from Pyrseas.
# - Install from pip `RUN pip3 install Pyrseas` installs a slightly outdated version which does not have the latest commits 
# (e.g. https://github.com/perseas/Pyrseas/commit/8fd62a8d28610fe9a3210a2f787430c034e2d2d2 which solves a yamltodb Postgres 12+ compatibility issue) 
# Hence, we will download from git and build ourselves
RUN git clone https://github.com/perseas/Pyrseas.git
WORKDIR /go/Pyrseas
RUN python3 setup.py install

WORKDIR /go-goku

# - Create a symlink of "secret" private SSH key, to the needed directory.
# - - Note: Need to select/pass secret from docker-compose -> build -> secrets, to have it accesible here
RUN ln -s /run/secrets/ssh_private_key ${HOME}/.ssh/id_ed25519 
ARG CACHE_DATE=2021-04-23-v3
RUN --mount=type=secret,id=ssh_private_key if [ "$GIT_CLONE_GOKU" = "1" ]; then git clone -v git@github.com:teejays/goku.git; else echo "Skipping git clone: goku"; fi

# Go utils
RUN if [ "$GIT_CLONE_GOKU_UTIL" = "1" ]; then git clone -v https://github.com/teejays/goku-util.git; else echo "Skipping git clone: goku-util"; fi

ENTRYPOINT ["tail", "-f", "/dev/null"]