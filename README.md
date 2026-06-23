# FitMate 🏋️

> **나만의 인생 트레이너를 만나보세요**
>
> 피트니스 트레이너와 회원을 스마트하게 연결하는 매칭 플랫폼

[![Service](https://img.shields.io/badge/Service-fitmate--ten.vercel.app-0057CD?style=flat-square&logo=vercel)](https://fitmate-ten.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%204.0.6-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Java](https://img.shields.io/badge/Java-25-ED8B00?style=flat-square&logo=openjdk)](https://openjdk.org)

---

## 목차

- [프로젝트 소개](#-프로젝트-소개)
- [팀 소개](#-팀-소개)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [주요 기능](#-주요-기능)
- [프로젝트 구조](#-프로젝트-구조)
- [환경 설정 및 실행](#-환경-설정-및-실행)
- [API 문서](#-api-문서)
- [트러블슈팅](#-트러블슈팅)

---

## 🏃 프로젝트 소개

헬스장은 많지만 **나에게 맞는 트레이너**를 찾기 어려운 문제에서 출발했습니다.

FitMate는 회원이 자신의 운동 목표·성향·예산을 입력하면 AI가 최적의 트레이너를 추천해주는 **트레이너-회원 매칭 플랫폼**입니다. 소셜 로그인, 실시간 채팅, 리뷰 시스템을 통해 신뢰도 높은 매칭 경험을 제공합니다.

| 항목 | 내용 |
|------|------|
| 개발 기간 | 2026년 6월 11일 ~ 6월 24일 (AIBE6 2nd Project) |
| 서비스 URL | https://fitmate-ten.vercel.app |
| API 문서 | `https://fitmate-team4.duckdns.org/swagger-ui/index.html` |

---

## 👥 팀 소개

**팀명: 스프링글스 (Team 4, AIBE6)**

---

## 🛠 기술 스택

### Backend

| 분류 | 기술 |
|------|------|
| Language | Java 25 |
| Framework | Spring Boot 4.0.6 |
| ORM | Spring Data JPA |
| Security | Spring Security + JWT (jjwt 0.12.6) |
| Auth | Spring Security OAuth2 Client (Kakao, Google) |
| WebSocket | Spring WebSocket + STOMP |
| Database | MySQL (prod), H2 (dev) |
| SMS | Coolsms SDK (net.nurigo 4.3.0) |
| AI | Gemini API (gemini-3.1-flash-lite-preview) |
| API Docs | SpringDoc OpenAPI 3.0.2 (Swagger UI) |
| Build | Gradle Kotlin DSL |

### Frontend

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| WebSocket | @stomp/stompjs + sockjs-client |
| HTTP Client | openapi-fetch |
| Payment | Toss Payments SDK |
| Linting | ESLint + Prettier |

### Infrastructure

| 분류 | 기술 |
|------|------|
| Backend 배포 | AWS EC2 |
| Frontend 배포 | Vercel |
| Database | MySQL |

---

## 🏗 시스템 아키텍처

```
[사용자 (Browser)]
        │
        ▼
[Frontend - Next.js / Vercel]
        │  REST API (HTTPS)
        ▼
[Backend - Spring Boot / AWS EC2]
        │  JPA / SQL
        ▼
[Database - MySQL]

──────────────────────────────────────
소셜 로그인 / 인증 흐름
──────────────────────────────────────
사용자 ──▶ Kakao / Google OAuth2 서버
         ──▶ 인가 코드 ──▶ Backend
         ──▶ AccessToken 교환 ──▶ 사용자 정보 파싱
         ──▶ JWT 발급 ──▶ HttpOnly 쿠키 저장
         ──▶ Frontend 리다이렉트
```

---

## ✨ 주요 기능

### 1. 소셜 로그인 (카카오 / 구글)

- Spring Security OAuth2 Client 기반 인가 코드 플로우 구현
- 로그인 성공 시 JWT를 HttpOnly 쿠키에 저장 (XSS 방어)
- 최초 로그인 시 이메일·닉네임 자동 수집 및 회원가입 처리
- 동일 이메일 소셜 계정 연동 지원

### 2. SMS 인증 회원가입

- Coolsms API를 통한 6자리 OTP 발송 (5분 유효)
- 가입 시 **트레이너 / 회원** 역할(ROLE) 선택
- 휴대폰 번호 UNIQUE 제약으로 중복 가입 차단
- BCrypt 비밀번호 암호화

### 3. AI 매칭

- Gemini API 기반 트레이너 추천
- 운동 목표 (다이어트 / 근력 / 재활 / 체형 교정 등) 분석
- 지역·예산·성향 등 다중 조건 가중치 매칭
- 추천 결과에 대한 설명 텍스트 제공 (왜 이 트레이너가 추천되었는지)

### 4. 트레이너 찾기 / 필터링

- 지역(시/구/동), 전문 분야, 가격 범위, 경력 다중 필터
- JPA Specification 기반 동적 쿼리
- 별점 높은 순 / 리뷰 많은 순 / 가격 낮은 순 / 후기 많은 순 정렬

### 5. 실시간 채팅

- Spring WebSocket + STOMP 프로토콜 기반 1:1 채팅
- 매칭 완료 시 자동 채팅방 생성
- 모든 메시지 DB 영속화 (히스토리 유지)
- 미읽음 메시지 카운터

### 6. 레슨 신청 / 수강 관리

- 트레이너에게 레슨 신청 및 수락·거절 처리
- 수업 일정 관리 및 현황 조회

### 7. 결제 (Toss Payments)

- Toss Payments SDK 연동
- 결제 내역 조회 및 관리

### 8. 리뷰 / 후기

- 1~5점 별점 + 텍스트 후기 작성
- 트레이너 평균 평점 실시간 반영
- 최신순 / 평점순 정렬
- 부적절 리뷰 신고 기능

### 9. 문의 (FAQ / 1:1 문의)

- FAQ 게시판 운영
- 회원 1:1 문의 접수

### 10. 관리자 페이지

- 회원·트레이너 통합 관리 (활성화/비활성화)
- 트레이너 인증 승인·반려
- 신고 접수 및 처리
- 통계 대시보드
- ROLE_ADMIN 기반 접근 제어

---

## 📁 프로젝트 구조

```
AIBE6_SecondProject_Team4/
├── backend/
│   ├── src/main/java/com/fitmate/
│   │   ├── ai/              # AI 매칭 (Gemini API)
│   │   ├── alert/           # 알림
│   │   ├── auth/            # 인증 (JWT, OAuth2, SMS)
│   │   ├── chat/            # 실시간 채팅 (WebSocket/STOMP)
│   │   ├── global/          # 공통 설정, 예외처리, 파일 업로드
│   │   ├── inquiry/         # 문의 / FAQ
│   │   ├── lesson/          # 레슨 신청·수강 관리
│   │   ├── matching/        # 매칭
│   │   ├── member/          # 회원 (일반 회원, 관리자)
│   │   ├── payment/         # 결제
│   │   ├── review/          # 리뷰
│   │   └── trainer/         # 트레이너
│   └── src/main/resources/
│       ├── application.yml
│       ├── application-dev.yml    # H2 개발 환경
│       ├── application-prod.yml   # MySQL 운영 환경
│       ├── application-secret.yml # 민감 정보 (git 제외)
│       └── data.sql               # 초기 데이터
│
└── frontend/
    └── src/
        ├── app/
        │   ├── admin/       # 관리자 페이지
        │   ├── auth/        # 로그인 / 회원가입
        │   ├── faq/         # FAQ
        │   ├── inquiry/     # 1:1 문의
        │   ├── lesson-requests/ # 레슨 신청
        │   ├── matching/    # 매칭
        │   ├── mypage/      # 마이페이지
        │   ├── oauth2/      # 소셜 로그인 콜백
        │   ├── payment/     # 결제
        │   └── trainer/     # 트레이너 목록·상세
        ├── components/      # 공통 컴포넌트
        ├── hooks/           # 커스텀 훅
        ├── types/           # TypeScript 타입
        └── utils/           # 유틸 함수
```

---

## ⚙️ 환경 설정 및 실행

### 사전 요구사항

- Java 25+
- Node.js 20+
- MySQL 8.0+ (운영) 또는 H2 (개발)

### Backend 실행

```bash
cd backend
./gradlew bootRun
```

### Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

> 환경변수는 별도 파일로 관리됩니다. 팀원에게 문의해주세요.

---

## 📄 API 문서

백엔드 실행 후 Swagger UI에서 전체 API 명세를 확인할 수 있습니다.

```
https://fitmate-team4.duckdns.org/swagger-ui/index.html
```

### 주요 API 엔드포인트

| 도메인 | 경로 | 설명 |
|--------|------|------|
| 인증 | `POST /api/auth/signup` | 일반 회원가입 |
| 인증 | `POST /api/auth/login` | 이메일 로그인 |
| 인증 | `POST /api/auth/sms/send` | SMS OTP 발송 |
| 인증 | `POST /api/auth/sms/verify` | SMS OTP 검증 |
| 소셜 | `GET /oauth2/authorization/kakao` | 카카오 로그인 |
| 소셜 | `GET /oauth2/authorization/google` | 구글 로그인 |
| 트레이너 | `GET /api/trainers` | 트레이너 목록 (필터·정렬) |
| 트레이너 | `GET /api/trainers/{id}` | 트레이너 상세 |
| 매칭 | `POST /api/matching` | 매칭 신청 |
| 매칭 | `GET /api/matching` | 내 매칭 목록 |
| AI 매칭 | `POST /api/ai/matching` | AI 트레이너 추천 |
| 채팅 | `GET /api/chat/rooms` | 채팅방 목록 |
| 채팅 | `WS /ws/chat` | WebSocket 연결 |
| 리뷰 | `POST /api/reviews` | 리뷰 작성 |
| 리뷰 | `GET /api/reviews/trainer/{id}` | 트레이너 리뷰 목록 |
| 레슨 | `POST /api/lesson-requests` | 레슨 신청 |
| 결제 | `POST /api/payments/confirm` | 결제 승인 |
| 회원 | `GET /api/members/me` | 내 정보 조회 |
| 관리자 | `GET /api/admin/members` | 회원 목록 (ADMIN) |

---
