""" Green Planet article related  """
import os
from django.db.models import Model
from django.db.models import AutoField
from django.db.models import CharField
from django.db.models import DateTimeField
from django.db.models import TextField
from django.db.models import IntegerField
from django.db.models import ImageField
from django.db.models import URLField
from django.db.models import ForeignKey
from django.db.models import PositiveIntegerField
from django.db.models import ManyToManyField
from django.db.models import CASCADE
from django.db.models import signals
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.fields import GenericForeignKey

class Representation(Model):
    """ Representation entity which can be image, video, etc. """
    TYPE_IMAGE_CODE = 1
    TYPE_VIDEO_CODE = 2
    TYPES = [
        (TYPE_IMAGE_CODE, 'Image'),
        (TYPE_VIDEO_CODE, 'Video')
    ]
    representation_id = AutoField(primary_key=True)
    representation_type_code = IntegerField(null=True, blank=False,
                                            choices=TYPES)
    article_representation = GenericRelation('ArticleRepresentation',
                               object_id_field='representation_id',
                               content_type_field='representation_content_type') #Bi-directional mapping

    class Meta:
        db_table = 'green_planet_representation'

    def is_image(self):
        """ Method returns True, if this instance is an image type """
        return self.TYPE_IMAGE_CODE == self.representation_type_code

    def is_video(self):
        """ Method returns True, if this instance is an video type """
        return self.TYPE_VIDEO_CODE == self.representation_type_code

class ImageRepresentation(Representation):
    """ Image Representation entity which saves path to image """
    image_file = ImageField(null=True)

    class Meta:
        db_table = "green_planet_image_representation"

@receiver(signals.post_delete, sender=ImageRepresentation)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """ Deletes image from filesystem when corresponding ImageRepresentation object is deleted """
    if instance.image_file:
        if os.path.isfile(instance.image_file.path):
            os.remove(instance.image_file.path)

class VideoRepresentation(Representation):
    """ Video Representation entity which saves URL to video """
    video_url = URLField(null=True, max_length=1024)

    class Meta:
        db_table = "green_planet_video_representation"

class ArticleRepresentation(Model):
    """ Article - Representation many to many join entity """
    article_representation_id = AutoField(primary_key=True)
    article = ForeignKey('Article',
                         null=True,
                         blank=True,
                         on_delete=CASCADE,
                         related_name='article_representations')
    representation_content_type = ForeignKey(ContentType, null=True, on_delete=CASCADE)
    representation_id = PositiveIntegerField(null=True)
    representation = GenericForeignKey('representation_content_type', 'representation_id')

    class Meta:
        db_table = "green_planet_article_representation"

class ArticleKeyword(Model):
    """ Article Keyword entity """
    article_keyword_id = AutoField(primary_key=True)
    text = CharField(max_length=255, blank=False, null=False)

    class Meta:
        db_table = "green_planet_article_keyword"

class Article(Model):
    """ Article entity """
    ARTICLE_LANGUAGE_RUSSIAN_CODE = "ru"
    ARTICLE_LANGUAGE_SPANISH_CODE = "es"
    ARTICLE_LANGUAGE_ENGLISH_CODE = "en"
    ARTICLE_LANGUAGES = [
        (ARTICLE_LANGUAGE_RUSSIAN_CODE, 'Русский'),
        (ARTICLE_LANGUAGE_SPANISH_CODE, 'Español'),
        (ARTICLE_LANGUAGE_ENGLISH_CODE, 'English')
    ]
    ARTICLE_STATE_PARTIAL_CODE = 1
    ARTICLE_STATE_VERIFIED_BY_USER_CODE = 2
    ARTICLE_STATES = [
        (ARTICLE_STATE_PARTIAL_CODE, 'Partial'),
        (ARTICLE_STATE_VERIFIED_BY_USER_CODE, 'Verified by user')
    ]
    article_id = AutoField(primary_key=True)
    language_code = CharField(max_length=2, blank=False, null=False, choices=ARTICLE_LANGUAGES)
    author_nickname = CharField(max_length=255)
    title = CharField(max_length=255)
    header_text = CharField(max_length=255)
    creation_date = DateTimeField(auto_now_add=True, blank=True, null=True)
    main_text = TextField(max_length=65535, blank=True, null=True)
    original_source_url = URLField(null=True, blank=True, max_length=65535)
    state_code = IntegerField(null=True, blank=False, choices=ARTICLE_STATES)
    total_views = IntegerField(null=True, blank=True, default=0)
    article_keywords = ManyToManyField(ArticleKeyword, blank=True)

    class Meta:
        db_table = "green_planet_article"

    def increase_total_views(self):
        """ Method increases by 1, the total number of views of this article """
        self.total_views = self.total_views + 1

    def add_article_representations(self, article_representation_list):
        """ Method creates ArticleRepresentation entities and adds it to the representation list """
        for article_representation in article_representation_list:
            article_repr_content_type = ContentType.objects.get_for_model(article_representation)
            ArticleRepresentation.objects.create(
                article=self,
                representation_content_type=article_repr_content_type,
                representation_id=article_representation.pk,
            )
