from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Logs
from datetime import date, time

class LogsTests(APITestCase):
    def setUp(self):
        # Create some test logs
        self.log1 = Logs.objects.create(
            log_id=1,
            log_date=date.today(),
            log_time=time(12, 0),
            log_message="Test log message 1",
            log_type="INFO"
        )
        self.log2 = Logs.objects.create(
            log_id=2,
            log_date=date.today(),
            log_time=time(13, 0),
            log_message="Test log message 2",
            log_type="ERROR"
        )
        self.logs_url = reverse('logs-list')

    def test_get_logs_list(self):
        """Test retrieving a list of logs"""
        response = self.client.get(self.logs_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_log(self):
        """Test creating a new log"""
        data = {
            'log_id': 3,
            'log_date': date.today().isoformat(),
            'log_time': '14:00:00',
            'log_message': 'Test log message 3',
            'log_type': 'WARNING'
        }
        response = self.client.post(self.logs_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Logs.objects.count(), 3)
        self.assertEqual(Logs.objects.get(log_id=3).log_message, 'Test log message 3')

    def test_get_single_log(self):
        """Test retrieving a single log"""
        url = reverse('logs-detail', args=[self.log1.log_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['log_message'], 'Test log message 1')

    def test_update_log(self):
        """Test updating a log"""
        url = reverse('logs-detail', args=[self.log1.log_id])
        data = {
            'log_id': self.log1.log_id,
            'log_date': self.log1.log_date.isoformat(),
            'log_time': '15:00:00',
            'log_message': 'Updated test message',
            'log_type': 'INFO'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Logs.objects.get(log_id=self.log1.log_id).log_message, 'Updated test message')

    def test_delete_log(self):
        """Test deleting a log"""
        url = reverse('logs-detail', args=[self.log1.log_id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Logs.objects.count(), 1)
