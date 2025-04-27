from rest_framework import viewsets
from ..models import UserSettings
from .serializers import UserSettingsSerializer
from rest_framework.permissions import IsAuthenticated


class UserSettingsViewSet(viewsets.ModelViewSet):
    queryset = UserSettings.objects.all()
    serializer_class = UserSettingsSerializer
    
