import requests

# Flask 서버 주소
url = "http://localhost:5000/predict"

# 예측할 이미지 경로 (Flask가 실행된 폴더 기준 상대경로 또는 절대경로 가능)
image_path = "6676.jpg"  # ← 여기 원하는 이미지 경로로 바꾸세요

# 이미지 파일 열기
with open(image_path, "rb") as f:
    files = {"image": f}
    response = requests.post(url, files=files)

# 결과 출력
print("응답 코드:", response.status_code)
try:
    print("예측 결과:", response.json())
except Exception as e:
    print("JSON 파싱 실패:", e)
    print("응답 텍스트:", response.text)
