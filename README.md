#Esprit_school_of_engineering
# 📄 Demand, Response & Evaluation Management System

A Spring Boot-based backend system that streamlines the internship application process by managing student demands, company responses, and evaluation workflows. It includes CV parsing, smart filtering, notifications, and feedback features to enhance the visibility and matchability of student profiles.

---

## 🚀 Features

### 📥 Internship Demand Management
- 🔧 Full CRUD operations for internship demands
- 📄 Upload & parse CVs (stored as Base64) using a Python microservice
- 🧠 Extract skills, experience, and education using an integrated CV parser
- 🎯 Field-based search and 📆 date-based sort for efficient filtering
- 📍 Geolocation-based matching using latitude/longitude
- 🤝 Skill-based matching between internship offers and student profiles
- 🔄 Demand status tracking: `PENDING`, `REVIEWED`, `ACCEPTED`, `REJECTED`
- 📊 Statistical overview of demands by status and field of study

### 💬 Company Response Management
- 🔧 Full CRUD for responses linked to specific demands
- ✍️ Commenting system with keyword-based search
- 📨 SMS & in-app notifications when a student receives a response
- 🔒 Profanity filtering in comments via scheduled tasks
- 🔄 Response status tracking: `ACCEPTED`, `REJECTED`

### ⭐ Candidate Evaluation & Feedback
- ⭐ Companies can evaluate demands with ratings (1–5 stars) and comments
- 🧾 Ratings and feedback stored in student profile
- 🚫 Scheduled cleanup of inappropriate evaluations
- 📊 Aggregate statistics on evaluations by field and rating

---

## 🛠️ Tech Stack

| Layer       | Technology              |
|-------------|--------------------------|
| Backend     | Spring Boot (Java)       |
| Database    | MySQL                    |
| CV Parsing  | Python Flask Microservice|
| Notifications | Twilio (SMS), JavaMail, WebSocket (in-app) |
| PDF Handling| Apache PDFBox            |
| Security    | JWT, Role-Based Access   |

---

## 📂 Project Structure

