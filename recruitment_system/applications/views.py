from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Application
from .serializers import ApplicationSerializer
from jobs.models import Job

class ApplicationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class ApplicationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applications = Application.objects.filter(user=request.user)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

class ApplyJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
            application, created = Application.objects.get_or_create(
                user=request.user,
                job=job
            )
            if not created:
                return Response({"message": "Already applied to this job"}, status=400)

            return Response({"message": "Application submitted successfully"}, status=201)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)


class JobApplicantsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id, posted_by=request.user)
            applications = Application.objects.filter(job=job).order_by('-match_score')
            return Response(ApplicationSerializer(applications, many=True).data)
        except Job.DoesNotExist:
            return Response({"error": "Job not found or not owned by you"}, status=404)

