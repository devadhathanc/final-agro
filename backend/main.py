from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from datetime import datetime
import numpy as np
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load crop classifier
crop_model = tf.keras.models.load_model("./models/allcrop.keras")
crop_class_names = ['Corn', 'Cotton', 'Potato', 'Rice', 'Sugarcane', 'Tomato', 'Wheat']

# Disease models and class names (updated paths)
disease_model_map = {
    "Corn": (
        "./models/corn.keras",
        ['Blight', 'Common Rust', 'Gray Leaf Spot', 'Healthy']
    ),
    "Cotton": (
        "./models/cotton.keras",
        ['cotton_diseased_leaf', 'cotton_diseased_plant', 'cotton_fresh_leaf', 'cotton_fresh_plant']
    ),
    "Potato": (
        "./models/potato.keras",
        ['Potato_Early_blight', 'Potato_Late_blight', 'Potato_healthy']
    ),
    "Rice": (
        "./models/rice.keras",
        ['Rice_Bacterial_Leaf_Blight', 'Rice_Brown_Spot', 'Rice_Healthy_Rice_Leaf',
         'Rice_Leaf_Blast', 'Rice_Leaf_scald', 'Rice_Sheath_Blight']
    ),
    "Sugarcane": (
        "./models/sugarcane.keras",
        ['sugarcane_Healthy', 'sugarcane_Mosaic', 'sugarcane_RedRot', 'sugarcane_Rust', 'sugarcane_Yellow']
    ),
    "Tomato": (
        "./models/tomato.keras",
        ['tomato_Bacterial_spot', 'tomato_Early_blight', 'tomato_Late_blight', 'tomato_Leaf_Mold',
         'tomato_Septoria_leaf_spot', 'tomato_Spider_mites Two-spotted_spider_mite', 'tomato_Target_Spot',
         'tomato_Yellow_Leaf_Curl_Virus', 'tomato_healthy', 'tomato_mosaic_virus', 'tomato_powdery_mildew']
    ),
    "Wheat": (
        "./models/wheat.keras",
        ['wheat_Healthy', 'wheat_septoria', 'wheat_stripe_rust']
    )
}

def preprocess_image(image_bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    return img_array

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    contents = await file.read()
    input_tensor = preprocess_image(contents)

    # Step 1: Predict crop
    crop_preds = crop_model.predict(input_tensor)
    crop_idx = int(np.argmax(crop_preds))
    crop_name = crop_class_names[crop_idx]
    crop_confidence = float(np.max(crop_preds))

    # Step 2: Load disease model for the predicted crop
    if crop_name not in disease_model_map:
        raise HTTPException(status_code=404, detail=f"No disease model found for crop '{crop_name}'.")

    model_path, disease_class_names = disease_model_map[crop_name]
    disease_model = tf.keras.models.load_model(model_path)

    # Step 3: Predict disease
    disease_preds = disease_model.predict(input_tensor)[0]
    disease_idx = int(np.argmax(disease_preds))
    disease_name = disease_class_names[disease_idx]
    disease_confidence = float(disease_preds[disease_idx])

    response = {
        "crop": crop_name,
        "disease": disease_name
    }

    # Sample hardcoded info for Corn diseases
    corn_disease_info = {
        "Common Rust": {
            "remedy": "Use fungicides like azoxystrobin or propiconazole.",
            "identification": "Reddish-brown pustules on leaves arranged in rows.",
            "preventiveMeasures": [
                "Use resistant corn varieties.",
                "Rotate crops to reduce spore buildup.",
                "Avoid overhead irrigation."
            ],
            "Ref_images": {
                "healthy": "/src/images/corn_healthy.jpg",
                "early": "/src/images/rust_early.jpg",
                "moderate": "/src/images/corn_rust2.jpg",
                "severe": "/src/images/rust_severe.png"
            }
        }
    }
        # ...after getting disease_name...
    info = {}
    if crop_name == "Corn" and disease_name in corn_disease_info:
        info = corn_disease_info[disease_name]

    return {
        "crop": crop_name,
        "disease": disease_name,
        "remedy": info.get("remedy", ""),
        "identification": info.get("identification", ""),
        "preventiveMeasures": info.get("preventiveMeasures", []),
        "Ref_images": info.get("Ref_images", {}),
        "timestamp": str(datetime.utcnow()),  # Add timestamp
        "confidence": disease_confidence
    }


@app.get("/")
def root():
    return {"message": "Crop Disease Classifier API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)