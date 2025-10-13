#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "[entrypoint] Running db:prepare"
  bundle exec rails db:prepare
else
  echo "[entrypoint] DATABASE_URL not set. Skip db:prepare"
fi

exec "$@"
