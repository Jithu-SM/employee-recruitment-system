from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminUserViewSet, AdminJobViewSet, AdminResumeViewSet, AdminApplicationViewSet

router = DefaultRouter()
router.register(r'jobs', AdminJobViewSet, basename='admin-jobs')
router.register(r'resumes', AdminResumeViewSet, basename='admin-resumes')
router.register(r'users', AdminUserViewSet, basename='admin-users')
router.register(r'applications', AdminApplicationViewSet, basename='admin-applications')


urlpatterns = router.urls
