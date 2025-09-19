from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from users.models import CustomUser
from jobs.models import Job
from applications.models import Application
from resumes.models import Resume
from .serializers import UserSerializer, JobSerializer, ApplicationSerializer, ResumeSerializer

# Users
class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

# Jobs
class AdminJobListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

# Applications
class AdminApplicationListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        apps = Application.objects.all()
        serializer = ApplicationSerializer(apps, many=True)
        return Response(serializer.data)

# Resumes
class AdminResumeListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        resumes = Resume.objects.all()
        serializer = ResumeSerializer(resumes, many=True)
        return Response(serializer.data)
