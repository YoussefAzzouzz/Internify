from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables cross-origin requests for local testing

# Load the trained model and scaler
kmeans = joblib.load("kmeans_model.pkl")
scaler = joblib.load("scaler.pkl")


@app.route('/predict-cluster', methods=['POST'])
def predict_cluster():
    data = request.json

    if not data or "features" not in data:
        return jsonify({"error": "Missing 'features' in request body"}), 400

    try:
        features = np.array(data["features"]).reshape(1, -1)
        features_scaled = scaler.transform(features)
        cluster = int(kmeans.predict(features_scaled)[0])
        return jsonify({"cluster": cluster})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True)
