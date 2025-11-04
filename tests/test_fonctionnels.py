import pytest
import json
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

# ---------------------- Toxicity ----------------------
def test_predict_toxicity_text_appropriate(client):
    response = client.post("/predict/toxicity", json={"message": "Hello, how are you?"})
    assert response.status_code == 200
    data = response.get_json()
    assert "prediction" in data
    assert data["prediction"] in ["toxic", "appropriate"]

def test_predict_toxicity_empty(client):
    response = client.post("/predict/toxicity", json={"message": ""})
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

# ---------------------- Recommendation ----------------------
def test_recommend_friends(client):
    users = [{"id": 1, "friendsCount": 5, "days_since_last_seen": 2}]
    response = client.post("/predict/recommendation", json=users)
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert "id" in data[0] and "recommended" in data[0]

def test_recommend_friends_invalid(client):
    response = client.post("/predict/recommendation", json={"wrong": "format"})
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

# ---------------------- Suggest Replies ----------------------
def test_suggest_replies_text(client):
    payload = {"messageType": "TEXT", "content": "Hello there!"}
    response = client.post("/suggest_replies", json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert "replies" in data
    assert len(data["replies"]) <= 3

def test_suggest_replies_missing_fields(client):
    payload = {"messageType": "TEXT"}
    response = client.post("/suggest_replies", json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

def test_suggest_replies_unsupported_type(client):
    payload = {"messageType": "VIDEO", "content": "Some video content"}
    response = client.post("/suggest_replies", json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

def test_suggest_replies_pdf_not_found(client):
    payload = {"messageType": "PDF", "content": "no_file.pdf"}
    response = client.post("/suggest_replies", json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

def test_suggest_replies_image_not_found(client):
    payload = {"messageType": "IMAGE", "content": "no_file.jpg"}
    response = client.post("/suggest_replies", json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

def test_suggest_replies_pdf_without_text(client, tmp_path):
    # Créer un PDF vide pour tester le ValueError
    from reportlab.pdfgen import canvas
    pdf_file = tmp_path / "empty.pdf"
    c = canvas.Canvas(str(pdf_file))
    c.showPage()
    c.save()

    response = client.post("/suggest_replies", json={"messageType": "PDF", "content": str(pdf_file)})
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

def test_suggest_replies_text_empty(client):
    payload = {"messageType": "TEXT", "content": ""}
    response = client.post("/suggest_replies", json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

# ---------------------- Exception coverage ----------------------
def test_predict_toxicity_exception(client, monkeypatch):
    # Forcer toxic_model.predict à lever une exception
    def fake_predict(X):
        raise Exception("Forced error")
    monkeypatch.setattr("app.toxic_model.predict", fake_predict)

    response = client.post("/predict/toxicity", json={"message": "Hello"})
    assert response.status_code == 500
    data = response.get_json()
    assert "error" in data

def test_recommend_friends_exception(client, monkeypatch):
    # Forcer recommendation_model.predict à lever une exception
    def fake_predict(X):
        raise Exception("Forced error")
    monkeypatch.setattr("app.recommendation_model", type('obj', (), {"predict": fake_predict})())

    response = client.post("/predict/recommendation", json=[{"id": 1, "friendsCount": 5, "days_since_last_seen": 2}])
    assert response.status_code == 500
    data = response.get_json()
    assert "error" in data

def test_suggest_replies_exception(client, monkeypatch, tmp_path):
    # Créer un fichier PDF temporaire pour passer le check os.path.exists
    fake_pdf = tmp_path / "fake.pdf"
    fake_pdf.write_text("dummy content")  # contenu pas important, juste pour exister

    # Forcer extract_text_from_pdf à lever une exception
    def fake_extract(file_path):
        raise Exception("Forced error")
    monkeypatch.setattr("app.extract_text_from_pdf", fake_extract)

    payload = {"messageType": "PDF", "content": str(fake_pdf)}
    response = client.post("/suggest_replies", json=payload)
    assert response.status_code == 500
    data = response.get_json()
    assert "error" in data