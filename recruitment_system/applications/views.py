from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Application
from .serializers import ApplicationSerializer
from jobs.models import Job
from rest_framework import generics, permissions
from resumes.models import Resume
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

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
        # Get all applications of the logged-in user
        applications = Application.objects.filter(user=request.user).select_related("job")
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class ApplyJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        job = Job.objects.get(id=job_id)
        resume = Resume.objects.filter(user=request.user).first()

        if not resume:
            return Response({"error": "Upload your resume first"}, status=400)

        # --- Calculate match score (basic TF-IDF on skills + description) ---
        job_text = f"{job.title} {job.description} {job.skills_required}"
        resume_text = " ".join(resume.parsed_data.get("skills", []))

        vectorizer = TfidfVectorizer().fit([job_text, resume_text])
        vectors = vectorizer.transform([job_text, resume_text])
        similarity = cosine_similarity(vectors[0], vectors[1])[0][0]
        match_score = round(similarity * 100)

        # --- Create application ---
        application, created = Application.objects.get_or_create(
            user=request.user,
            job=job,
            defaults={"match_score": match_score}
        )

        if not created:
            return Response({"message": "Already applied"}, status=400)

        return Response({"message": "Applied successfully", "match_score": match_score})



class JobApplicantsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id, posted_by=request.user)
            applications = Application.objects.filter(job=job).order_by('-match_score')
            return Response(ApplicationSerializer(applications, many=True).data)
        except Job.DoesNotExist:
            return Response({"error": "Job not found or not owned by you"}, status=404)


# View a single application by ID
class ApplicationDetailView(generics.RetrieveUpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        # ensure recruiter can only update status
        serializer.save()

class JobApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        applications = Application.objects.filter(job_id=job_id)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

class MyApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        try:
            application = Application.objects.get(user=request.user, job_id=job_id)
            serializer = ApplicationSerializer(application)
            return Response(serializer.data)
        except Application.DoesNotExist:
            return Response({"detail": "No application found."}, status=404)
        
class ApplicationUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({"error": "Application not found"}, status=404)

        status_value = request.data.get("status")
        message = request.data.get("recruiter_message")

        if status_value:
            application.status = status_value
        if message:
            application.recruiter_message = message

        application.save()
        return Response({"message": "Application updated successfully"})
