#!/bin/sh

set -e

echo "Waiting for database..."

until python -c "
import os
import psycopg

psycopg.connect(
    dbname=os.environ['DB_NAME'],
    user=os.environ['DB_USER'],
    password=os.environ['DB_PASSWORD'],
    host=os.environ['DB_HOST'],
    port=os.environ['DB_PORT'],
).close()
"; do
    echo "Database unavailable - waiting..."
    sleep 2
done

echo "Database is ready."

exec "$@"