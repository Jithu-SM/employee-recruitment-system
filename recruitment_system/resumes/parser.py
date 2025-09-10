import spacy
import pdfplumber

nlp = spacy.load("en_core_web_sm")
# skill / education / exp keywords
SKILLS = {
    "python", "django", "react", "javascript", "html", "css", "sql", "java", "kotlin",
    "c", "c++", "c#", "go", "typescript", "nodejs", "node.js", "angular", "vue", "flask",
    "spring", "ruby", "rails", "php", "swift", "objective-c", "matlab", "r", "scala",
    "perl", "bash", "shell", "powershell", "aws", "azure", "gcp", "docker", "kubernetes",
    "git", "linux", "unix", "mongodb", "postgresql", "mysql", "firebase", "rest", "graphql",
    "machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "keras", "opencv",
    "pandas", "numpy", "scikit-learn", "data analysis", "data science", "excel", "tableau",
    "power bi", "jira", "agile", "scrum", "ci/cd", "devops"
}
EDU_KEYWORDS = {"bca", "mca", "b.tech", "m.tech", "bachelor", "master", "bsc", "msc", "degree", "university", "college"}
EXP_KEYWORDS = {"experience", "worked", "developed", "intern", "project"}


def extract_text_from_pdf(pdf_file):
    """Extract text from PDF using pdfplumber"""
    text = ""
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def parse_resume(file_path):
    """Parse resume text into structured data"""
    text = extract_text_from_pdf(file_path)
    doc = nlp(text)

    # Extract NAME
    name = ""
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            break

    # Extract SKILLS
    skills_found = [word.text for word in doc if word.text.lower() in SKILLS]

    # Extract EDUCATION
    education = []
    for sent in doc.sents:
        if any(word in sent.text.lower() for word in EDU_KEYWORDS):
            education.append(sent.text)

    # Extract EXPERIENCE
    experience = []
    for sent in doc.sents:
        if any(word in sent.text.lower() for word in EXP_KEYWORDS):
            experience.append(sent.text)

    return {
        "name": name,
        "skills": list(set(skills_found)),
        "education": " ".join(education[:2]),
        "experience": " ".join(experience[:2]),
    }
