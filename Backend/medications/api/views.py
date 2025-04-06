from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Medications
from .serializers import MedicationsModelSerializer

class MedicationsViewSet(viewsets.ModelViewSet):
    queryset = Medications.objects.all()
    serializer_class = MedicationsModelSerializer

    def list(self, request, *args, **kwargs):
        patient_number = request.query_params.get('patient_number', None)
        if patient_number:
            medications = Medications.objects.filter(patient_number=patient_number)
        else:
            medications = Medications.objects.none()

        serializer = self.get_serializer(medications, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Handle updating a medication."""
        try:
            medication = self.get_object()
            serializer = self.get_serializer(medication, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)