from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
import io
import os
import uuid

app = Flask(__name__)

# Load your YOLO model once
model = YOLO("best.pt")

# Create folder to save detected images
os.makedirs("ai_outputs", exist_ok=True)


@app.route("/predict-image", methods=["POST"])
def predict_image():
    try:
        if "image" not in request.files:
            return jsonify({"success": False, "error": "No image provided"}), 400

        image_file = request.files["image"]

        # Load image from POST body
        img_bytes = image_file.read()
        img = Image.open(io.BytesIO(img_bytes))

        # Run YOLO prediction
        results = model(img)
        res = results[0]

        # Create unique file name
        output_id = str(uuid.uuid4())
        output_path = f"ai_outputs/{output_id}_detected.jpg"

        # Save the detected image
        res.save(filename=output_path)

        # Extract prediction data
        detections = []
        for box in res.boxes:
            xyxy = box.xyxy[0].tolist()       # [x1, y1, x2, y2]
            conf = float(box.conf[0])         # confidence
            cls = int(box.cls[0])             # class ID

            detections.append({
                "bbox": xyxy,
                "confidence": conf,
                "class_id": cls
            })

        return jsonify({
            "success": True,
            "detections": detections,
            "output_image": output_path
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
