<img width="1102" height="738" alt="image" src="https://github.com/user-attachments/assets/5b6f0f6b-3dd0-4022-b923-a781104da7f1" /> <img width="1065" height="716" alt="image" src="https://github.com/user-attachments/assets/2889b865-17aa-4970-a239-c0155f3430e3" />


# MR 제거 가사 사이트 - 프론트엔드

## 🔍 소개  
**MR 제거 가사 사이트**는 사용자가 업로드한 음원에서 MR(반주)을 제거하고, 가사를 제공하는 웹 서비스입니다. 커버곡 크리에이터, 싱어송라이터 지망생, 그리고 취미 음악가들을 위해 개발된 이 프로젝트는 AI 모델을 활용한 실시간 음원 처리 경험을 제공하며, 실무형 기술 학습을 목표로 하고 있습니다.

## 📅 프로젝트 개요  
- **개발 기간**: 2025/07/14 ~ 2025/07/21  
- **대상 사용자**: 20~30대 취미 음악가, 비전공자  
- **선정 이유**:  
  - 음원 분리 모델 적용 및 데이터 가공 경험  
  - 향후 가사 생성 기능 등 확장 가능성  
  - AI 기반 실무 개발 프로세스 습득  

## 🎯 프로젝트 목표  
1. **AI 모델 활용 능력 향상**
   - 데이터 전처리 및 모델 입력 구조 학습  
   - 예측 결과 가공 및 후처리 구현  
   - 사용자에게 결과 전달까지 전체 파이프라인 구현  

2. **서버 분리 아키텍처 학습**
   - Web Server(Spring Boot)와 API Server(FastAPI) 분리 개발  
   - 효율적인 서버 유지보수 및 배포 전략 이해  

---

## ⚙️ 기술 스택  

### 프론트엔드  
- **Framework**: Next.js 15.2.4  
- **Language**: TypeScript  
- **UI Library**: Radix UI, Tailwind CSS  
- **상태 관리**: React Hook Form  
- **API 통신**: Axios  

### 백엔드 (연동용)  
- **Web Server**: Java Spring Boot  
- **API Server**: Python, FastAPI, PyTorch  
- **개발 도구**: Cursor, IntelliJ IDEA  

---

## 🧑‍🎤 주요 기능  
- 음원 파일 업로드 및 MR(반주) 제거  
- 실시간 처리 상태 표시  
- 처리된 음원 및 가사 파일 관리  
- 반응형 UI 및 사용자 친화적인 UX  

---

## 📁 프로젝트 구조  
hankook_front-main/
├── app/ # 페이지 및 라우팅
├── components/ # 재사용 가능한 UI 컴포넌트
├── hooks/ # 커스텀 React 훅
├── lib/ # 유틸리티 함수 및 설정
├── public/ # 정적 파일
└── styles/ # 전역 스타일


---

## 🚀 시작하기  

### 필수 조건  
- Node.js  
- pnpm 또는 npm  

### 설치  
```bash
# 의존성 설치
pnpm install
# 또는
npm install


## 개발 서버 실행

-복사
-편집
pnpm dev
# 또는
npm run dev
-기본 포트: http://localhost:3000

##프로덕션 빌드

-복사
-편집
pnpm build
# 또는
npm run build

🔗 백엔드 연동 방식
Spring Boot: 정적 파일 관리 및 클라이언트 제공

FastAPI: 모델 호출 및 음원 처리 API 제공

빌드 후 정적 파일은 자동으로 백엔드 static 디렉토리로 복사됨

🧑‍💻 페르소나
-커버곡 크리에이터

-싱어송라이터 지망생

-비전공 취미 음악인

📄 라이선스
Private (비공개 저장소)


