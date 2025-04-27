from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Medications
from .serializers import MedicationsModelSerializer
from logs.utils import log_action

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

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:  # HTTP 201 Created
            medication_name = request.data.get("Medication_name", "Unknown")
            patient_number = request.data.get("patient_number", "Unknown")
            log_action(
                f"Added medication '{medication_name}' for patient {patient_number}.",
                log_type="CREATION"
            )

        return response

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
            log_action(
                f"Updated medication with schedule ID {schedule_id} for patient {patient_number}.",
                log_type="ACTION"
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Medications.DoesNotExist:
            log_action(
                f"Failed to update medication with schedule ID {schedule_id} for patient {patient_number}.",
                log_type="ERROR"
            )
            return Response(
                {"error": "Medication not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            log_action(
                f"Error updating medication with schedule ID {schedule_id} for patient {patient_number}.",
                log_type="ERROR"
            )
            return Response({"error": "An error occurred while updating the medication."}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        patient_number = kwargs.get("patient_number")
        schedule_id = kwargs.get("schedule_id")

        # Use filter() to retrieve all matching records
        medications = Medications.objects.filter(
            patient_number=patient_number, schedule_id=schedule_id
        )

        if not medications.exists():
            return Response(
                {"error": "No matching medication found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Delete all matching records
        count, _ = medications.delete()

        # Log the deletion
        log_action(
            f"Archived medication with schedule ID {schedule_id} for patient {patient_number}.",
            log_type="Archive",
        )