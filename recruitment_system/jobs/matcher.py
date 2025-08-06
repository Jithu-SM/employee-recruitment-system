from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from resumes.models import Resume
from .models import Job

def match_resumes_to_job(job_id):
    job = Job.objects.get(id=job_id)
    resumes = Resume.objects.exclude(parsed_data=None)

    job_text = job.description + ' ' + job.skills_required
    resume_texts = []
    resume_ids = []

    for resume in resumes:
        parsed = resume.parsed_data
        if parsed:
            text = ' '.join([
                parsed.get('skills', ''),
                parsed.get('experience', ''),
                parsed.get('education', ''),
                parsed.get('designation', '')
            ])
            resume_texts.append(text)
            resume_ids.append(resume.id)

    documents = [job_text] + resume_texts

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]

    matches = list(zip(resume_ids, cosine_sim))
    matches.sort(key=lambda x: x[1], reverse=True)  # sort by match score

    return matches  # List of (resume_id, similarity score)
