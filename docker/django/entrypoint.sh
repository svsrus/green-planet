#!/bin/sh

echo 'Executing entrypoint.sh for django database migration.'

SQL_DATABASE = ""
SQL_HOSTNAME = ""
SQL_PORT = ""
if ["$RDS_DB_NAME" = ""]
then
    echo "Assigning AWS RDS data..."
    SQL_DATABASE =  $RDS_DB_NAME
    SQL_HOSTNAME = $RDS_HOSTNAME
    SQL_PORT = $RDS_PORT
  else
    echo "Assigning Docker Compose data..."
    SQL_DATABASE =  $DATABASE
    SQL_HOSTNAME = $SQL_HOST
    SQL_PORT = $SQL_PORT
fi

if ["$SQL_DATABASE" != ""]
then
    echo "Waiting for postgres..."
    sleep 10
    
    while ! nc -z $SQL_HOSTNAME $SQL_PORT; do
      echo "Sleeping for 10 seconds..."
      sleep 10
    done

    echo "PostgreSQL started"
fi

python manage.py migrate --no-input

exec "$@"