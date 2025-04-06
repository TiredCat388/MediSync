from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Medications
from .serializers import MedicationsModelSerializer

class MedicationsViewSet(viewsets.ModelViewSet):
    queryset = Medications.objects.all()
    serializer_class = MedicationsModelSerializer
    lookup_field = "schedule_id"
    lookup_url_kwarg = "schedule_id"

    def get_queryset(self):
        patient_number = self.request.query_params.get('patient_number')
        if patient_number:
            return Medications.objects.filter(patient_number=patient_number)
        return super().get_queryset()

    def retrieve(self, request, *args, **kwargs):
        try:
            patient_number = self.kwargs.get("patient_number")
            schedule_id = self.kwargs.get("schedule_id")
            medication = Medications.objects.get(
                patient_number=patient_number, schedule_id=schedule_id
            )
            serializer = self.get_serializer(medication)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Medications.DoesNotExist:
            return Response(
                {"error": "Medication not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def update(self, request, *args, **kwargs):
        try:
            patient_number = self.kwargs.get("patient_number")
            schedule_id = self.kwargs.get("schedule_id")
            medication = Medications.objects.get(
                patient_number=patient_number, schedule_id=schedule_id
            )
            serializer = self.get_serializer(medication, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Medications.DoesNotExist:
            return Response(
                {"error": "Medication not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)