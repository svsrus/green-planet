#!/bin/sh

echo 'Executing entrypoint.sh for Django database migration.'

if ["$DATABASE" = "postgres"]
then
    echo "Waiting for postgres..."
    sleep 10
    
    while ! nc -z $SQL_HOST $SQL_PORT; do
      echo "Sleeping for 10 seconds..."
      sleep 10
    done

    echo "PostgreSQL started"
fi

python manage.py migrate --no-input

exec "$@"