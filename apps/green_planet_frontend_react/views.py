""" Module green_planet_frontend_react Views. """
from django.views.generic import TemplateView

class IndexView(TemplateView):
    """ Main Index view - redirects to one page template """
    template_name = "green_planet_frontend_react/index.html"
