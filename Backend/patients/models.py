from django.db import models
from django.utils import timezone

Blood_Group_Choices = (
    ('A+', 'A+'),
    ('A-', 'A-'),
    ('B+', 'B+'),
    ('B-', 'B-'),
    ('AB+', 'AB+'),
    ('AB-', 'AB-'),
    ('O+', 'O+'),
    ('O-', 'O-'),
    ('Other', 'Other')
)

class Emergencycontactdetails(models.Model):
    first_name = models.CharField(max_length=100, blank=False)
    last_name = models.CharField(max_length=100, blank=True)
    relation_to_patient = models.CharField(max_length=100, blank=False)
    contact_number = models.BigIntegerField(blank=False)
    patient_number = models.OneToOneField('Patients', on_delete=models.CASCADE, db_column='patient_number', primary_key=True)

    class Meta:
        db_table = 'EmergencyContactDetails'

class Patients(models.Model):
    first_name = models.CharField(
        max_length=100,
        help_text='Patient\'s first name'
    )
    last_name = models.CharField(
        max_length=100,
        help_text='Patient\'s last name'
    )
    patient_number = models.AutoField(primary_key=True)
    age = models.IntegerField(
        blank=False,
        help_text='Patient\'s age in years'
    )
    contact_number = models.BigIntegerField(
        blank=False,
        help_text='Patient\'s contact number'
    )
    date_of_birth = models.DateField(
        blank=False,
        help_text='Patient\'s date of birth'
    )
    room_number = models.IntegerField(
        blank=False,
        help_text='Patient\'s assigned room number'
    )
    gender = models.CharField(
        max_length=1,
        choices=[('M','Male'),('F','Female')],
        default='M',
        blank=False,
        help_text='Patient\'s gender'
    )
    blood_group = models.CharField(
        max_length=100,
        choices=Blood_Group_Choices,
        blank=False,
        default='O+',  # Most common blood type
        help_text='Patient\'s blood group'
    )
    chief_complaint = models.TextField(
        blank=False,
        default='Pain',
        help_text='Primary reason for patient\'s visit'
    )

    middle_name = models.CharField(
        max_length=100,
        blank=True,
        help_text='Patient\'s middle name (optional)'
    )
    bed_number = models.IntegerField(
        default=1,
        blank=True,
        help_text='Patient\'s assigned bed number'
    )
    religion = models.CharField(
        max_length=100,
        blank=True,
        help_text='Patient\'s religious preference'
    )
    diet = models.CharField(
        max_length=100,
        blank=True,
        help_text='Patient\'s dietary requirements or restrictions'
    )
    height = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        default=0,
        help_text='Patient\'s height in centimeters'
    )
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        default=0,
        help_text='Patient\'s weight in kilograms'
    )
    is_archived = models.BooleanField(
        default=False,
        help_text='Whether the patient record is archived'
    )
    date_archived = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Date and time when the patient record was archived'
    )

    def save(self, *args, **kwargs):
        if self.is_archived and not self.date_archived:
            self.date_archived = timezone.now()
        elif not self.is_archived:
            self.date_archived = None
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'Patients'