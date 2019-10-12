""" Green Planet backend test cases for entities """
from django.test import TestCase
from apps.green_planet_backend.models import Article
from apps.green_planet_backend.models import Representation
from apps.green_planet_backend.models import ImageRepresentation
from apps.green_planet_backend.models import VideoRepresentation


class ArticleTest(TestCase):
    """ Class is responsible for testing Article related entities """

    def test_create_article(self):
        """ Method tests creation of article entity """

        article = Article.objects.create(title="Статья первая",
                               header_text="О глобальных вызовах человечества.",
                               main_text="Главный текст первой статьи.",
                               creation_date='2019-09-30 16:28:11')
        article.save()

        count = len(Article.objects.all())
        self.assertEqual(count, 1)

    def test_create_article_representations(self):
        """ Method tests creation of article entity with different types of representations """

        article = Article.objects.create(title="Статья первая",
                                         header_text="О глобальных вызовах человечества.",
                                         main_text="Главный текст первой статьи.",
                                         creation_date='2019-09-30 16:28:11')

        image1 = ImageRepresentation.objects.create(
            representation_type_code=Representation.REPRESENTATION_TYPE_IMAGE_CODE,
            image_file="D://SVS//Programming//Python//green-planet-workspace//green_planet//" +
            "apps//green_planet_frontend//static//images//1.jpg"
        )
        image2 = ImageRepresentation.objects.create(
            representation_type_code=Representation.REPRESENTATION_TYPE_IMAGE_CODE,
            image_file="D://SVS//Programming//Python//green-planet-workspace//green_planet//" +
            "apps//green_planet_frontend//static//images//2.jpg"
        )
        video1 = VideoRepresentation.objects.create(
            representation_type_code=Representation.REPRESENTATION_TYPE_VIDEO_CODE,
            video_url="https://www.youtube.com/watch?v=j800SVeiS5I"
        )

        article_representations_list = [image1, video1, image2]
        article.add_article_representations(article_representations_list)
        article.save()

        article_db = Article.objects.get(pk=1)
        article_representations_db = article_db.article_representations.all()
        
        self.assertEqual(len(article_representations_db), len(article_representations_list))
        
        for article_representation in article_representations_db:
            representation = article_representation.representation
            self.assertIsNotNone(representation.representation_type_code)
            if (representation.is_image()):
                self.assertIsNotNone(representation.image_file)
            elif (representation.is_video()):
                self.assertIsNotNone(representation.video_url)
