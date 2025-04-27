from django.db import models
from django.utils import timezone


class Emergencycontactdetails(models.Model):
    first_name = models.CharField(max_length=100, blank=False)
    last_name = models.CharField(max_length=100, blank=True)
    relation_to_patient = models.CharField(max_length=100, blank=False)
    contact_number = models.BigIntegerField(blank=False)
    patient_number = models.OneToOneField('Patients', on_delete=models.CASCADE, db_column='patient_number', primary_key=True)

    class Meta:
        db_table = 'EmergencyContactDetails'

class Patients(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    bed_number = models.IntegerField()
    patient_number = models.AutoField(primary_key=True)
    age = models.IntegerField(blank=False)
    contact_number = models.BigIntegerField(blank=False)
    date_of_birth = models.DateField(blank=False)
    room_number = models.IntegerField(blank=False)
    is_archived = models.BooleanField(default=False)
    date_archived = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.is_archived and not self.date_archived:
            self.date_archived = timezone.now()
        elif not self.is_archived:
            self.date_archived = None
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'Patients'