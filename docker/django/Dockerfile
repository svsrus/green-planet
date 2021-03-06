# Base lite image
FROM python:3.6-alpine

# Author
LABEL Sergei Shurpenkov

# Prevents Python from writing pyc files to disc (equivalent to python -B option)
ENV PYTHONDONTWRITEBYTECODE 1
# Prevents Python from buffering stdout and stderr (equivalent to python -u option)
ENV PYTHONUNBUFFERED 1

# PILLOW Python Library image dependencies
RUN apk --upgrade add libxml2-dev libxslt-dev libffi-dev gcc musl-dev libgcc openssl-dev curl
RUN apk --upgrade add libjpeg jpeg-dev zlib tiff freetype lcms libwebp tcl openjpeg

# POSTGRE Python Library dependencies
RUN apk --upgrade add --no-cache postgresql-libs postgresql-dev

# For I18N messages
RUN apk --upgrade add gettext

# Application and its dependencies install
RUN mkdir -p /appvol/green_planet
WORKDIR /appvol/green_planet
COPY requirements.txt /appvol/green_planet

RUN pip install -r requirements.txt

COPY . /appvol/green_planet/

# Collecting static files for nginx server
RUN python manage.py collectstatic --noinput

# Converting windows saved SH file to linux format
RUN dos2unix /appvol/green_planet/docker/django/entrypoint.sh

# Applying execute permissions for SH file
RUN chmod +x /appvol/green_planet/docker/django/entrypoint.sh