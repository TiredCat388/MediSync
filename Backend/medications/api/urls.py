from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MedicationsViewSet

router = DefaultRouter()
router.register(r'medications', MedicationsViewSet, basename='medications')

urlpatterns = router.urls + [
    path(
        'medications/<str:patient_number>/<str:schedule_id>/',
        MedicationsViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}),
        name='medications-detail'
    ),
    path(
        'medications/',
        MedicationsViewSet.as_view({'post': 'create'}),
        name='medications-create'
    ),
]