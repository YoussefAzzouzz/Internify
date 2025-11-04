import pytest
from suggestions import extract_text_from_pdf, extract_text_from_image, convert_pdf_to_images
from PyPDF2 import PdfWriter
from PIL import Image
from unittest.mock import patch, MagicMock
from reportlab.pdfgen import canvas
import os

# ---------------------- PDF ----------------------
def test_extract_text_from_pdf(tmp_path):
    # Créer un PDF temporaire avec du texte
    file_path = tmp_path / "test.pdf"

    c = canvas.Canvas(str(file_path))
    c.drawString(100, 750, "Hello World")  # texte sélectionnable
    c.save()

    # Devrait renvoyer une string contenant "Hello World"
    result = extract_text_from_pdf(str(file_path))
    assert isinstance(result, str)
    assert "Hello World" in result

def test_extract_text_from_pdf_nonexistent():
    # PDF non existant
    with pytest.raises(FileNotFoundError):
        extract_text_from_pdf("no_file.pdf")

# ---------------------- Image ----------------------
@patch("suggestions.Image.open")
@patch("suggestions.model.generate")
@patch("suggestions.processor")
def test_extract_text_from_image(mock_processor, mock_generate, mock_open):
    mock_image = MagicMock()
    mock_open.return_value = mock_image
    mock_generate.return_value = [0]
    mock_processor.decode.return_value = "Test caption"

    caption = extract_text_from_image("fake_image.jpg")
    assert caption == "Test caption"

# ---------------------- Conversion PDF -> Images ----------------------
def test_convert_pdf_to_images(tmp_path):
    # Créer un PDF temporaire
    file_path = tmp_path / "test.pdf"
    pdf_writer = PdfWriter()
    pdf_writer.add_blank_page(width=72, height=72)
    with open(file_path, "wb") as f:
        pdf_writer.write(f)

    images = convert_pdf_to_images(str(file_path))
    assert isinstance(images, list)
    assert all(isinstance(img, Image.Image) for img in images)