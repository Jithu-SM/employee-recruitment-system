import re
import spacy
import pdfplumber
from difflib import SequenceMatcher

# Load NLP model
nlp = spacy.load("en_core_web_sm")

# Define skill keywords
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

# Comprehensive section header mappings with variations
SECTION_PATTERNS = {
    "education": [
        "education", "educational background", "academic background", 
        "academic qualifications", "qualifications", "academic history",
        "degrees", "educational qualifications"
    ],
    "experience": [
        "experience", "work experience", "professional experience", 
        "employment history", "work history", "professional background",
        "career history", "employment", "professional summary"
    ],
    "skills": [
        "skills", "technical skills", "core competencies", "competencies",
        "areas of expertise", "expertise", "technical expertise",
        "skill set", "capabilities", "proficiencies"
    ],
    "projects": [
        "projects", "key projects", "project experience", "project work",
        "notable projects", "project portfolio", "personal projects"
    ],
    "certifications": [
        "certifications", "certificates", "professional certifications",
        "licenses and certifications", "credentials", "training",
        "courses", "professional development"
    ],
    "summary": [
        "summary", "professional summary", "profile", "objective",
        "career objective", "about me", "overview", "profile summary"
    ],
    "achievements": [
        "achievements", "accomplishments", "awards", "honors",
        "recognition", "awards and honors"
    ]
}

# Regex patterns
EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}")
PHONE_PATTERN = re.compile(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}")
LINKEDIN_PATTERN = re.compile(r"(https?:\/\/)?(www\.)?linkedin\.com\/[A-Za-z0-9\-_\/]+")
GITHUB_PATTERN = re.compile(r"(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9\-_\/]+")


def extract_text_from_pdf(pdf_file):
    """Extract text from PDF using pdfplumber"""
    text = ""
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def extract_contact_info(text):
    """Extract email, phone, LinkedIn, GitHub"""
    email = EMAIL_PATTERN.findall(text)
    phone = PHONE_PATTERN.findall(text)
    linkedin = LINKEDIN_PATTERN.findall(text)
    github = GITHUB_PATTERN.findall(text)
    
    return {
        "email": email[0] if email else None,
        "phone": "".join(phone[0]) if phone else None,
        "linkedin": "".join(linkedin[0]) if linkedin else None,
        "github": "".join(github[0]) if github else None,
    }


def similarity_ratio(a, b):
    """Calculate similarity between two strings"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def identify_section(line):
    """
    Identify which section a line belongs to using fuzzy matching.
    Returns the standardized section name or None.
    """
    line_clean = line.strip().lower()
    
    # Remove common prefixes/suffixes
    line_clean = re.sub(r'^[-•*\d.)\s]+', '', line_clean)
    line_clean = re.sub(r':$', '', line_clean)
    
    # Check if line is short enough to be a header (usually < 50 chars)
    if len(line_clean) > 50:
        return None
    
    best_match = None
    best_score = 0.0
    threshold = 0.7  # Similarity threshold
    
    for standard_section, variations in SECTION_PATTERNS.items():
        for variation in variations:
            score = similarity_ratio(line_clean, variation)
            if score > best_score and score >= threshold:
                best_score = score
                best_match = standard_section
    
    return best_match


def split_sections(text):
    """
    Split resume into sections based on flexible header matching.
    """
    sections = {}
    current_section = "general"
    sections[current_section] = []
    
    lines = text.splitlines()
    
    for i, line in enumerate(lines):
        line_stripped = line.strip()
        
        # Skip empty lines
        if not line_stripped:
            continue
        
        # Check if this line is a section header
        identified_section = identify_section(line_stripped)
        
        if identified_section:
            current_section = identified_section
            if current_section not in sections:
                sections[current_section] = []
        else:
            # Add content to current section
            sections[current_section].append(line_stripped)
    
    # Join lines for each section
    return {k: " ".join(v).strip() for k, v in sections.items() if v}


def extract_skills_advanced(text, sections):
    """
    Extract skills using multiple methods:
    1. Keyword matching
    2. Skills section parsing
    3. Context-based extraction
    """
    skills_found = set()
    
    # Method 1: Direct keyword matching
    text_lower = text.lower()
    for skill in SKILLS:
        if skill.lower() in text_lower:
            skills_found.add(skill)
    
    # Method 2: Parse skills section if available
    skills_section = sections.get("skills", "")
    if skills_section:
        # Split by common delimiters
        skill_items = re.split(r'[,;|\n•]', skills_section)
        for item in skill_items:
            item_clean = item.strip().lower()
            if item_clean and len(item_clean) > 1:
                # Check if it matches any known skill
                for skill in SKILLS:
                    if skill.lower() in item_clean or item_clean in skill.lower():
                        skills_found.add(skill)
    
    return sorted(list(skills_found))


def extract_name(text):
    """
    Extract name using NLP and heuristics.
    Usually the name appears in the first few lines.
    """
    doc = nlp(text[:500])  # Only check first 500 chars
    
    # Try to find PERSON entities
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    
    # Fallback: Take first non-empty line if it looks like a name
    lines = text.split('\n')
    for line in lines[:5]:  # Check first 5 lines
        line_clean = line.strip()
        if line_clean and len(line_clean.split()) <= 4:
            # Check if it doesn't contain common non-name patterns
            if not any(char in line_clean for char in ['@', 'http', ':', '•']):
                return line_clean
    
    return "Unknown"


def parse_resume(file_path):
    """
    Parse resume into structured JSON with improved section detection.
    """
    # Extract text
    text = extract_text_from_pdf(file_path)
    
    # Extract name
    name = extract_name(text)
    
    # Extract contact information
    contact = extract_contact_info(text)
    
    # Split into sections
    sections = split_sections(text)
    
    # Extract skills
    skills = extract_skills_advanced(text, sections)
    
    # Build structured output
    parsed_data = {
        "name": name,
        "contact": contact,
        "summary": sections.get("summary", ""),
        "education": sections.get("education", ""),
        "experience": sections.get("experience", ""),
        "skills": skills,
        "projects": sections.get("projects", ""),
        "certifications": sections.get("certifications", ""),
        "achievements": sections.get("achievements", ""),
    }
    
    return parsed_data


def parse_resume_from_bytes(file_bytes):
    """
    Parse resume from file bytes (for Django file uploads).
    """
    import io
    
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    
    # Extract name
    name = extract_name(text)
    
    # Extract contact information
    contact = extract_contact_info(text)
    
    # Split into sections
    sections = split_sections(text)
    
    # Extract skills
    skills = extract_skills_advanced(text, sections)
    
    # Build structured output
    parsed_data = {
        "name": name,
        "contact": contact,
        "summary": sections.get("summary", ""),
        "education": sections.get("education", ""),
        "experience": sections.get("experience", ""),
        "skills": skills,
        "projects": sections.get("projects", ""),
        "certifications": sections.get("certifications", ""),
        "achievements": sections.get("achievements", ""),
    }
    
    return parsed_data