from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from medications.models import Medications
from patients.models import Patients
from datetime import date, time, timedelta, datetime
from django.utils import timezone


class MedicationsAPITestCase(TestCase):
    def setUp(self):
        self.patient = Patients.objects.create(
        first_name="John",
        last_name="Doe",
        age=33,
        sex='M',
        admitting_diagnosis="Headache",
        Final_diagnosis="Migraine",
        contact_number=1234567890,
        date_of_birth="1990-01-01",
        room_number=101,
        blood_group='O+',
        chief_complaint="Headache",
        middle_name="A",
        bed_number=12,
        religion="None",
        diet='DAT',
        height=175.00,
        weight=70.00,
        is_archived=False,
        date_archived=None
    )

        self.medication = Medications.objects.create(
        Medication_name="Aspirin",
        Medication_strength=500,
        Medication_unit="mg",
        Medication_Time=time(8, 0),
        Frequency=timedelta(hours=12),
        Medication_notes="Take with food",
        patient_number=self.patient,
        Medication_start_date=date.today(),
        Medication_end_date=date.today() + timedelta(days=10),
        Medication_route="Oral",
        Frequency_type='OD'
    )

        self.client = APIClient()

    def test_schedule_id_auto_generation(self):
        medication = Medications.objects.create(
            Medication_name="Ibuprofen",
            Medication_strength=200,
            Medication_unit="mg",
            Medication_Time=time(10, 0),
            Frequency=timedelta(days=1),
            Medication_notes="Take after meals",
            patient_number=self.patient,
            Medication_start_date=date.today(),
            Medication_end_date=date.today() + timedelta(days=10),
            Medication_route="Oral",
            Frequency_type='OD'
        )
        self.assertIsNotNone(medication.schedule_id)
        self.assertEqual(medication.schedule_id, self.medication.schedule_id + 1)

    def test_create_medication(self):
        url = reverse('medications-create')
        data = {
            "patient_number": self.patient.patient_number,
            "Medication_name": "Paracetamol",
            "Medication_strength": 500,
            "Medication_unit": "mg",
            "Medication_Time": "09:00:00",
            "Frequency": "12:00:00",
            "Medication_notes": "Take with water",
            "Medication_start_date": str(date.today()),
            "Medication_end_date": str(date.today() + timedelta(days=5)),
            "Medication_route": "Oral",
            "Frequency_type": "BID"
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
            "Medication_strength": 600,
            "Medication_unit": "mg"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.medication.refresh_from_db()
        self.assertEqual(self.medication.Medication_name, "Updated Aspirin")
        self.assertEqual(self.medication.Medication_strength, 600)

    def test_delete_medication(self):
        url = reverse('medications-detail', kwargs={
            'patient_number': self.patient.patient_number,
            'schedule_id': self.medication.schedule_id
        })
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Medications.objects.count(), 0)

    # === New tests for frequency and next_dose_time ===

    def test_next_dose_time_OD(self):
        self.medication.Frequency_type = 'OD'
        self.medication.Medication_start_date = timezone.localdate()
        self.medication.Medication_end_date = None
        self.medication.Frequency = timedelta(hours=24)
        self.medication.save()

        next_dose = self.medication.get_next_dose_time()
        self.assertIsNotNone(next_dose)
        self.assertTrue(isinstance(next_dose, datetime))

        now = timezone.localtime(timezone.now())
        dose_times = [time(8, 0)]  # 8 AM
        possible_next_doses = [
            timezone.make_aware(datetime.combine(now.date(), t)) for t in dose_times
        ]
        # Also include next day dose in case 8AM today already passed
        possible_next_doses.append(
            timezone.make_aware(datetime.combine(now.date() + timedelta(days=1), dose_times[0]))
        )

        self.assertTrue(any(next_dose == dt or (next_dose > now and next_dose == dt) for dt in possible_next_doses))

    def test_next_dose_time_BID(self):
        self.medication.Frequency_type = 'BID'
        self.medication.Medication_start_date = timezone.localdate()
        self.medication.Medication_end_date = None
        self.medication.Frequency = timedelta(hours=12)
        self.medication.save()

        next_dose = self.medication.get_next_dose_time()
        self.assertIsNotNone(next_dose)
        self.assertTrue(isinstance(next_dose, datetime))

        now = timezone.localtime(timezone.now())
        dose_times = [time(8, 0), time(18, 0)]  # 8 AM, 6 PM
        possible_next_doses = [
            timezone.make_aware(datetime.combine(now.date(), t)) for t in dose_times
        ]
        possible_next_doses.append(
            timezone.make_aware(datetime.combine(now.date() + timedelta(days=1), dose_times[0]))
        )

        self.assertTrue(any(next_dose == dt or (next_dose > now and next_dose == dt) for dt in possible_next_doses))

    def test_next_dose_time_TID(self):
        self.medication.Frequency_type = 'TID'
        self.medication.Medication_start_date = timezone.localdate()
        self.medication.Medication_end_date = None
        self.medication.Frequency = timedelta(hours=8)
        self.medication.save()

        next_dose = self.medication.get_next_dose_time()
        self.assertIsNotNone(next_dose)
        self.assertTrue(isinstance(next_dose, datetime))

        now = timezone.localtime(timezone.now())
        dose_times = [time(8, 0), time(13, 0), time(18, 0)]  # 8 AM, 1 PM, 6 PM
        possible_next_doses = [
            timezone.make_aware(datetime.combine(now.date(), t)) for t in dose_times
        ]
        possible_next_doses.append(
            timezone.make_aware(datetime.combine(now.date() + timedelta(days=1), dose_times[0]))
        )

        self.assertTrue(any(next_dose == dt or (next_dose > now and next_dose == dt) for dt in possible_next_doses))

    def test_next_dose_time_QID(self):
        self.medication.Frequency_type = 'QID'
        self.medication.Medication_start_date = timezone.localdate()
        self.medication.Medication_end_date = None
        self.medication.Frequency = timedelta(hours=4)
        self.medication.save()

        next_dose = self.medication.get_next_dose_time()
        self.assertIsNotNone(next_dose)
        self.assertTrue(isinstance(next_dose, datetime))

        now = timezone.localtime(timezone.now())
        dose_times = [time(8, 0), time(12, 0), time(16, 0), time(20, 0)]  # 8 AM, 12 PM, 4 PM, 8 PM
        possible_next_doses = [
            timezone.make_aware(datetime.combine(now.date(), t)) for t in dose_times
        ]
        possible_next_doses.append(
            timezone.make_aware(datetime.combine(now.date() + timedelta(days=1), dose_times[0]))
        )

        self.assertTrue(any(next_dose == dt or (next_dose > now and next_dose == dt) for dt in possible_next_doses))

    def test_next_dose_time_Other(self):
        self.medication.Frequency_type = 'Other'
        self.medication.Medication_start_date = timezone.localdate()
        self.medication.Medication_end_date = None
        self.medication.Medication_Time = time(9, 0)
        self.medication.Frequency = timedelta(hours=8)
        self.medication.save()

        next_dose = self.medication.get_next_dose_time()
        self.assertIsNotNone(next_dose)
        self.assertTrue(isinstance(next_dose, datetime))

        now = timezone.localtime(timezone.now())
        start_datetime = timezone.make_aware(datetime.combine(self.medication.Medication_start_date, self.medication.Medication_Time))

        # next dose should be after now and aligned with 8 hour intervals from start_datetime
        self.assertTrue(next_dose >= now)

        elapsed_seconds = (now - start_datetime).total_seconds()
        freq_seconds = self.medication.Frequency.total_seconds()
        intervals_passed = int(elapsed_seconds // freq_seconds) + 1
        expected_next_dose = start_datetime + timedelta(seconds=intervals_passed * freq_seconds)

        self.assertEqual(next_dose, expected_next_dose)