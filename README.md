AI Report Summarizer
Overview

AI Report Summarizer is a Java-based service designed to automatically generate concise summaries of technical or academic reports and export them as PDF documents. The service leverages Azure OpenAI for AI-powered summarization in French and Apache PDFBox for PDF generation.

This project allows users to easily transform lengthy reports into clear, structured résumés that highlight objectives, methodology, results, and conclusions.

Features

AI-powered summarization: Generates structured and professional summaries in French.

PDF export: Converts summaries into well-formatted PDFs with line wrapping and UTF-8 font support.

Handles long reports: Limits input to 8000 characters to ensure smooth AI processing.

Error handling: Provides meaningful messages if reports are empty, missing, or if AI processing fails.

Usage

Generate a résumé as text: The service extracts text from an existing PDF report and produces a concise summary using AI.

Generate a résumé PDF: The AI-generated text is converted into a PDF with proper formatting and font support.

Setup

Azure OpenAI API Key: Required to generate summaries. Configure it in the service.

TrueType Font (recommended): For proper French character support, download DejaVuSans.ttf and place it in the resources folder.

Dependencies: Apache PDFBox and JSON libraries.

Notes

Summaries are limited to 8000 characters for AI input.

PDFs are dynamically wrapped to fit page width.

If a TrueType font is not available, the service can fall back to Helvetica, but some French characters may require cleaning.

Example Workflow

Extract text from a report.

Generate a French résumé using AI.

Export the résumé to a PDF file.

This workflow allows users to quickly create professional summaries for reports stored in the system.
