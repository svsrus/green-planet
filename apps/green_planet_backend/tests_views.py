""" Green Planet backend test cases for services """
import json
from rest_framework import status
from rest_framework.test import APITestCase
from apps.green_planet_backend.models import Article

SERVER_URL = "http://127.0.0.1:8000/"

class ArticleTest(APITestCase):
    """ Class is responsible for testing Article related backend services """

    def setUp(self):
        """ Method sets up Articles data """
        Article.objects.create(title="Статья первая",
                               header_text="О глобальных вызовах человечества.",
                               main_text="Главный текст первой статьи.",
                               creation_date='2019-09-30 16:28:11')
        Article.objects.create(title="Статья вторая",
                               header_text="О проблемах культуры по отношению к планете Земля.",
                               main_text="Главный текст второй статьи.",
                               creation_date='2019-09-30 16:28:22')
        Article.objects.create(title="Статья третья",
                               header_text="О возможных способов выхода из экологического кризиса.",
                               main_text="Главный текст третьей статьи.",
                               creation_date='2019-09-30 16:28:33')
        Article.objects.create(title="Статья четвертая",
                               header_text="О работоспособных способов преодоления " +
                               "экологического кризиса.",
                               main_text="Главный текст четвёртой статьи.",
                               creation_date='2019-09-30 16:28:44')

    def test_latest_articles(self):
        """ Method tests latest articles service """
        response = self.client.get(SERVER_URL + "api/latestArticles/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 3)

    def test_first_article(self):
        """ Method tests a get article method of a first article """
        first_article_id = 1
        first_article_title = "Статья первая"
        response = self.client.get(SERVER_URL + "api/articles/" + str(first_article_id))
        response_json = json.loads(response.content)
        self.assertEqual(response_json["article_id"], first_article_id)
        self.assertEqual(response_json["title"], first_article_title)
