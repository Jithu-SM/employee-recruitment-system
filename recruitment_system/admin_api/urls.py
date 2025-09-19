from django.urls import path
from .views import (
    AdminUserListView,
    AdminJobListView,
    AdminApplicationListView,
    AdminResumeListView,
)

urlpatterns = [
    path("users/", AdminUserListView.as_view(), name="admin-users"),
    path("jobs/", AdminJobListView.as_view(), name="admin-jobs"),
    path("applications/", AdminApplicationListView.as_view(), name="admin-applications"),
    path("resumes/", AdminResumeListView.as_view(), name="admin-resumes"),
]
