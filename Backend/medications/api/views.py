from rest_framework import viewsets
from rest_framework.response import Response
from ..models import Medications
from .serializers import MedicationsModelSerializer

class MedicationsViewSet(viewsets.ModelViewSet):
    queryset = Medications.objects.all()
    serializer_class = MedicationsModelSerializer

    def list(self, request, *args, **kwargs):
        # Get the patient_number from query parameters
        patient_number = request.query_params.get('patient_number', None)
        if patient_number:
            # Filter medications by patient_number
            medications = Medications.objects.filter(patient_number=patient_number)
        else:
            # If no patient_number is provided, return an empty queryset
            medications = Medications.objects.none()

        # Serialize the filtered queryset
        serializer = self.get_serializer(medications, many=True)
        return Response(serializer.data)