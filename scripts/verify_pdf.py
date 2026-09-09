import os
import re

pdf_path = r'C:\Users\mursh\PP\dataforge\Memory_Under_Pressure_Concept_Summary.pdf'

if not os.path.exists(pdf_path):
    print(f"Error: {pdf_path} not found")
    exit(1)

file_size = os.path.getsize(pdf_path)
print(f"PDF File Size: {file_size} bytes")

with open(pdf_path, 'rb') as f:
    content = f.read()

# In PDF format, each page has a dictionary object with /Type /Page (or /Type/Page)
pages = re.findall(rb'/Type\s*/Page\b', content)
page_count = len(pages)
print(f"Detected PDF Page Count: {page_count}")

# Check if there is a Pages dictionary with /Count
count_match = re.search(rb'/Type\s*/Pages\b[^>]*?/Count\s+(\d+)', content)
if count_match:
    print(f"Pages Catalog Count: {int(count_match.group(1))}")
