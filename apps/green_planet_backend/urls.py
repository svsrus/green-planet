""" Module green_planet_backend Article REST URL Configuration with MEDIA_ROOT for debugging """
from django.urls import path
from .views import ArticleView
from .views import ArticleRepresentationView
from .views import LatestArticlesView

urlpatterns = [
    path('latestArticles/', LatestArticlesView.as_view(), name="latest_articles"),
    path('articles/<int:article_id>', ArticleView.as_view(), name="articles"),
    path('articles/', ArticleView.as_view(), name="articles"),
    path('articleRepresentations/', ArticleRepresentationView.as_view(), name="article_representations"),
]
