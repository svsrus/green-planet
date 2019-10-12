""" Module green_planet_backend REST URL Configuration """
from django.urls import path
from .views import ArticleView
from .views import LatestArticlesView

urlpatterns = [
    path('latestArticles/', LatestArticlesView.as_view(), name="latest_articles"),
    path('articles/<int:article_id>', ArticleView.as_view(), name="articles"),
    path('articles/', ArticleView.as_view(), name="articles"),
]
