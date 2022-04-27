#/bin/bash

if [ $# -eq 0 ]
  then
    echo "Error: Please provide a database lib/name"
    exit 1
fi
echo "Ensuring Database exists: $1"
PGPASSWORD=${POSTGRES_PASSWORD} psql -h ${DATABASE_HOST} -p 5432 --username=${POSTGRES_USERNAME} --dbname=postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$1'" | grep -q 1 || PGPASSWORD=${POSTGRES_PASSWORD} psql -h ${DATABASE_HOST} -p 5432 --username=${POSTGRES_USERNAME} --dbname=postgres -c "CREATE DATABASE \"$1\""