from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from users.models import CustomUser
from jobs.models import Job
from resumes.models import Resume
from applications.models import Application
from .serializers import UserSerializer, JobSerializer, ResumeSerializer, ApplicationSerializer
from rest_framework.response import Response
from rest_framework import status

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        user = self.get_object()
        if user.user_type == "recruiter":
            user.is_approved = True
            user.save()
            return Response({"status": "Recruiter approved!"}, status=status.HTTP_200_OK)
        return Response({"error": "Not a recruiter"}, status=status.HTTP_400_BAD_REQUEST)


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
