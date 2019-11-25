""" Gunicorn Server Configuration """
from multiprocessing import cpu_count
from os import environ

def max_workers():
    return cpu_count() * 2 + 1

bind = '0.0.0.0:' + environ.get('PORT', '8000')
max_requests = 1000
worker_class = 'gevent'
workers = max_workers()
accesslog = "-" # STDOUT
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'
loglevel = "debug"
capture_output = True
enable_stdio_inheritance = True

env = {
    'DJANGO_SETTINGS_MODULE': 'green_planet.settings'
}

reload = True
name = 'green_planet'