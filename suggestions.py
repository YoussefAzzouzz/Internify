import os
import subprocess
from PyPDF2 import PdfReader
from PIL import Image
import pytesseract
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
from pdf2image import convert_from_path
from typing import List
from PIL import Image

def convert_pdf_to_images(pdf_path: str) -> List[Image.Image]:
    """
    Convert each page of the PDF to a PIL Image.
    Returns a list of images.
    """
    images = convert_from_path(pdf_path, poppler_path=r"C:\Users\samer\OneDrive\Documents\poppler-25.07.0\Library\bin")
    return images

# BLIP model for image captioning
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF.
    Only works with PDFs containing selectable text.
    """
    text = ""
    with open(file_path, "rb") as f:
        reader = PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""

    if not text.strip():
        raise ValueError("PDF contains no selectable text. Please use a text-based PDF.")

    return text

def extract_text_from_image(file_path: str) -> str:
    # Use BLIP for image captioning
    image = Image.open(file_path).convert("RGB")
    inputs = processor(image, return_tensors="pt")
    out = model.generate(**inputs)
    caption = processor.decode(out[0], skip_special_tokens=True)
    return caption