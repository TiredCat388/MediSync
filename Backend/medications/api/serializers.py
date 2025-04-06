from rest_framework import serializers
from ..models import Medications

class MedicationsModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medications
        fields = '__all__'
        read_only_fields = ('schedule_id',)