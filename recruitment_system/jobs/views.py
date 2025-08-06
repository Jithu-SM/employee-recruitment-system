from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from resumes.models import Resume
from resumes.serializers import ResumeSerializer
from .matcher import match_resumes_to_job
from rest_framework import generics
from .models import Job
from .serializers import JobSerializer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


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


class JobPostView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
