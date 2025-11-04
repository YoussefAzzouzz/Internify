🤖 AI Chat System (Flask)
🚀 Overview

AI Chat System is a Flask-based web application that integrates multiple AI models to enhance online communication and user engagement.
It combines message toxicity detection, AI-powered suggestions, and friend recommendations in one unified system.

Each module uses a different AI model suited for its task — from Natural Language Processing to Recommendation Learning — making this system a real showcase of applied Machine Learning.

✨ Features

🧠 Toxicity Detection (SVM)

Detects and blocks inappropriate or toxic messages in real time.

Trained on the Jigsaw Toxic Comment dataset from Kaggle.

Uses TF-IDF vectorization and a Support Vector Machine (SVM) classifier.

💬 Message Suggestion (Gemini)

Suggests responses or improvements to user messages using Google Gemini API.

Can process text, images, and PDF inputs for contextual suggestions.

Helps users rephrase or enrich their messages intelligently.

🤝 Friend Recommendation (XGBoost)

Recommends top 3 potential friends based on engagement scores.

Trained on the Twitter Friends dataset from Kaggle.

Features include number of mutual friends, last activity time, and interaction ratios.

🛠️ Setup
Requirements

Python 3.10+

Flask

scikit-learn

xgboost

google-generativeai (Gemini)

pandas / numpy

joblib

Installation
pip install -r requirements.txt

📚 Usage
🧠 Toxicity Detection

Send a POST request with a message to /predict/toxicity:

{ "message": "I hate you so much!" }


Response:

{ "prediction": "toxic", "raw": 1 }

💬 Message Suggestion

Send a POST request with text (or image/PDF) to /suggest_replies:

{ "messageType": "TEXT", "content":"Hi, how are you ?" }


Response:

{ "replies": [ "- Hey! I'm doing well, thanks for asking. How about you?",
               "- Hi! I'm good, how are you doing today?",
               "- Hey there! I'm alright, thanks. What's up with you?" ] }

🤝 Friend Recommendation

Send a GET request to /predict/recommendation:

[ { "days_since_last_seen": 3,
    "friendsCount": 4,
    "id": 1 },
  { "days_since_last_seen": 2,
    "friendsCount": 2,
    "id": 2 },
  { "days_since_last_seen": 100,
    "friendsCount": 1,
    "id": 3 } ]

    
Response:

[ { "id": 1,
    "recommended": true },
  { "id": 2,
    "recommended": false },
  { "id": 3,
    "recommended": false } ]

⚡ Example Workflow

A user sends a message → it’s first analyzed for toxicity (SVM).

If appropriate, Gemini suggests responses or rephrasing.

The system updates engagement metrics and recommends friends (XGBoost).

All predictions are sent back through Flask REST endpoints to the Angular front-end.

🧩 Architecture

Backend: Flask (Python)

Frontend: Angular (Message & profile display)

Models: SVM, Gemini, XGBoost

Datasets: Jigsaw Toxic Comment, Twitter Friends

Storage: Pickled models & CSV datasets

💡 Notes

Toxicity module accepts text only.

Suggestion module accepts text, image, or PDF inputs.

Recommendation module uses user data (friends count, last login, activity).

All endpoints are exposed via a single Flask API for integration with the front-end.

🧭 Future Improvements

Add sentiment score visualization for detected messages.

Integrate a local fallback model for Gemini API.

Enhance friend recommendations using neural embeddings.

Deploy all modules as microservices under Docker.

🏁 Conclusion

This project demonstrates how multiple AI models can collaborate to create a smart, interactive communication system.
From message moderation to intelligent suggestions and personalized recommendations, it reflects a complete AI pipeline — built and deployed in Flask.
