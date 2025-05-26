from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

Blood_Group_Choices = (
    ('A+', 'A+'),
    ('A-', 'A-'),
    ('B+', 'B+'),
    ('B-', 'B-'),
    ('AB+', 'AB+'),
    ('AB-', 'AB-'),
    ('O+', 'O+'),
    ('O-', 'O-'),
    ('Rhnull', 'Rhnull')
)

Diet_Choices = (
    ('DAT', 'Diet As Tolerated'),
    ('DB', 'Diabetic Diet'),
    ('HPD', 'High Protein Diet'),
    ('LPD', 'Low Protein Diet'),
    ('LSLFD', 'Low Sodium, Low Fat Diet'),
    ('LPTD', 'Low Potassium Diet'),
    ('SD', 'Soft Diet'),
    ('FL', 'Full Liquid'),
    ('CL', 'Clear Liquid'),
    ('NGTF', 'NGT Feeding'),
    ('TPN', 'Total Parenteral Nutrition (TPN)'),
    ('NPO', 'Nothing By Mouth'),
    ('other', 'Other')
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
    sex = models.CharField(
        blank=False,
        max_length=10,
        choices=(('M','Male'),('F','Female')),
        default='Male',
        help_text='Patient\'s sex'
    )
    admitting_diagnosis = models.TextField(
        blank=False,
        default='Pain',
        help_text='Patient\'s initial diagnosis'
    )
    Final_diagnosis = models.TextField(
        blank=True,
        help_text='Patient\'s final diagnosis'
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
        blank=False,
        help_text='Patient\'s assigned bed number'
    )
    religion = models.CharField(
        max_length=100,
        blank=True,
        help_text='Patient\'s religious preference'
    )
    diet = models.CharField(
        max_length=100,
        blank=False,
        default='DAT',
        help_text='Patient\'s dietary requirements or restrictions'
    )
    height = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=False,
        default=0,
        help_text='Patient\'s height in centimeters'
    )
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=False,
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

    def clean(self):
        super().clean()
        # Validate diet format
        if self.diet:
            if self.diet.startswith('ngt:'):
                if len(self.diet) <= 4:  # Only contains 'ngt:'
                    raise ValidationError({'diet': 'NGT Feeding details are required'})
            elif self.diet.startswith('other:'):
                if len(self.diet) <= 6:  # Only contains 'other:'
                    raise ValidationError({'diet': 'Other diet details are required'})
            elif self.diet not in dict(Diet_Choices).keys():
                raise ValidationError({'diet': 'Invalid diet selection'})

    def save(self, *args, **kwargs):
        self.full_clean()  # This will run the clean() method
        if self.is_archived and not self.date_archived:
            self.date_archived = timezone.now()
        elif not self.is_archived:
            self.date_archived = None
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'Patients'