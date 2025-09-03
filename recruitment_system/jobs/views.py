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
            # Get the user's resume
            resume = Resume.objects.filter(user=request.user).first()
            if not resume or not resume.parsed_data:
                return Response({"error": "No parsed resume found"}, status=400)

            # Extract candidate text from parsed resume
            parsed_data = resume.parsed_data
            candidate_text = " ".join([
                " ".join(parsed_data.get("skills", [])),
                parsed_data.get("education", ""),
                parsed_data.get("experience", "")
            ])

            # Get all job descriptions
            jobs = Job.objects.all()
            job_texts = [job.description for job in jobs]

            if not job_texts:
                return Response({"error": "No jobs available"}, status=400)

            # TF-IDF + Cosine Similarity
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform([candidate_text] + job_texts)
            cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

            # Rank jobs by similarity
            ranked_jobs = sorted(
                zip(jobs, cosine_sim),
                key=lambda x: x[1],
                reverse=True
            )

            # Return top 5 jobs (or all if fewer)
            results = [
                {
                    "id": job.id,
                    "title": job.title,
                    "company": job.company,
                    "description": job.description,
                    "similarity_score": float(score)
                }
                for job, score in ranked_jobs[:5]
            ]

            return Response(results, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class JobPostView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]