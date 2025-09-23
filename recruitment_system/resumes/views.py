from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import Resume
from .parser import parse_resume
from .serializers import ResumeSerializer

class ResumeUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        # Save file to disk
        resume, created = Resume.objects.get_or_create(user=request.user)
        resume.file = file
        resume.save()

        # Parse file from disk
        file_path = resume.file.path
        data = parse_resume(file_path)
        resume.parsed_data = data
        resume.save()

        return Response({"message": "Resume uploaded and parsed", "data": data})

    def get(self, request):
        resume = Resume.objects.filter(user=request.user).first()
        if not resume:
            return Response({'error': 'No resume found'}, status=404)
        return Response({
            'file': str(resume.file),
            'parsed_data': resume.parsed_data
        })
    
class ResumeListView(generics.ListAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
