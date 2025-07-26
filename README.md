# 🌾 AgroIndia - Smart Crop Disease Detection and Monitoring System

AgroIndia is an AI-powered web platform designed to help farmers and agricultural researchers detect crop diseases from images, and get expert-level recommendations, remedies, and preventive advice instantly. The system uses deep learning models to classify crop types and diseases, and supports multilingual interaction, chat guidance, and smart disease tracking.

---

## ✨ Features

✅ AI-based crop and disease detection using CNN models
✅ Crop-specific disease classifiers for high accuracy
✅ Image-based remedies, identification, and prevention guidelines
✅ Reference images of healthy and infected crops (early, moderate, severe)
✅ 🔍 Monitoring page with AI-based recommendations
✅ 💬 Chat Assistant for user-friendly interaction
✅ 🌐 Multi-language support: English, Tamil, Hindi, Bengali

---

## 🧠 Machine Learning Overview

* **Crop Classifier**
  `allcrop.keras` – identifies the crop type from the uploaded image.

* **Disease Classifiers**
  Trained models for each crop:

  * `corn.keras`
  * `tomato.keras`
  * `rice.keras`
  * `wheat.keras`
  * `sugarcane.keras`
  * `cotton.keras`
  * `potato.keras`

Each model is trained on labeled disease datasets, achieving high accuracy and confidence.

---

## 📁 Project Structure

```
AgroIndia/
├── backend/
│   ├── main.py              # FastAPI backend logic
│   └── models/              # Trained .keras models
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Upload, Result, Monitor
│   │   ├── images/          # Healthy, early, moderate, severe reference images
│   │   ├── contexts/        # Language and chat context
│   │   ├── types.ts         # Type definitions
│   │   └── ...
│   └── public/
│
├── requirements.txt
└── README.md
```

---

## 🛠️ Setup Instructions

### 🔹 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

🔗 Runs on: [http://localhost:8000](http://localhost:8000)

---

### 🔹 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

🔗 Runs on: [http://localhost:5173](http://localhost:5173)

---

## 📸 Example API Response

**Endpoint:** `POST /predict`

**Returns:**

```json
{
  "crop": "Corn",
  "disease": "Common Rust",
  "remedy": "Use fungicides like azoxystrobin...",
  "identification": "Reddish-brown pustules...",
  "preventiveMeasures": [
    "Use resistant varieties",
    "Rotate crops",
    "Avoid overhead irrigation"
  ],
  "Ref_images": {
    "healthy": "/src/images/corn_healthy.jpg",
    "early": "/src/images/rust_early.jpg",
    "moderate": "/src/images/corn_rust2.jpg",
    "severe": "/src/images/rust_severe.png"
  },
  "timestamp": "2025-07-26T12:30:00Z"
}
```

---

## 📊 Monitoring Page

* Shows history of detected diseases
* Displays crop location, disease, date, and reference image
* 🔮 **AI Recommendation Engine**:

  * Suggests preventive measures
  * Tracks recurring diseases
  * Assists in seasonal forecasting

---

## 💬 Chat Assistant

* Supports **4 languages**: English, Tamil, Hindi, Bengali
* Provides guidance on:

  * Disease prev
