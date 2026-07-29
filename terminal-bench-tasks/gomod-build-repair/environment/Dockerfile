FROM golang:1.24-bookworm

ENV DEBIAN_FRONTEND=noninteractive \
    GOTOOLCHAIN=local \
    GOPROXY=off \
    GOFLAGS=-mod=mod

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        nano \
        vim-tiny \
    && rm -rf /var/lib/apt/lists/*

COPY app/ /app/

WORKDIR /app
