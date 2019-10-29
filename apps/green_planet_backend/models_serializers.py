""" Module for Model Serializers to JSON/XML format """
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import RelatedField
from rest_framework.serializers import DateTimeField
from rest_framework.serializers import ValidationError
from .models import Article
from .models import ArticleRepresentation
from .models import Representation
from .models import ImageRepresentation
from .models import VideoRepresentation

class ImageRepresentationSerializer(ModelSerializer):
    """ Image Representation entity Serializer """
    class Meta:
        model = ImageRepresentation
        fields = "__all__"

class VideoRepresentationSerializer(ModelSerializer):
    """ Video Representation entity Serializer """
    class Meta:
        model = VideoRepresentation
        fields = "__all__"

class RepresentationSerializer(RelatedField):
    """ Serializer converts json/object to object/json polymorphic Representation model """
    class Meta:
        """ Meta class describes RepresentationSerializer """
        model = Representation
        fields = "__all__"

    def to_internal_value(self, data):
        """ Method serializes Json to an instance of a corresponding Representation object """
        representation_type_code = data["representation_type_code"]

        if representation_type_code == Representation.TYPE_IMAGE_CODE:
            serializer = ImageRepresentationSerializer(data=data)
        elif representation_type_code == Representation.TYPE_VIDEO_CODE:
            serializer = VideoRepresentationSerializer(data=data)
        else:
            raise ValidationError("No 'representation_type_code' attribute:value provided")

        if serializer.is_valid():
            object_instance = serializer.save()
        else:
            raise ValidationError(serializer.errors)

        return object_instance

    def to_representation(self, value):
        """ Serializes Representation object to specific Json """
        if value.representation_type_code == Representation.TYPE_IMAGE_CODE:
            serializer = ImageRepresentationSerializer(value)
        elif value.representation_type_code == Representation.TYPE_VIDEO_CODE:
            serializer = VideoRepresentationSerializer(value)
        else:
            raise Exception('Unexpected type of models.Representation object')

        return serializer.data

class ArticleRepresentationSerializer(ModelSerializer):
    """ Article Representation relation Serializer """
    representation = RepresentationSerializer(queryset=ArticleRepresentation.objects.all())

    class Meta:
        """ Article Representation specific field mappings """
        model = ArticleRepresentation
        fields = ["article_representation_id", "representation"]

class ArticleSerializer(ModelSerializer):
    """ Article entity Serializer """
    creation_date = DateTimeField(required=False, format="%Y-%m-%d %H:%M:%S")
    article_representations = ArticleRepresentationSerializer(required=False, many=True)

    class Meta:
        model = Article
        fields = ["article_id", "title", "header_text", "creation_date", "main_text",
                  "article_representations"]

    def create(self, validated_data):
        """ Method creates articles and related objects from json request """
        article_representations = validated_data.pop("article_representations")
        representations = [article_representation["representation"]
                           for article_representation in article_representations]
        article = Article.objects.create(**validated_data)
        article.add_article_representations(representations)
        article.save()

        return article

    def update(self, instance, validated_data):
        """ Method updates articles and related objects from json/multipart request """
        article_representations = validated_data.pop("article_representations")
        representations = [article_representation["representation"]
                           for article_representation in article_representations]
        instance.add_article_representations(representations)
        instance.title = validated_data.get('title', instance.title)
        instance.header_text = validated_data.get('header_text', instance.header_text)
        instance.main_text = validated_data.get('main_text', instance.main_text)
        instance.save()
        return instance
