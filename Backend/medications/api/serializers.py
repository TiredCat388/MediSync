from rest_framework import serializers
from datetime import timedelta, datetime, time
from django.utils import timezone
from ..models import Medications

class MedicationsModelSerializer(serializers.ModelSerializer):
    day = serializers.IntegerField(write_only=True, required=False, default=0)
    hour = serializers.IntegerField(write_only=True, required=False, default=8)
    minutes = serializers.IntegerField(write_only=True, required=False, default=0)

    frequency_days = serializers.SerializerMethodField()
    frequency_hours = serializers.SerializerMethodField()
    frequency_minutes = serializers.SerializerMethodField()
    next_dose_time = serializers.SerializerMethodField()

    class Meta:
        model = Medications
        fields = '__all__'
        read_only_fields = ('schedule_id',)

    def create(self, validated_data):
        validated_data['Frequency'] = timedelta(
            days=validated_data.pop('day', 0),
            hours=validated_data.pop('hour', 8),
            minutes=validated_data.pop('minutes', 0)
        )
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if all(k in validated_data for k in ('day', 'hour', 'minutes')):
            instance.Frequency = timedelta(
                days=validated_data.pop('day'),
                hours=validated_data.pop('hour'),
                minutes=validated_data.pop('minutes')
            )
        return super().update(instance, validated_data)

    def get_frequency_days(self, obj):
        return obj.Frequency.days if obj.Frequency else 0

    def get_frequency_hours(self, obj):
        return (obj.Frequency.seconds // 3600) if obj.Frequency else 0

    def get_frequency_minutes(self, obj):
        return ((obj.Frequency.seconds % 3600) // 60) if obj.Frequency else 0

    def get_next_dose_time(self, obj):
        if not obj.Frequency or not obj.Medication_start_date:
            return None
        start = timezone.make_aware(datetime.combine(obj.Medication_start_date, time.min))
        now = timezone.now()
        if now < start:
            return start
        intervals = int((now - start) // obj.Frequency) + 1
        return start + obj.Frequency * intervals