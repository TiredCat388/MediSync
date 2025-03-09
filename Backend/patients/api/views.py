from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Patients
from .serializers import PatientsModelSerializer

class PatientsViewSet(viewsets.ModelViewSet):
    queryset = Patients.objects.all()
    serializer_class = PatientsModelSerializer

    @action(detail=False, methods=['get'], url_path='by-number/(?P<patient_number>[^/.]+)')
    def get_by_patient_number(self, request, patient_number=None):
        print(f"Attempting to fetch patient number: {patient_number}")  # Debug log
        try:
            patient = Patients.objects.get(patient_number=patient_number)
            serializer = self.get_serializer(patient)
            return Response(serializer.data)
        except Patients.DoesNotExist:
            print(f"Patient {patient_number} not found")  # Debug log
            return Response(
                {'error': f'Patient {patient_number} not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
