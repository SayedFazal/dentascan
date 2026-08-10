from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import torch

app = Flask(__name__)
CORS(app)

# Load model
model_path = "./vit_plaque_model"

processor = ViTImageProcessor.from_pretrained(model_path)
model = ViTForImageClassification.from_pretrained(model_path)

labels = [
    "Healthy",
    "Mild_Plaque",
    "Moderate_Plaque",
    "Severe_Plaque"
]

@app.route("/predict", methods=["POST"])
def predict():

    file = request.files["image"]

    image = Image.open(file).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    predicted_class = logits.argmax(-1).item()

    result = labels[predicted_class]

    return jsonify({
        "prediction": result
    })

if __name__ == "__main__":
    app.run(debug=True)
