from rest_framework.views import APIView
from rest_framework.response import Response
from resumes.models import Resume
from resumes.serializers import ResumeSerializer
from .matcher import match_resumes_to_job

class MatchedResumesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        matches = match_resumes_to_job(job_id)
        results = []

        for resume_id, score in matches:
            resume = Resume.objects.get(id=resume_id)
            results.append({
                "resume_id": resume.id,
                "user": resume.user.username,
                "match_score": round(score * 100, 2),
                "parsed_data": resume.parsed_data
            })

        return Response(results)
