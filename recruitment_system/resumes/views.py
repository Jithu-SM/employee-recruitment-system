from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .models import Resume
from .parser import parse_resume

class ResumeUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        if not file.name.endswith('.pdf'):
            return Response({'error': 'Only PDF files are allowed.'}, status=400)

        # Save file to user
        resume, created = Resume.objects.get_or_create(user=request.user)
        resume.file = file
        resume.save()

        # Parse file
        file_path = resume.file.path
        data = parse_resume(file_path)
        resume.parsed_data = data
        resume.save()

        return Response({'message': 'Resume uploaded and parsed.', 'data': data})
