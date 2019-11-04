""" Green Planet backend test cases for services """
import json
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework import status
from apps.green_planet_backend.models import Article
from apps.green_planet_backend.models import Representation

SERVER_URL = "http://127.0.0.1:8000/"


class ArticleTest(APITestCase):
    """ Class is responsible for testing Article related backend services """

    def setUp(self):
        """ Method sets up Articles data """
        Article.objects.create(title="Статья первая",
                               header_text="О глобальных вызовах человечества.",
                               main_text="Главный текст первой статьи.",
                               creation_date='2019-09-30 16:28:11').save()
        Article.objects.create(title="Статья вторая",
                               header_text="О проблемах культуры по отношению к планете Земля.",
                               main_text="Главный текст второй статьи.",
                               creation_date='2019-09-30 16:28:22').save()
        Article.objects.create(title="Статья третья",
                               header_text="О возможных способов выхода из экологического кризиса.",
                               main_text="Главный текст третьей статьи.",
                               creation_date='2019-09-30 16:28:33').save()
        Article.objects.create(title="Статья четвертая",
                               header_text="О работоспособных способов преодоления " +
                               "экологического кризиса.",
                               main_text="Главный текст четвёртой статьи.",
                               creation_date='2019-09-30 16:28:44').save()

    def test_get_latest_articles(self):
        """ Method tests latest articles service """
        response = self.client.get(SERVER_URL + "api/latestArticles/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 3)

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
            "header_text": "В ней я Вам расскажу о...",
            "main_text": "Планета нуждается в нашей общей помощи...",
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
        self.assertIsNotNone(response.data["article_representations"])
        self.assertIsNotNone(len(response.data["article_representations"]), 2)
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
