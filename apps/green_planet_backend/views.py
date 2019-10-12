""" GREEN PLANET BACKEND - views module """
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Article
from .models_serializers import ArticleSerializer

class LatestArticlesView(APIView):
    """ View Class is responsible for delivering latest articles """

    def get(self, request):
        """ Method searches lastest published articles and returns this list as JSON """
        articles = Article.objects.filter().order_by('-article_id')[:3]
        article_serializer = ArticleSerializer(articles, many=True)
        articles_json = article_serializer.data
        return Response(articles_json)

class ArticleView(APIView):
    """ View Class is responsible for managing article entity """

    def get(self, request, article_id=None):
        """ Method searches article by a given id in request, and returns it as JSON """
        article = Article.objects.get(pk=article_id)
        article_serializer = ArticleSerializer(article, many=False)
        articles_json = article_serializer.data
        return Response(articles_json)