from rest_framework.routers import DefaultRouter
from .views import MedicationsViewSet

router = DefaultRouter()
router.register(r'medications', MedicationsViewSet, basename='medications')

urlpatterns = router.urls