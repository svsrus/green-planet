""" Django Admin configurations, registers all entities. """
from django.contrib import admin
from django.apps import apps

app = apps.get_app_config('green_planet_backend')
for model_name, model in app.models.items():
    admin.site.register(model)
