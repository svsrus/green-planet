""" Green Planet Backend logger configuration for this app """
import os
import logging
from datetime import datetime
from green_planet import settings

logging.config.dictConfig({
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'console': {
            'format': '[%(asctime)s] %(name)-12s %(levelname)-8s %(message)s',
            'datefmt' : "%Y/%m/%d %H:%M:%S"
        },
        'file_formatter': {
            'format': '%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
            'datefmt' : "%Y/%m/%d %H:%M:%S"
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'console'
        },
        'log_file': {
            'level': 'INFO',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'when': 'D', # daily, you can use 'midnight' as well
            'backupCount': 100, # 100 days backup
            'formatter': 'file_formatter',
            'filename': os.path.join(
                settings.LOGS_DIR, '%s_application.log' % (datetime.now().strftime('%Y-%m-%d'))
            )
        },
    },
    'loggers': {
        '': {
            'level':  os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'handlers': ['console', 'log_file']
        },
        'django.request': {
            'level':  os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'handlers': ['console', 'log_file']
        }
    }
})
