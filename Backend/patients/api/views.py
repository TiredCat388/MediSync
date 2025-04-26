from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Patients
from .serializers import PatientsModelSerializer
from django.utils import timezone

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
    
    @action(detail=True, methods=['patch'], url_path='archive')  
    def archive(self, request, pk=None):
        try:
            patient = self.get_object()
            patient.is_archived = True  
            patient.date_archived = timezone.now()  
            patient.save()
            return Response({'status': 'archived'}, status=status.HTTP_200_OK)
        except Patients.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

