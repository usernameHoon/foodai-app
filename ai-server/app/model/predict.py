import torch
import torch.nn.functional as F
from PIL import Image


def predict_food_image_min_weight(
    image_path, model, nutrition_df, inference_transform, idx_to_class, device
):
    model.eval()
    img = Image.open(image_path).convert("RGB")
    input_tensor = inference_transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(input_tensor)
        probs = F.softmax(outputs, dim=1)
        pred_idx = torch.argmax(probs, dim=1).item()
        label = idx_to_class[pred_idx]

    # 소문자 변환 후 일치 항목 찾기
    subset = nutrition_df[nutrition_df["label"] == label.lower()]

    if subset.empty:
        print(f"⚠️ '{label}'에 대한 영양 정보가 없습니다.")
        return {"label": label, "error": f"No nutrition info found for '{label}'"}

    min_row = subset.loc[subset["weight"].idxmin()]

    print(
        f"\n🍽️ 예측 음식: {label.replace('_', ' ').title()} (최소 {min_row['weight']}g 기준)"
    )
    print(f"🔥 칼로리: {min_row['calories']} kcal")
    print(f"🍞 탄수화물: {min_row['carbohydrates']}g")
    print(f"🧀 단백질: {min_row['protein']}g")
    print(f"🧈 지방: {min_row['fats']}g")
    print(f"🍬 당류: {min_row['sugars']}g")
    print(f"🧂 나트륨: {min_row['sodium']}mg")

    return {
        "label": label,
        "calories": float(min_row["calories"]),
        "carbohydrates": float(min_row["carbohydrates"]),
        "protein": float(min_row["protein"]),
        "fats": float(min_row["fats"]),
        "sugars": float(min_row["sugars"]),
        "sodium": float(min_row["sodium"]),
        "weight": int(min_row["weight"]),
    }
