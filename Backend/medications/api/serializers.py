from rest_framework import serializers
from datetime import timedelta, datetime, time
from django.utils import timezone
from ..models import Medications

FREQUENCY_TYPE_TIMES = {
    'OD': [time(8, 0)],
    'BID': [time(8, 0), time(18, 0)],
    'TID': [time(8, 0), time(13, 0), time(18, 0)],
    'QID': [time(8, 0), time(12, 0), time(16, 0), time(20, 0)],
}

class MedicationsModelSerializer(serializers.ModelSerializer):
    day = serializers.IntegerField(write_only=True, required=False, default=0)
    hour = serializers.IntegerField(write_only=True, required=False, default=8)
    minutes = serializers.IntegerField(write_only=True, required=False, default=0)

    Frequency = serializers.DurationField(required=False, allow_null=True)

    frequency_days = serializers.SerializerMethodField()
    frequency_hours = serializers.SerializerMethodField()
    frequency_minutes = serializers.SerializerMethodField()
    next_dose_time = serializers.SerializerMethodField()

    class Meta:
        model = Medications
        fields = '__all__'
        read_only_fields = ('schedule_id',)

    def create(self, validated_data):
        if validated_data.get('Frequency_type') == 'Other':
            validated_data['Frequency'] = timedelta(
                days=validated_data.pop('day', 0),
                hours=validated_data.pop('hour', 8),
                minutes=validated_data.pop('minutes', 0)
            )
        else:
            validated_data['Frequency'] = None
            validated_data.pop('day', None)
            validated_data.pop('hour', None)
            validated_data.pop('minutes', None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if validated_data.get('Frequency_type') == 'Other':
            if all(k in validated_data for k in ('day', 'hour', 'minutes')):
                instance.Frequency = timedelta(
                    days=validated_data.pop('day'),
                    hours=validated_data.pop('hour'),
                    minutes=validated_data.pop('minutes')
                )
        else:
            validated_data['Frequency'] = None
            validated_data.pop('day', None)
            validated_data.pop('hour', None)
            validated_data.pop('minutes', None)
        return super().update(instance, validated_data)

    def get_frequency_days(self, obj):
        return obj.Frequency.days if obj.Frequency else 0

    def get_frequency_hours(self, obj):
        return (obj.Frequency.seconds // 3600) if obj.Frequency else 0

    def get_frequency_minutes(self, obj):
        return ((obj.Frequency.seconds % 3600) // 60) if obj.Frequency else 0

    def get_next_dose_time(self, obj):
        now = timezone.localtime(timezone.now())

        if not obj.Medication_start_date:
            return None

        freq_type = obj.Frequency_type

        # Handle fixed frequency types with predefined dosing times
        if freq_type in FREQUENCY_TYPE_TIMES:
            dose_times = FREQUENCY_TYPE_TIMES[freq_type]

            # Start from medication start date or today, whichever is later
            start_date = max(obj.Medication_start_date, now.date())

            for day_offset in range(0, 30):  # Look ahead max 30 days
                current_date = start_date + timedelta(days=day_offset)

                # Check end date if set
                if obj.Medication_end_date and current_date > obj.Medication_end_date:
                    return None

                for dose_time in dose_times:
                    dose_datetime = timezone.make_aware(datetime.combine(current_date, dose_time))
                    if dose_datetime > now:
                        return dose_datetime

            return None  # No next dose in the next 30 days

        # For 'Other' frequency, use interval logic based on Frequency timedelta and Medication_Time
        if not obj.Frequency or obj.Frequency.total_seconds() == 0:
            return None

        med_time = obj.Medication_Time or time(0, 0)
        start_datetime = timezone.make_aware(datetime.combine(obj.Medication_start_date, med_time))

        if now < start_datetime:
            return start_datetime

        elapsed = now - start_datetime
        intervals_passed = int(elapsed.total_seconds() // obj.Frequency.total_seconds()) + 1
        next_dose = start_datetime + (obj.Frequency * intervals_passed)

        if obj.Medication_end_date:
            end_datetime = timezone.make_aware(datetime.combine(obj.Medication_end_date, time(23, 59, 59)))
            if next_dose > end_datetime:
                return None

        return next_dose
