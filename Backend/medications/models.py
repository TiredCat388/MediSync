from django.db import models
from patients.models import Patients

class Medications(models.Model):
    Medication_name = models.CharField(max_length=100, blank=False)
    Dosage = models.CharField(max_length=100, blank=False)
    Dosage_Unit = models.CharField(max_length=100, blank=False)
    Medication_Time = models.TimeField(blank=False)
    Frequency = models.TimeField(blank=False)
    Medication_notes = models.TextField(blank=False)
    patient_number = models.ForeignKey(Patients, on_delete=models.CASCADE, db_column='patient_number')
    schedule_id = models.IntegerField(blank=True, null=True)  # Making this field optional

    class Meta:
        db_table = 'Medications'
        unique_together = ('patient_number', 'schedule_id')  # Ensure uniqueness for patient_number and schedule_id

    def save(self, *args, **kwargs):
        if not self.schedule_id:
            # Get the maximum schedule_id for the given patient_number
            last_schedule = Medications.objects.filter(patient_number=self.patient_number).order_by('-schedule_id').first()
            self.schedule_id = (last_schedule.schedule_id + 1) if last_schedule else 1
        super().save(*args, **kwargs)
    
    