""" GREEN PLANET BACKEND - views module """
import os
import json
import boto3
import bleach
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .logger import logging
from .models import Article
from .models import ImageRepresentation
from .models_serializers import ArticleSerializer

LOGGER = logging.getLogger(__name__)
ALLOWED_HTML_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'span', 'div', 'label', 'a',
                     'br', 'p', 'b', 'i', 'del', 'strike', 'u', 'img', 'video', 'embed', 'param',
                     'blockquote', 'mark', 'cite', 'small', 'ul', 'ol', 'li', 'hr', 'dl', 'dt',
                     'dd', 'sup', 'sub', 'big', 'pre', 'code', 'figure', 'figcaption', 'strong',
                     'em', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot']
ALLOWED_HTML_TAG_ATTRIBUTES = ['alt', 'title', 'target', 'href', 'src', 'data-image', 'style',
                               'width', 'height']
ALLOWED_HTML_TAG_STYLES = ['text-align', 'width', 'height']
PAGE_SIZE = 9

class LatestArticlesView(APIView):
    """ API View Class is responsible for delivering latest articles """

    def get(self, request):
        """ Method searches lastest published articles and returns this list as JSON """
        LOGGER.info("Executing LatestArticlesView.get()")
        last_row = int(request.GET.get('shownArticlesCount')) \
                        if "shownArticlesCount" in request.GET else 0
        articles = Article.objects.filter() \
                                  .order_by('-article_id')[last_row:last_row + PAGE_SIZE]
        article_serializer = ArticleSerializer(articles, many=True)
        articles_json = article_serializer.data
        return Response(articles_json)

class ArticleView(APIView):
    """ API View Class is responsible for managing article entity """

    def get(self, request, article_id=None):
        """ Method searches article by a given id in request, and returns it as JSON """
        LOGGER.info("Executing ArticleView.get()")
        article = Article.objects.get(pk=article_id)
        article.increase_total_views()
        article.save()
        article_serializer = ArticleSerializer(article, many=False)
        articles_json = article_serializer.data
        return Response(articles_json)

    def post(self, request):
        """ Method gets all article data, validates, and saves it in database """
        LOGGER.info("Executing ArticleView.post()")
        self._clean_main_text(request)
        article_serializer = ArticleSerializer(data=request.data)
        if article_serializer.is_valid():
            article_serializer.save()
            return Response(article_serializer.data, status=status.HTTP_201_CREATED)
        return Response(article_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """ Method gets all article data, validates, and saves it in database """
        LOGGER.info("Executing ArticleView.put()")
        self._clean_main_text(request)
        article = Article.objects.get(pk=request.data["article_id"])
        article_serializer = ArticleSerializer(article, data=request.data, partial=True)
        if article_serializer.is_valid():
            article_serializer.save()
            return Response(article_serializer.data, status=status.HTTP_200_OK)
        return Response(article_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _clean_main_text(self, request):
        """ Method cleans all not supported and evil tags/attributes/styles from WYSIWYG editor """
        request.data["main_text"] = bleach.clean(request.data["main_text"],
                                                 tags=ALLOWED_HTML_TAGS,
                                                 attributes=ALLOWED_HTML_TAG_ATTRIBUTES,
                                                 styles=ALLOWED_HTML_TAG_STYLES)

class ArticleRepresentationView(APIView):
    """ API View Class is responsible for managing article representations """

    def put(self, request):
        """ Method updates Article with article representations and saves it in database """
        LOGGER.info("Executing ArticleRepresentationView.put()")
        data = json.loads(request.data["json_data"])

        #Setting a list of images to the json, to pass images though validations
        files = request.FILES.getlist('image[]')
        for i in range(len(files)):
            filename, file_extension = os.path.splitext(files[i].name)
            #Changing filename relating it to article id
            files[i].name = filename + "_" + str(data["article_id"]) + file_extension
            data["article_representations"][i]["representation"]["image_file"] = files[i]

        article = Article.objects.get(pk=data["article_id"])
        article_serializer = ArticleSerializer(article, data=data, partial=True)
        if article_serializer.is_valid():
            article_serializer.save()
            return Response(article_serializer.data, status=status.HTTP_200_OK)
        return Response(article_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """ Method deletes ArticleRepresentation with corresponding Representation and its child"""
        LOGGER.info("Executing ArticleRepresentationView.delete()")
        if "deleted_image_representations" in request.data:
            aws_s3_client = boto3.client('s3')

            for deleted_image_representation in request.data["deleted_image_representations"]:
                image_representation = ImageRepresentation.objects \
                    .get(pk=deleted_image_representation["image_representation_id"])

                aws_s3_client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, 
                                            Key=image_representation.image_file.name)

                image_representation.image_file.delete(save=False)
                image_representation.delete()
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)
