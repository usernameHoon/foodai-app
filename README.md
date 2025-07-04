# FoodAI - 음식 이미지 기반 영양 분석 앱

## 1. 프로젝트 개요
- **프로젝트 명칭**: FoodAI
- **한 줄 소개**: 음식 사진 한 장으로 영양소와 칼로리를 분석하는 AI 앱
- **기술 스택**: React, Spring Boot, Flask (Python), MySQL, Chart.js, ResNet18 (PyTorch)

---

## 2. 개발 목적 & 배경
- 현대인은 식습관 기록을 번거로워함 → 자동화 필요
- 건강한 식단 관리를 위해 AI로 음식 인식 및 영양소 분석

---

## 3. 시스템 아키텍처
- **Frontend**: React (이미지 업로드, 결과 표시, 마이페이지)
- **Backend**: Spring Boot (DB 연동, 사용자, 기록 API)
- **AI Server**: Flask + PyTorch (이미지 → 음식명 예측)
- **Database**: MySQL (음식 DB, 기록 저장)

```
[React] → 이미지 업로드
   ↓
[Flask] → 음식 예측
   ↓
[Spring Boot] → DB 저장 & 조회
   ↓
[MySQL] → 음식 / 사용자 / 분석 결과
```

---

## 4. 주요 기능 소개
- ✅ 음식 사진 업로드 → AI로 음식명 예측 (Flask)  
- ✅ 영양소 정보 자동 조회 및 칼로리 표시 (Spring + MySQL)  
- ✅ 시각화: 영양소 정보 및 칼로리 그래프 표시  
- ✅ 분석 기록 마이페이지 조회, 삭제 기능 포함 (※ 삭제 기능은 미구현)

- ❌ 사용자별 권장 섭취량 설정 (칼로리, 탄수화물 등)  
- ❌ 부족한 영양소 기반 음식 추천 (Spring rule 기반)

---

## 5. AI 모델 구성
- **데이터셋**: Food-101 (101개 음식 클래스, 100,000+ 이미지)
- **모델**: ResNet18
- **서빙**: Flask REST API (`/api/predict`)

---

## 6. 영양소 분석 및 추천 로직
- ✅ [영앙소 분석 코드](https://github.com/usernameHoon/foodai-app/blob/main/ai-server/app/model/predict.py)
- ❌ 추천 로직 미구현

---

## 7. 영양정보 시각화 (Chart.js 사용)
- ✅ Bar Chart
- ✅ Radar Chart
- ✅ Line Chart
- ✅ Doughnut Chart
---

## 8. 사용자 마이페이지 기능
- ✅ 분석 이력 조회 및 결과 보기
- ✅ 회원탈퇴 기능
- ❌ 날짜 선택 → 특정 날짜 섭취 기록 표시
- ❌ 기록별 삭제 기능
- ❌ 권장량 설정 및 자동 비교 반영
---

## 9. 실행화면 (사용자 / 관리자)

## 10. 회고 및 개선 사항
- ✅ 전 스택 통합 경험 (React ↔ Flask ↔ Spring ↔ DB)
- ✅ CORS, 이미지 처리, 영양소 매칭 등 문제 해결 경험
- 🔄 개선 방향:
  - 다중 음식 인식 (YOLO 도입 가능)
  - OCR 기반 포장지 인식
  - ML 기반 맞춤 음식 추천

---

## 11. 향후 확장 계획
- ✅ 미구현 기능들 개발
- ✅ 모바일 앱 연동 (React Native)
- ✅ 식단 추천 알고리즘 AI 고도화
- ✅ PDF 리포트 출력 / 주간 분석 리포트 자동화

---
