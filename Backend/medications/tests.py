from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from medications.models import Medications
from patients.models import Patients

class MedicationsAPITestCase(TestCase):
    def setUp(self):
        self.patient = Patients.objects.create(
            patient_number="12345",
            first_name="John",
            last_name="Doe",
            middle_name="A",
            date_of_birth="1990-01-01",
            room_number="101",
            age=33,
            contact_number="1234567890",
            bed_number="101"
        )

        self.medication = Medications.objects.create(
            Medication_name="Aspirin",
            Dosage="500",
            Dosage_Unit="mg",
            Medication_Time="08:00:00",
            Frequency="12:00:00",
            Medication_notes="Take with food",
            patient_number=self.patient
        )

        self.client = APIClient()

    def test_schedule_id_auto_generation(self):
        medication = Medications.objects.create(
            Medication_name="Ibuprofen",
            Dosage="200",
            Dosage_Unit="mg",
            Medication_Time="10:00:00",
            Frequency="23:00:00",
            Medication_notes="Take after meals",
            patient_number=self.patient
        )
        self.assertIsNotNone(medication.schedule_id)
        self.assertEqual(medication.schedule_id, self.medication.schedule_id + 1)

    def test_create_medication(self):
        url = reverse('medications-create')
        data = {
            "patient_number": self.patient.patient_number,
            "Medication_name": "Paracetamol",
            "Dosage": "500",
            "Dosage_Unit": "mg",
            "Medication_Time": "09:00:00",
            "Frequency": "12:00:00",
            "Medication_notes": "Take with water"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Medications.objects.count(), 2)

    def test_retrieve_medication(self):
        url = reverse('medications-detail', kwargs={
            'patient_number': self.patient.patient_number,
            'schedule_id': self.medication.schedule_id
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Medication_name'], self.medication.Medication_name)

    def test_update_medication(self):
        url = reverse('medications-detail', kwargs={
            'patient_number': self.patient.patient_number,
            'schedule_id': self.medication.schedule_id
        })
        data = {
            "Medication_name": "Updated Aspirin",
            "Dosage": "600",
            "Dosage_Unit": "mg"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.medication.refresh_from_db()
        self.assertEqual(self.medication.Medication_name, "Updated Aspirin")
        self.assertEqual(self.medication.Dosage, "600")

    def test_delete_medication(self):
        url = reverse('medications-detail', kwargs={
            'patient_number': self.patient.patient_number,
            'schedule_id': self.medication.schedule_id
        })
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Medications.objects.count(), 0)