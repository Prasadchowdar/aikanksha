FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
        python3-setuptools \
        python3-wheel \
        nano \
        vim-tiny \
    && rm -rf /var/lib/apt/lists/*

COPY app/ /app/

WORKDIR /app
