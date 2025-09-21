from rest_framework import viewsets, permissions
from users.models import CustomUser
from jobs.models import Job
from resumes.models import Resume
from applications.models import Application
from .serializers import UserSerializer, JobSerializer, ResumeSerializer, ApplicationSerializer

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminJobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAdminUser]
