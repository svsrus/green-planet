""" Module green_planet_backend REST URL Configuration """
from django.urls import path
from .views import IndexView

urlpatterns = [
    path('', IndexView.as_view(), name="index view"),
]
