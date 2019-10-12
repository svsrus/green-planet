""" Green Planet article related  """
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
from django.db.models import PROTECT
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.fields import GenericForeignKey

class Representation(Model):
    """ Representation entity which can be image, video, etc. """
    REPRESENTATION_TYPE_IMAGE_CODE = 1
    REPRESENTATION_TYPE_VIDEO_CODE = 2
    REPRESENTATION_TYPES = [
        (REPRESENTATION_TYPE_IMAGE_CODE, 'Image'),
        (REPRESENTATION_TYPE_VIDEO_CODE, 'Video')
    ]
    representation_id = AutoField(primary_key=True)
    representation_type_code = IntegerField(null=True, blank=False,
                                            choices=REPRESENTATION_TYPES)
    articles = GenericRelation('ArticleRepresentation') #Bi-directional mapping

    class Meta:
        db_table = 'green_planet_representation'

    def is_image(self):
        """ Method returns True, if this instance is an image type """
        return self.REPRESENTATION_TYPE_IMAGE_CODE == self.representation_type_code

    def is_video(self):
        """ Method returns True, if this instance is an video type """
        return self.REPRESENTATION_TYPE_VIDEO_CODE == self.representation_type_code

class ImageRepresentation(Representation):
    """ Image Representation entity which saves path to image """
    image_file = ImageField(null=True)

    class Meta:
        db_table = "green_planet_image_representation"

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
                         on_delete=PROTECT,
                         related_name='article_representations')
    representation_content_type = ForeignKey(ContentType, null=True, on_delete=PROTECT)
    representation_id = PositiveIntegerField(null=True)
    representation = GenericForeignKey('representation_content_type', 'representation_id')

    class Meta:
        db_table = "green_planet_article_representation"

class Article(Model):
    """ Article entity """
    article_id = AutoField(primary_key=True)
    title = CharField(max_length=255)
    header_text = CharField(max_length=255)
    creation_date = DateTimeField(auto_now_add=True)
    main_text = TextField(max_length=255)

    class Meta:
        db_table = "green_planet_article"

    def add_article_representations(self, article_representation_list) -> 'ArticleRepresentation':
        """ Method creates ArticleRepresentation entities and adds it to the representation list """
        for article_representation in article_representation_list:
            article_repr_content_type = ContentType.objects.get_for_model(article_representation)
            ArticleRepresentation.objects.create(
                article=self,
                representation_content_type=article_repr_content_type,
                representation_id=article_representation.pk,
            )
