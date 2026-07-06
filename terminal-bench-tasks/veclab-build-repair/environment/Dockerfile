FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        make \
        nano \
        vim-tiny \
    && rm -rf /var/lib/apt/lists/*

COPY app/ /app/

WORKDIR /app
