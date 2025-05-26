from django.db import models
from patients.models import Patients
from datetime import date, timedelta, time, datetime
from django.utils import timezone

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

Medication_strength_Choices = (
    ('ml', 'mL'),
    ('mcg', 'mcg'),
    ('mg', 'mg'),
    ('%', '%'),
    ('g', 'g'),
)

Medication_form_Choices = (
    ('Tablet', 'Tablet'),
    ('Syrup', 'Syrup'),
    ('Injection', 'Injection'),
    ('Cream', 'Cream'),
    ('Ointment', 'Ointment'),
    ('Drops', 'Drops'),
    ('Inhaler', 'Inhaler'),
    ('Patch', 'Patch'),
    ('Other', 'Other')
)


class Medications(models.Model):
    physicianID = models.CharField(
        max_length=100, 
        blank=False,
        help_text='ID of the physician prescribing the medication'
    )
    Medication_name = models.CharField(max_length=100, blank=False)
    Medication_form = models.CharField(
        max_length=100, 
        blank=False,
        choices=Medication_form_Choices,
        default='Tablet',)
    Medication_Time = models.TimeField(blank=False)
    Medication_strength = models.IntegerField(blank=False)
    Medication_notes = models.TextField(blank=True)
    patient_number = models.ForeignKey(Patients, on_delete=models.CASCADE, db_column='patient_number')

    Medication_unit = models.CharField(
        max_length=100, 
        blank=False, 
        default='mg',
        choices=Medication_strength_Choices,
        help_text='Default unit of measurement for medication strength'
    )
    Frequency = models.DurationField(
        blank=True,
        null=True,
        help_text='Duration between medication administrations'
    )
    Medication_start_date = models.DateField(
        default=date.today,
        blank=False,
        help_text='Date when medication regimen begins'
    )
    Medication_end_date = models.DateField(
        default=date.today,
        blank=True,
        null=True,
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
    administered = models.BooleanField(
        default=False,
        help_text='Indicates whether the medication has been administered'
    )

    Frequency_type = models.CharField(
        max_length=50,
        choices=[
            ('OD', 'Once Daily'),
            ('BID', 'Twice Daily'),
            ('TID', 'Thrice Daily'),
            ('QID', 'Four times Daily'),
            ('Other', 'Other')
        ],
        default='OD',
        help_text='Frequency type for medication administration'
    )

    class Meta:
        db_table = 'Medications'
        unique_together = ('patient_number', 'schedule_id')

    def save(self, *args, **kwargs):
        if not self.schedule_id:
            # Get the maximum schedule_id for the given patient_number
            last_schedule = Medications.objects.filter(patient_number=self.patient_number).order_by('-schedule_id').first()
            self.schedule_id = (last_schedule.schedule_id + 1) if last_schedule else 1
        super().save(*args, **kwargs)
    
    def get_next_dose_time(self):
        """
        Returns the next datetime when the medication should be administered.
        """
        if not self.Frequency or not self.Medication_start_date:
            return None

        # Use Medication_Time or default to midnight
        med_time = self.Medication_Time or time(0, 0)

        # Combine start date with time and make timezone-aware
        start_datetime = timezone.make_aware(datetime.combine(self.Medication_start_date, med_time))
        now = timezone.now()

        # If current time is before first dose, return it directly
        if now < start_datetime:
            return start_datetime

        elapsed = now - start_datetime
        if self.Frequency.total_seconds() == 0:
            return start_datetime  # Avoid division by zero

        intervals_passed = int(elapsed.total_seconds() // self.Frequency.total_seconds()) + 1
        next_dose = start_datetime + (self.Frequency * intervals_passed)

        if self.Medication_end_date:
            end_datetime = timezone.make_aware(datetime.combine(self.Medication_end_date, time(23, 59)))
            if next_dose > end_datetime:
                return None

        return next_dose
    
    def __str__(self):
        return f"{self.Medication_name} ({self.Medication_form}) - {self.patient_number}"
    
class Administered(models.Model):
    medication = models.ForeignKey(
        Medications,
        related_name='administered_doses',
        on_delete=models.CASCADE
    )
    administered_time = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-administered_time']

    def __str__(self):
        return f"{self.medication.Medication_name} administered at {self.administered_time}"