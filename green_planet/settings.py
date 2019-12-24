"""
Django settings for green_planet project.

Generated by 'django-admin startproject' using Django 2.2.5.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LOGS_DIR = os.path.join(BASE_DIR, 'logs', 'djangoapp')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY", default='rn_%l0wj_8&*(ul^ym!ombwj%_u_+iifgkm^z*ivaxg@9o(8e+')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = int(os.getenv("DEBUG", default=1))

ALLOWED_HOSTS = ['зелёная-планета.рус', 'xn----7sbbavdj7acrev7b6l1a.xn--p1acf', 'www.xn----7sbbavdj7acrev7b6l1a.xn--p1acf', '192.168.99.100', '127.0.0.1', 'localhost', '3.125.59.80', 'ec2-3-125-59-80.eu-central-1.compute.amazonaws.com']


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'apps.green_planet_backend',
    'apps.green_planet_frontend',
    'apps.green_planet_frontend_react',
    'storages'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

REST_FRAMEWORK = {
    'DATE_INPUT_FORMATS': ['iso-8601', '%Y-%m-%d %H:%M:%S - %fZ'],
}

ROOT_URLCONF = 'green_planet.urls'



# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/
STATIC_ROOT = os.path.join(BASE_DIR, "deployment", "static")
STATIC_URL = '/static/'

#Default STATIC directory copied automatically
#STATICFILES_DIRS = (
#    os.path.join(BASE_DIR, "apps", "green_planet_frontend", "static"),
#)
# Local media bucket for uploaded images
MEDIA_ROOT = os.path.join(BASE_DIR, "uploaded", "images/")
MEDIA_URL = '/uploaded/images/'

# AWS S3 bucket for uploaded images
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
AWS_S3_REGION_NAME = os.getenv("AWS_S3_REGION_NAME")
AWS_DEFAULT_ACL = os.getenv("AWS_S3_REGION_NAME")
AWS_QUERYSTRING_AUTH = os.getenv("AWS_QUERYSTRING_AUTH") #Public S3 bucket
DEFAULT_FILE_STORAGE = os.getenv("DEFAULT_FILE_STORAGE")

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'green_planet.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': os.getenv("SQL_ENGINE", default="django.db.backends.sqlite3"),
        'NAME': os.getenv("SQL_DATABASE", default=os.path.join(BASE_DIR, "db.sqlite3")),
        'USER': os.getenv("SQL_USER"),
        'PASSWORD': os.getenv("SQL_PASSWORD"),
        'HOST': os.getenv("SQL_HOST"),
        'PORT': os.getenv("SQL_PORT"),
    }
}

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True
