from rest_framework import viewsets
from ..models import Medications
from .serializers import MedicationsModelSerializer

class MedicationsViewSet(viewsets.ModelViewSet):
    queryset = Medications.objects.all()
    serializer_class = MedicationsModelSerializer
