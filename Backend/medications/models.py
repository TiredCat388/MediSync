from django.db import models
from patients.models import Patients
from datetime import date, time

Medications_Choices = (
    ('Oral', 'Oral'),
    ('Intramuscular', 'Intramuscular'),
    ('Intravenous', 'Intravenous'),
    ('Subcutaneous', 'Subcutaneous'),
    ('Topical', 'Topical'),
    ('Inhalation', 'Inhalation'),
    ('Sublingual', 'Sublingual'),
    ('Transdermal', 'Transdermal'),
    ('Rectal', 'Rectal'),
    ('Intranasal', 'Intranasal'),
    ('Ocular', 'Ocular'),
    ('Vaginal', 'Vaginal'),
    ('Other', 'Other')
)

class Medications(models.Model):
    Medication_name = models.CharField(max_length=100, blank=False)
    Medication_form = models.CharField(max_length=100, blank=False)
    Medication_Time = models.TimeField(blank=False)
    Medication_strength = models.CharField(max_length=100, blank=False)
    Medication_notes = models.TextField(blank=False)
    patient_number = models.ForeignKey(Patients, on_delete=models.CASCADE, db_column='patient_number')

    Medication_unit = models.CharField(
        max_length=100, 
        blank=False, 
        default='mg',
        help_text='Default unit of measurement for medication strength'
    )
    Frequency = models.TimeField(
        blank=False,
        default=time(8, 0),  # Default to 8:00 AM
        help_text='Time of day when medication should be taken'
    )
    Medication_start_date = models.DateField(
        default=date.today,
        blank=False,
        help_text='Date when medication regimen begins'
    )
    Medication_end_date = models.DateField(
        default=date.today,
        blank=False,
        help_text='Date when medication regimen ends'
    )
    Medication_route = models.CharField(
        max_length=100,
        choices=Medications_Choices,
        blank=False,
        default='Oral',
        help_text='Method of medication administration'
    )
    schedule_id = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'Medications'
        unique_together = ('patient_number', 'schedule_id')

    def save(self, *args, **kwargs):
        if not self.schedule_id:
            # Get the maximum schedule_id for the given patient_number
            last_schedule = Medications.objects.filter(patient_number=self.patient_number).order_by('-schedule_id').first()
            self.schedule_id = (last_schedule.schedule_id + 1) if last_schedule else 1
        super().save(*args, **kwargs)
    
    