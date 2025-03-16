from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class LoginViewTests(APITestCase):
    def setUp(self):
        # Create a test user
        self.test_user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.login_url = reverse('token')

    def test_successful_login(self):
        """Test for successful login with correct credentials"""
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_failed_login_wrong_password(self):
        """Test for failed login with wrong password"""
        data = {
            'username': 'testuser',
            'password': 'wrongpass'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_failed_login_wrong_username(self):
        """Test for failed login with wrong username"""
        data = {
            'username': 'wronguser',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)