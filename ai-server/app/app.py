from flask import Flask, request, jsonify, url_for
from flask_cors import CORS
from model.predict import predict_food_image_min_weight
import torch
import torchvision.transforms as transforms
import pandas as pd
import os
from torchvision.models import resnet18
from werkzeug.utils import secure_filename
import uuid

# Flask 앱 생성
app = Flask(__name__, static_url_path="/static")
CORS(app)

# ─────────────────────────────
# ✅ 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # ai-server/app/
MODEL_DIR = os.path.join(BASE_DIR, "model")
FOOD101_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "food101"))
IMAGE_DIR = os.path.join(FOOD101_DIR, "images")
META_DIR = os.path.join(FOOD101_DIR, "meta")
UPLOAD_DIR = os.path.join(BASE_DIR, "static", "uploads")  # 이미지 저장 폴더
os.makedirs(UPLOAD_DIR, exist_ok=True)  # 폴더 없으면 생성
# ─────────────────────────────

# 디바이스 설정
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 클래스 매핑
classes = sorted(os.listdir(IMAGE_DIR))
class_to_idx = {cls: i for i, cls in enumerate(classes)}
idx_to_class = {i: cls for cls, i in class_to_idx.items()}

# 이미지 전처리
transform = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5] * 3, std=[0.5] * 3),
    ]
)

# 모델 로딩
model_path = os.path.join(MODEL_DIR, "food101_resnet18.pt")
model = resnet18(weights=None, num_classes=101)
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)

# 영양소 CSV 로딩
nutrition_path = os.path.join(META_DIR, "food101_min_weight_summary_sorted_nocase.csv")
nutrition_df = pd.read_csv(nutrition_path)

# ✅ label 전처리
nutrition_df["label"] = (
    nutrition_df["label"].astype(str).str.strip().str.lower().str.replace(" ", "_")
)


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "이미지 파일이 필요합니다"}), 400

    image = request.files["image"]

    # ✅ 고유 파일명 생성
    ext = os.path.splitext(image.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(UPLOAD_DIR, secure_filename(unique_filename))
    image.save(save_path)

    try:
        # 예측 수행
        result = predict_food_image_min_weight(
            image_path=save_path,
            model=model,
            nutrition_df=nutrition_df,
            inference_transform=transform,
            idx_to_class=idx_to_class,
            device=device,
        )

        if "error" in result:
            return jsonify(result), 404

        # ✅ 결과에 imageUrl 포함
        result["imageUrl"] = url_for(
            "static", filename=f"uploads/{unique_filename}", _external=True
        )

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 실행
if __name__ == "__main__":
    app.run(port=5000, debug=True)
