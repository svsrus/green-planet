""" Green Planet backend test cases for services """
import json
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework import status
from apps.green_planet_backend.models import Article
from apps.green_planet_backend.models import ArticleKeyword
from apps.green_planet_backend.models import Representation

SERVER_URL = "http://127.0.0.1:8000/"


class ArticleTest(APITestCase):
    """ Class is responsible for testing Article related backend services """

    def setUp(self):
        """ Method sets up Articles data """
        article = Article.objects.create(title="Статья первая",
                               author_nickname="Сергей",
                               header_text="О глобальных вызовах человечества.",
                               main_text="Главный текст первой статьи.",
                               original_source_url="http://www.greenplanet.com/",
                               creation_date='2019-09-30 16:28:11',
                               state_code=Article.ARTICLE_STATE_VERIFIED_BY_USER_CODE)
        article.save()
        article_keyword1 = ArticleKeyword.objects.create(text="что я могу сделать сам")
        article_keyword1.save()
        article.article_keywords.add(article_keyword1)
        Article.objects.create(title="Статья вторая",
                               author_nickname="Сергей",
                               header_text="О проблемах культуры по отношению к планете Земля.",
                               main_text="Главный текст второй статьи.",
                               original_source_url="http://www.greenplanet.com/",
                               creation_date='2019-09-30 16:28:22',
                               state_code=Article.ARTICLE_STATE_VERIFIED_BY_USER_CODE).save()
        Article.objects.create(title="Статья третья",
                               author_nickname="Сергей",
                               header_text="О возможных способов выхода из экологического кризиса.",
                               main_text="Главный текст третьей статьи.",
                               original_source_url="http://www.greenplanet.com/",
                               creation_date='2019-09-30 16:28:33',
                               state_code=Article.ARTICLE_STATE_VERIFIED_BY_USER_CODE).save()
        Article.objects.create(title="Статья четвертая",
                               author_nickname="Артём",
                               header_text="О работоспособных способов преодоления " +
                               "экологического кризиса.",
                               main_text="Главный текст четвёртой статьи.",
                               original_source_url="http://зелёная-планета.рус/",
                               creation_date='2019-09-30 16:28:44',
                               state_code=Article.ARTICLE_STATE_VERIFIED_BY_USER_CODE).save()

    def test_get_latest_articles(self):
        """ Method tests latest articles service """
        response = self.client.get(SERVER_URL + "api/latestArticles/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 4)

    def test_get_first_article(self):
        """ Method tests a get article method of a first article """
        first_article_id = 1
        first_article_title = "Статья первая"
        response = self.client.get(SERVER_URL + "api/articles/" + str(first_article_id))
        response_json = json.loads(response.content)
        self.assertEqual(response_json["article_id"], first_article_id)
        self.assertEqual(response_json["title"], first_article_title)

    def test_post_full_article(self):
        """ Method tests post a full article and gets saved response with ids of each object """

        request_json = {
            "title": "Статья пятая.",
            "author_nickname": "Сергей",
            "header_text": "В ней я Вам расскажу о...",
            "main_text": "Планета нуждается в нашей общей помощи...",
            "original_source_url": "http://зелёная-планета.рус/",
            "state_code": Article.ARTICLE_STATE_VERIFIED_BY_USER_CODE,
            "article_keywords": [
                {
                    "article_keyword_id" : 1,
                    "text" : "Что я могу сделать сам"
                },
                {
                    "article_keyword_id" : 0,
                    "text" : "природа и искусство"
                },
                {
                    "article_keyword_id" : 0,
                    "text" : "пути выхода"
                }
            ],
            "article_representations": [
                {
                    "representation": {
                        "representation_type_code": 1
                    }
                },
                {
                    "representation": {
                        "representation_type_code": 2,
                        "video_url": "https://www.youtube.com/watch?v=j800SVeiS5I"
                    }
                }
            ]
        }

        response = self.client.post(SERVER_URL + "api/articles/", request_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = json.loads(response.content)

        for article_representation in data["article_representations"]:
            representation = article_representation["representation"]
            self.assertIsNotNone(representation["representation_type_code"])
            if representation["representation_type_code"] == Representation.TYPE_VIDEO_CODE:
                self.assertIsNotNone(representation["video_url"])

    def test_put_article_representations(self):
        """ Method adds representations to an existing article """
        request_json = {
            "article_id": 1,
            "article_keywords": [
                {
                    "text" : "    что я могу сделать сам    "
                },
                {
                    "text" : "что мы можем сделать вместе"
                },
            ],
            "article_representations": [
                {
                    "representation": {
                        "representation_type_code": 1
                    }
                },
                {
                    "representation": {
                        "representation_type_code": 1
                    }
                }
            ]
        }
        
        image_file1 = open("D://SVS//Programming//Python//green-planet-workspace//" +
                           "green_planet//apps//green_planet_frontend//static//" +
                           "images//1.jpg", "rb")
        image_file2 = open("D://SVS//Programming//Python//green-planet-workspace//" +
                           "green_planet//apps//green_planet_frontend//static//" +
                           "images//2.jpg", "rb")
        image_files = [image_file1, image_file2]

        response = self.client.put(SERVER_URL + "api/articleRepresentations/",
                                   data={"json_data":json.dumps(request_json), "image[]":image_files},
                                   format="multipart")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["article_keywords"]), 2)
        self.assertIsNotNone(response.data["article_representations"])
        self.assertEqual(len(response.data["article_representations"]), 2)
        self.assertIsNotNone(response.data["article_representations"][0]["representation"])
        self.assertIsNotNone(response.data["article_representations"][0]["representation"]
                             ["image_file"])
        self.assertIsNotNone(response.data["article_representations"][1]["representation"])
        self.assertIsNotNone(response.data["article_representations"][1]["representation"]
                             ["image_file"])

    def test_delete_article_representation(self):
        """ Method tests deleting image representations from article """
        self.test_put_article_representations()

        request_delete_json = {
            "deleted_image_representations" : [
                {
                    "image_representation_id" : "1"
                }
            ]
        }
        response_delete = self.client.delete(SERVER_URL + "api/articleRepresentations/",
                                             data=request_delete_json,
                                             format='json')
        self.assertEqual(response_delete.status_code, status.HTTP_204_NO_CONTENT)
