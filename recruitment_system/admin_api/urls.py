from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminUserViewSet, AdminJobViewSet, AdminResumeViewSet, AdminApplicationViewSet

router = DefaultRouter()
router.register("users", AdminUserViewSet, basename="admin-users")
router.register("jobs", AdminJobViewSet, basename="admin-jobs")
router.register("resumes", AdminResumeViewSet, basename="admin-resumes")
router.register("applications", AdminApplicationViewSet, basename="admin-applications")

urlpatterns = [
    path("", include(router.urls)),
]
