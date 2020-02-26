""" Module for Model Serializers to JSON/XML format """
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import ModelField
from rest_framework.serializers import RelatedField
from rest_framework.serializers import DateTimeField
from rest_framework.serializers import ValidationError
from .models import Article
from .models import ArticleKeyword
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

class ArticleKeywordSerializer(ModelSerializer):
    """ Article Tag relation Serializer """
    article_keyword_id = ModelField(model_field=ArticleKeyword()._meta.get_field('article_keyword_id'))

    class Meta:
        """ Article Tag specific field mappings """
        model = ArticleKeyword
        fields = ["article_keyword_id", "text"]

class ArticleSerializer(ModelSerializer):
    """ Article entity Serializer """
    creation_date = DateTimeField(required=False, format="%Y-%m-%d %H:%M:%S")
    article_representations = ArticleRepresentationSerializer(required=False, many=True)
    article_keywords = ArticleKeywordSerializer(required=False, many=True)

    class Meta:
        model = Article
        fields = ["article_id", "language_code", "author_nickname", "title", "header_text",
                  "creation_date", "main_text", "original_source_url", "state_code", "total_views",
                  "article_keywords", "article_representations"]

    def create(self, validated_data):
        """ Method creates articles and related objects from json request """
        article_keywords = validated_data.pop("article_keywords") \
                         if "article_keywords" in validated_data else []

        article_representations = validated_data.pop("article_representations")
        representations = [article_representation["representation"]
                           for article_representation in article_representations]

        article = Article.objects.create(**validated_data)
        article.add_article_representations(representations)
        article.save()

        for article_keyword in article_keywords:
            article.article_keywords.add(self._get_article_keyword_entity(article_keyword))

        return article

    def update(self, instance, validated_data):
        """ Method updates articles and related objects from json/multipart request """
        article_keywords = validated_data.pop("article_keywords") \
                         if "article_keywords" in validated_data else []
        article_representations = validated_data.pop("article_representations")
        representations = [article_representation["representation"]
                           for article_representation in article_representations]
        instance.add_article_representations(representations)
        instance.language_code = validated_data.get('language_code', instance.language_code)
        instance.author_nickname = validated_data.get('author_nickname', instance.author_nickname)
        instance.title = validated_data.get('title', instance.title)
        instance.header_text = validated_data.get('header_text', instance.header_text)
        instance.main_text = validated_data.get('main_text', instance.main_text)
        instance.state_code = validated_data.get('state_code', instance.state_code)
        instance.original_source_url = validated_data.get('original_source_url',
                                                          instance.original_source_url)
        article_keywords_saved = instance.article_keywords.all()
        for article_keyword in article_keywords:
            article_keyword_entity = self._get_article_keyword_entity(article_keyword)
            if not self._is_article_keyword_text_equals_keyword_text(article_keyword_entity, 
                                                                     article_keywords_saved):
                instance.article_keywords.add(article_keyword_entity)

        instance.save()
        return instance

    def _is_article_keyword_text_equals_keyword_text(self, article_keyword, article_keywords_saved):
        """ Method searches equals tag text, if matched True is returned, otherwise False """
        if article_keywords_saved:
            for tag_saved in article_keywords_saved:
                if tag_saved.text.strip() == article_keyword.text.strip():
                    return True
        return False

    def _get_article_keyword_entity(self, article_keyword):
        """ Method searches existing ArticleKeyword by ID or Text, otherwise new is returned """
        article_keyword_entity = None

        if "article_keyword_id" in article_keyword and article_keyword["article_keyword_id"] != 0:
            article_keyword_entity = ArticleKeyword.objects.get(
                pk=article_keyword["article_keyword_id"])

        article_keyword_entities = ArticleKeyword.objects.filter(text=article_keyword["text"])
        article_keyword_entities_len = len(article_keyword_entities)

        if article_keyword_entities_len > 0:
            article_keyword_entity = article_keyword_entities[0]
        else:
            article_keyword_entity = ArticleKeyword.objects.create(text=article_keyword["text"])
            article_keyword_entity.save()

        return article_keyword_entity
