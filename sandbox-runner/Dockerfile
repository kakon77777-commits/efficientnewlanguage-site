FROM docker.io/cloudflare/sandbox:0.7.0

# The base image does not actually include Python on PATH (verified live —
# `which python3` finds nothing) despite it being commonly assumed to;
# install the stdlib CPython interpreter explicitly for the MVP scope.
RUN apt-get update && apt-get install -y --no-install-recommends python3 && rm -rf /var/lib/apt/lists/*

EXPOSE 8080
