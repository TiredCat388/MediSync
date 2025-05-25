from rest_framework import serializers
from ..models import Patients, Emergencycontactdetails

class EmergencycontactdetailsModelSerializer(serializers.ModelSerializer):
    patient_number = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Emergencycontactdetails
        fields = '__all__'

class PatientsModelSerializer(serializers.ModelSerializer):
    emergency_contact = EmergencycontactdetailsModelSerializer(source='emergencycontactdetails')
    BMI = serializers.SerializerMethodField()

    class Meta:
        model = Patients
        fields = '__all__'

    def create(self, validated_data):
        try:
            print(f"Validated data: {validated_data}")
            emergency_contact_data = validated_data.pop('emergencycontactdetails')
            patient = Patients.objects.create(**validated_data)
            Emergencycontactdetails.objects.create(patient_number=patient, **emergency_contact_data)
            return patient
        except Exception as e:
            print(f"Error creating patient: {e}")
            raise e

    def to_internal_value(self, data):
        try:
            return super().to_internal_value(data)
        except serializers.ValidationError as e:
            print(f"Validation error: {e.detail}")
            raise e
        
    def update(self, instance, validated_data):
        emergency_contact_data = validated_data.pop('emergencycontactdetails', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if emergency_contact_data:
            emergency_contact = instance.emergencycontactdetails
            for attr, value in emergency_contact_data.items():
                setattr(emergency_contact, attr, value)
            emergency_contact.save()

        return instance
    
    def get_BMI(self, obj):
        if obj.height and obj.weight:
            try:
                return round(obj.weight / (obj.height ** 2), 2)
            except ZeroDivisionError:
                return None
        return None

