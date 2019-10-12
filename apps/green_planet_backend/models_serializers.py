""" Module for Model Serializers to JSON/XML format """
from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    """ Article entity Serializer """
    creation_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Article
        fields = "__all__"
