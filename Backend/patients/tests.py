from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Patients
from datetime import date

class PatientsTests(APITestCase):
    def setUp(self):
        # Create some test patients
        self.patient1 = Patients.objects.create(
            first_name="John",
            last_name="Doe",
            middle_name="",
            bed_number=101,
            patient_number=1,
            age=45,
            contact_number=1234567890,
            date_of_birth=date(1980, 1, 1),
            room_number=1
        )
        self.patient2 = Patients.objects.create(
            first_name="Jane",
            last_name="Doe",
            middle_name="",
            bed_number=102,
            patient_number=2,
            age=35,
            contact_number=1234567891,
            date_of_birth=date(1990, 2, 2),
            room_number=2
        )
        self.patients_url = reverse('patients-list')

    def test_get_patients_list(self):
        """Test retrieving a list of patients"""
        response = self.client.get(self.patients_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_patient(self):
        """Test creating a new patient"""
        data = {
            'first_name': 'Alice',
            'last_name': 'Smith',
            'middle_name': '',
            'bed_number': 103,
            'age': 25,
            'contact_number': 1234567892,
            'date_of_birth': date(2000, 3, 3).isoformat(),
            'room_number': 3
        }
        response = self.client.post(self.patients_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Patients.objects.count(), 3)
        self.assertEqual(Patients.objects.get(patient_number=3).first_name, 'Alice')

    def test_get_single_patient(self):
        """Test retrieving a single patient"""
        url = reverse('patients-detail', args=[self.patient1.patient_number])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'John')

    def test_delete_patient(self):
        """Test deleting a patient"""
        url = reverse('patients-detail', args=[self.patient1.patient_number])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Patients.objects.count(), 1)
