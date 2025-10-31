#Esprit_school_of_engineering
# 📄 Contract & Report Management System

This project is a Spring Boot-based backend system designed to handle contract and report management functionalities, including secure document storage, watermarking, digital signing, and notification features.

## 🚀 Features

### 🧩 Contract Management
- Full CRUD operations for contract entities
- PDF upload/download functionality (stored as **Base64** in the database)
- Automatic **multiple tilted watermarks** added to uploaded PDFs for enhanced document security
- Status management (e.g., PENDING, APPROVED)
- Dynamic search by **contract ID** and **status**
- SMS notifications triggered whenever a contract’s status changes
- Statistical overview of contract statuses (e.g., how many are approved, pending, etc.)

### 📑 Report Management
- Full CRUD operations for report entities
- Statistical tracking of **reports validated by the company**
- Integrated **signature pad** to sign reports directly within the application
- Once a report is signed:
  - The `validatedByCompany` field is automatically set to **"yes"**
  - An **email notification** is sent to notify that the report has been signed
  - The signature is embedded in the **bottom-right corner** of the downloaded report

---

## 🛠️ Tech Stack

- **Backend Framework**: Spring Boot (Java)
- **Database**: MySQL
- **PDF Processing**: PDFBox (for watermarking and embedding signatures)
- **Notifications**: 
  - **SMS**: Integrated when contract status changes
  - **Email**: Sent when reports are signed
- **Digital Signature**: HTML Canvas / Signature Pad (for drawing and capturing signatures)

---

