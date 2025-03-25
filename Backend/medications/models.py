from django.db import models
from patients.models import Patients
# from physicians.models import Physicians

class Medications(models.Model):
    Medication_name = models.CharField(max_length=100, blank=False)
    Dosage = models.CharField(max_length=100, blank=False)
    Dosage_Unit = models.CharField(max_length=100, blank=False)
    Medication_Time = models.TimeField(blank=False)
    Frequency = models.TimeField(blank=False)
    Medication_notes = models.TextField(blank=False)
    # Physician_id = models.ForeignKey('Physicians', on_delete=models.CASCADE, db_column='Physician_id')
    patient_number = models.OneToOneField(Patients, on_delete=models.CASCADE, db_column='patient_number', primary_key=True)

    class Meta:
        db_table = 'Medications'
