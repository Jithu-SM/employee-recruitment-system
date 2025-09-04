from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from resumes.models import Resume
from resumes.serializers import ResumeSerializer
from .matcher import match_resumes_to_job
from rest_framework import generics, permissions
from .models import Job
from .serializers import JobSerializer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import traceback
import logging

logger = logging.getLogger(__name__)

class MatchedResumesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)

        resumes = Resume.objects.all()
        resume_texts = [resume.text for resume in resumes]  # Replace `text` with actual field name
        documents = [job.description] + resume_texts

        tfidf = TfidfVectorizer()
        tfidf_matrix = tfidf.fit_transform(documents)
        similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        matched_resumes = [
            {"resume": ResumeSerializer(resumes[i]).data, "score": float(similarities[i])}
            for i in range(len(resumes))
            if similarities[i] > 0.1
        ]

        matched_resumes.sort(key=lambda x: x["score"], reverse=True)
        return Response(matched_resumes)


class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only logged-in users can post jobs

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

class JobSuggestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            resume = Resume.objects.filter(user=request.user).first()
            if not resume or not resume.parsed_data:
                return Response({"error": "No resume data found. Please upload your resume."}, status=400)

            jobs = Job.objects.all()
            if not jobs.exists():
                return Response({"error": "No jobs available."}, status=400)

            resume_text = " ".join(resume.parsed_data.get("skills", []))
            job_texts = [job.description for job in jobs]

            if not resume_text.strip():
                return Response({"error": "Resume has no skills data."}, status=400)

            corpus = [resume_text] + job_texts
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform(corpus)
            cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

            job_suggestions = []
            for job, score in zip(jobs, cosine_sim):
                job_suggestions.append({
                    "id": job.id,
                    "title": job.title,
                    "company": job.company,
                    "description": job.description,
                    "score": float(score)
                })

            job_suggestions = sorted(job_suggestions, key=lambda x: x["score"], reverse=True)

            return Response(job_suggestions)

        except Exception as e:
            logger.error("Error in JobSuggestionsView: %s", traceback.format_exc())
            return Response({"error": str(e)}, status=500)

class JobPostView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]


class RecruiterJobsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = Job.objects.filter(recruiter=request.user)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(recruiter=request.user)  # recruiter auto-filled
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
