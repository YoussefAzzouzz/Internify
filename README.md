🤖 AI Interaction System (Flask)
🚀 Overview

AI Interaction System is a Flask-based web application that integrates multiple AI models to enhance online communication and user engagement.
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
git clone https://github.com/your-username/ai-interaction-system.git
cd ai-interaction-system
pip install -r requirements.txt

Configuration

Add your Gemini API key in an environment variable:

export GOOGLE_API_KEY="your_key_here"

📚 Usage
🧠 Toxicity Detection

Send a POST request with a message to /api/toxicity:

{ "message": "I hate you" }


Response:

{ "prediction": "inappropriate", "confidence": 0.91 }

💬 Message Suggestion

Send a POST request with text (or image/PDF) to /api/suggestion:

{ "message": "Let's meet tmr?" }


Response:

{ "suggestion": "Would you like to meet tomorrow afternoon?" }

🤝 Friend Recommendation

Send a GET request to /api/recommendations/<user_id>
Response:

{
  "user": 101,
  "recommended_friends": [230, 412, 587]
}

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
