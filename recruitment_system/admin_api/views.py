from rest_framework.permissions import IsAdminUser
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from users.models import CustomUser
from jobs.models import Job
from resumes.models import Resume
from applications.models import Application
from users.serializers import UserSerializer
from jobs.serializers import JobSerializer
from resumes.serializers import ResumeSerializer
from applications.serializers import ApplicationSerializer

# Users
class AdminUserListView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class AdminUserDetailView(RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

# Jobs
class AdminJobListView(ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAdminUser]

class AdminJobDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAdminUser]

# Resumes
class AdminResumeListView(ListAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsAdminUser]

# Applications
class AdminApplicationListView(ListAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAdminUser]
