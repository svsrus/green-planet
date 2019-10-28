""" Green Planet Backend custom exception handler """
from rest_framework.views import exception_handler
from .logger import logging

LOGGER = logging.getLogger(__name__)

def custom_exception_handler(exception, context):
    """ Method logs exception and send response to client """
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exception, context)

    LOGGER.exception(exception)

    return response
