import sys
import json
import xml.etree.ElementTree as ET
import bibtexparser
import os
import rispy

def extract_citation_info(file_path):
    """Determine file type by extension and extract citation information accordingly."""
    file_extension = os.path.splitext(file_path)[1].lower()

    if file_extension == '.bib' or file_extension == '.bibtex':
        return extract_bib_info(file_path)
    elif file_extension == '.json':
        return extract_json_info(file_path)
    elif file_extension == '.xml':
        return extract_xml_info(file_path)
    elif file_extension == '.ris':
        return extract_ris_info(file_path)
    elif file_extension == '.enw':
        return extract_enw_info(file_path)
    else:
        raise ValueError("Unsupported file format. Supported formats are .bib, .json, .xml")

def extract_bib_info(file_path):
    """Extract citation information from a .bib file."""
    with open(file_path, 'r') as bib_file:
        bib_database = bibtexparser.load(bib_file)

    citations = []
    for entry in bib_database.entries:
        citation = {
            'author': entry.get('author', 'N/A'),
            'title': entry.get('title', 'N/A'),
            'year': entry.get('year', 'N/A'),
            'journal': entry.get('journal', 'N/A'),
            'volume': entry.get('volume', 'N/A'),
            'pages': entry.get('pages', 'N/A'),
            'DOI' : entry.get('doi', 'N/A'),
            'publisher': entry.get('publisher', 'N/A')
        }
        citations.append(citation)
    return citations[0]

def extract_json_info(file_path):
    """Extract citation information from a .json file."""
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)

    citations = []
    for entry in data.get("citations", []):
        citation = {
            'author': entry.get('author', 'N/A'),
            'title': entry.get('title', 'N/A'),
            'year': entry.get('year', 'N/A'),
            'journal': entry.get('journal', 'N/A'),
            'volume': entry.get('volume', 'N/A'),
            'pages': entry.get('pages', 'N/A'),
            'DOI' : entry.get('doi', 'N/A'),
            'publisher': entry.get('publisher', 'N/A')
        }
        citations.append(citation)
    return citations[0]

def extract_xml_info(file_path):
    """Extract citation information from an .xml file."""
    tree = ET.parse(file_path)
    root = tree.getroot()

    citations = []
    for entry in root.findall("citation"):
        citation = {
            'author': entry.find("author").text if entry.find("author") is not None else 'N/A',
            'title': entry.find("title").text if entry.find("title") is not None else 'N/A',
            'year': entry.find("year").text if entry.find("year") is not None else 'N/A',
            'journal': entry.find("journal").text if entry.find("journal") is not None else 'N/A',
            'volume': entry.find("volume").text if entry.find("volume") is not None else 'N/A',
            'pages': entry.find("pages").text if entry.find("pages") is not None else 'N/A',
            'D.O.I':  entry.find("doi").text if entry.find("doi") is not None else 'N/A',
            'publisher':  entry.find("publisher").text if entry.find("publisher") is not None else 'N/A'
        }
        citations.append(citation)
    return citations[0]

def extract_ris_info(file_path):
    citations = []
    citation = {}
    with open(file_path, 'r') as ris_file:
        for line in ris_file:
            if line.startswith('A1'):  # Author
                citation['author'] = line[6:].strip()
            elif line.startswith('T1'):  # Title
                citation['title'] = line[6:].strip()
            elif line.startswith('Y1'):  # Year
                citation['year'] = line[6:].strip()
            elif line.startswith('JO'):  # Journal
                citation['journal'] = line[6:].strip()
            elif line.startswith('VL'):  # Volume
                citation['volume'] = line[6:].strip()
            elif line.startswith('SP'):  # Pages
                citation['pages'] = line[6:].strip()
            elif line.startswith('DO'):  # DOI
                citation['DOI'] = line[6:].strip()
            elif line.startswith('PB'):  # publication
                citation['publisher'] = line[6:].strip()
            elif line.strip() == '':  # Empty line denotes end of a citation
                if citation:
                    citations.append(citation)
                    citation = {}  # Reset for the next entry
    # Add the last citation if not already added
    if citation:
        citations.append(citation)

    return citations[0]

def extract_enw_info(file_path):
    citations = []
    citation = {}

    with open(file_path, 'r') as enw_file:
        for line in enw_file:
            if line.startswith('%A'):  # Author
                citation['author'] = line[3:].strip()
            elif line.startswith('%T'):  # Title
                citation['title'] = line[3:].strip()
            elif line.startswith('%D'):  # Year
                citation['year'] = line[3:].strip()
            elif line.startswith('%J'):  # Journal
                citation['journal'] = line[3:].strip()
            elif line.startswith('%V'):  # Volume
                citation['volume'] = line[3:].strip()
            elif line.startswith('%P'):  # Pages
                citation['pages'] = line[3:].strip()
            elif line.startswith('%R'):  # DOI
                citation['DOI'] = line[3:].strip()
            elif line.startswith('%I'):  # publication
                citation['publisher'] = line[3:].strip()
            elif line.strip() == '':  # Empty line denotes end of a citation
                if citation:
                    citations.append(citation)
                    citation = {}  # Reset for the next entry

    # Add the last citation if not already added
    if citation:
        citations.append(citation)

    return citations[0]


if __name__ == "__main__":
    try:
        file_path = sys.argv[1]  # Get file path from command line arguments
        citation_info = extract_citation_info(file_path)
        print(json.dumps(citation_info))  # Output JSON to stdout
    except Exception as e:
        print(json.dumps({"error": str(e)}))  # Print error message in JSON format