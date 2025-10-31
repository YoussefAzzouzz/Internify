📝 AI Report Summarizer
🚀 Overview

AI Report Summarizer is a Java-based service that automatically generates concise summaries of technical or academic reports and exports them as professional PDF documents.

Using Azure OpenAI, it produces clear, structured summaries in French, and with Apache PDFBox, it creates well-formatted PDFs suitable for sharing or archiving.

This tool is perfect for transforming lengthy reports into easy-to-read résumés highlighting objectives, methodology, key results, and conclusions.

✨ Features

🤖 AI-powered summaries: Generate structured, formal summaries in French.

📄 PDF export: Produce clean, readable PDF files with proper UTF-8 font support.

⏱️ Handles long reports: Limits input text to 8000 characters for smooth processing.

⚠️ Error handling: Provides clear messages if reports are missing, empty, or if AI processing fails.

🛠️ Setup

Azure OpenAI API Key

Required to generate summaries. Configure it in the service.

Add TrueType Font (recommended)

Download DejaVuSans.ttf for full French character support.

Place it in: src/main/resources/fonts/DejaVuSans.ttf

Dependencies

Apache PDFBox

JSON (org.json or similar)

📚 Usage

Generate a résumé as text

Extract text from a report and produce a concise summary using AI.

Generate a résumé PDF

Convert the AI-generated summary into a PDF with proper formatting and font support.

💡 Notes

Summaries are limited to 8000 characters to ensure smooth AI processing.

PDF text is dynamically wrapped to fit page width.

If a TrueType font is not available, the service can fall back to Helvetica, but some French characters may require cleaning.

⚡ Example Workflow

Extract text from a PDF report.

Generate a French résumé using AI.

Export the résumé as a PDF file.

This makes it quick and easy to create professional summaries from reports stored in your system.
