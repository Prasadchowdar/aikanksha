# Single task image: built once, reused for BOTH the agent run and the
# verifier run.
#
# Dynamo-specific rules enforced here:
#   * pytest and its plugins are PINNED and baked in, because tests/test.sh
#     is forbidden from installing anything at verify time. (This inverts
#     the stock Terminal-Bench guidance -- do not "fix" it.)
#   * This image NEVER contains solution/ or tests/. Harbor mounts tests/
#     at verify time; baking either one in invalidates the task.
#   * Pin every dependency so runs are reproducible.

FROM python:3.12-slim-bookworm

ENV DEBIAN_FRONTEND=noninteractive \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONDONTWRITEBYTECODE=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        coreutils \
        git \
        make \
    && rm -rf /var/lib/apt/lists/*

# Verifier toolchain -- pinned, installed at build time, never at test time.
RUN pip install --no-cache-dir \
        "pytest==8.4.1" \
        "pytest-json-ctrf==0.3.5"

# Task runtime dependencies -- pin exact versions.
# RUN pip install --no-cache-dir "numpy==2.1.3"

WORKDIR /app

# Seed files only: the starting state the agent explores. No solution, no tests.
COPY app/ /app/
