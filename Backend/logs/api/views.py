from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from ..models import Logs
from .serializers import LogsModelSerializer

class LogsViewSet(viewsets.ModelViewSet):
    queryset = Logs.objects.all()
    serializer_class = LogsModelSerializer

@api_view(['GET'])
def server_time(request):
    return Response({"server_time": timezone.now().isoformat()})
