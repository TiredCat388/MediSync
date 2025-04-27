from rest_framework import serializers
from ..models import UserSettings

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['volume', 'alert_sound']
