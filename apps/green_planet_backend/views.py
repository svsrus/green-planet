""" GREEN PLANET BACKEND - views module """
from rest_framework.views import APIView
from rest_framework.response import Response

class TestView(APIView):
    def get(self, request):
        json = [{"first_name":"Sergei"}, {"first_name":"Olga"}, {"first_name":"Katia"}, {"first_name":"Nastia"}]
        return Response(json)
