from pyresparser import ResumeParser
import os

def parse_resume(file_path):
    data = ResumeParser(file_path).get_extracted_data()
    return data
