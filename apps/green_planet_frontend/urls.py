""" Module green_planet_backend REST URL Configuration """
from django.urls import path
from .views import IndexView
from .views import AboutView

urlpatterns = [
    path('', IndexView.as_view(), name="index_view"),
    path('about', AboutView.as_view(), name="about_view"),
]
