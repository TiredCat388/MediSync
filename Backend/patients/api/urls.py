from rest_framework import routers
from django.urls import path, include
from .views import PatientsViewSet

router = routers.DefaultRouter()
router.register(r'patients', PatientsViewSet, basename='patients')
urlpatterns = [
    path('patients/by-number/<str:patient_number>/', PatientsViewSet.as_view({'get': 'get_by_patient_number'})),
    path('', include(router.urls)),
]

