""" Module green_planet_backend REST URL Configuration """
from django.urls import path
from .views import TestView

urlpatterns = [
    path('test', TestView.as_view(), name="test view"),
]
