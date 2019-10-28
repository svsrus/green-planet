""" GREEN PLANET BACKEND - views module """
import json
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from .models import Article
from .models_serializers import ArticleSerializer

class LatestArticlesView(APIView):
    """ API View Class is responsible for delivering latest articles """

    def get(self, request):
        """ Method searches lastest published articles and returns this list as JSON """
        articles = Article.objects.filter().order_by('-article_id')[:3]
        article_serializer = ArticleSerializer(articles, many=True)
        articles_json = article_serializer.data
        return Response(articles_json)

class ArticleView(APIView):
    """ API View Class is responsible for managing article entity """

    def get(self, request, article_id=None):
        """ Method searches article by a given id in request, and returns it as JSON """
        article = Article.objects.get(pk=article_id)
        article_serializer = ArticleSerializer(article, many=False)
        articles_json = article_serializer.data
        return Response(articles_json)

    def post(self, request):
        """ Method gets all article data, validates, and saves it in database """
        article_serializer = ArticleSerializer(data=request.data)
        if article_serializer.is_valid():
            article_serializer.save()
            return Response(article_serializer.data, status=status.HTTP_201_CREATED)
        return Response(article_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """ Method gets all article data, validates, and saves it in database """
        article_serializer = ArticleSerializer(data=request.data)
        if article_serializer.is_valid():
            article_serializer.save()
            return Response(article_serializer.data, status=status.HTTP_200_OK)
        return Response(article_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArticleRepresentationView(APIView):
    """ API View Class is responsible for managing article representations """

    def put(self, request):
        """ Method updates Article with article representations and saves it in database """
        data = json.loads(request.data["json_data"])

        #Setting a list of images to the json, to pass images though validations
        files = request.FILES.getlist('image[]')
        for i in range(len(files)):
            data["article_representations"][i]["representation"]["image_file"] = files[i]

        article = Article.objects.get(pk=data["article_id"])
        article_serializer = ArticleSerializer(article, data=data, partial=True)
        if article_serializer.is_valid():
            article_serializer.save()
            return Response(article_serializer.data, status=status.HTTP_200_OK)
        return Response(article_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
