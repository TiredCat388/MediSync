from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Medications
from .serializers import MedicationsModelSerializer

class MedicationsViewSet(viewsets.ModelViewSet):
    queryset = Medications.objects.all()
    serializer_class = MedicationsModelSerializer

    def get_queryset(self):
        # Filter medications by patient_number if provided in the query parameters
        patient_number = self.request.query_params.get('patient_number')
        if patient_number:
            return Medications.objects.filter(patient_number=patient_number)
        return super().get_queryset()
