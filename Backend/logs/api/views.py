from rest_framework import viewsets
from ..models import Logs
from .serializers import LogsModelSerializer

class LogsViewSet(viewsets.ModelViewSet):
    queryset = Logs.objects.all()
    serializer_class = LogsModelSerializer
