# 🎮 테트리스 게임 with FastAPI 백엔드

회원가입, 로그인, 점수 기록 기능이 있는 테트리스 게임입니다.

## ✨ 주요 기능

- 🔐 **사용자 인증**: 이메일/비밀번호 기반 회원가입 및 로그인
- 🎯 **점수 기록**: 게임 플레이 후 자동으로 점수 저장
- 🏆 **리더보드**: 전체 사용자 최고 점수 표시
- 🎵 **배경음악**: 테트리스 클래식 BGM
- 📱 **반응형 디자인**: PC와 모바일 모두 지원

## 🏗️ 프로젝트 구조

```
tetris/
├── main.py              # FastAPI 애플리케이션
├── database.py          # SQLite 데이터베이스 함수
├── auth.py              # 비밀번호 해싱 유틸리티
├── requirements.txt     # Python 의존성
├── tetris.db           # SQLite 데이터베이스 파일
├── static/             # 정적 파일
│   ├── game.js         # 게임 로직
│   ├── music.js        # 배경음악 제어
│   ├── style.css       # 게임 페이지 스타일
│   └── landing.css     # 랜딩 페이지 스타일
└── templates/          # HTML 템플릿
    ├── index.html      # 랜딩 페이지
    ├── auth.html       # 로그인/회원가입 페이지
    └── game.html       # 게임 페이지
```

## 🚀 실행 방법

### 1. 의존성 설치

```bash
pip install -r requirements.txt
pip install email-validator
```

### 2. 서버 실행

```bash
python3 main.py
```

또는 백그라운드에서 실행:

```bash
nohup python3 main.py > server.log 2>&1 &
```

### 3. 브라우저에서 접속

- 로그인/회원가입: http://localhost:8000/ (메인 페이지)
- 게임 설명: http://localhost:8000/home (로그인 후)
- 게임 플레이: http://localhost:8000/game (로그인 필요)
- API 문서: http://localhost:8000/docs

### 🎯 사용 흐름

1. **로그인/회원가입** (`/`) - 메인 페이지에서 로그인 또는 회원가입
2. **게임 설명** (`/home`) - 로그인 후 게임 소개 및 규칙 확인
3. **게임 플레이** (`/game`) - "게임 시작하기" 버튼 클릭하여 플레이
4. **점수 기록** - 게임 오버 시 자동으로 점수 저장 및 리더보드 업데이트

## 🎮 게임 조작법

- `← →` : 좌우 이동
- `↑` : 블록 회전
- `↓` : 빠른 낙하
- `SPACE` : 즉시 낙하

## 📊 데이터베이스 스키마

### users 테이블
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### game_scores 테이블
```sql
CREATE TABLE game_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    level INTEGER NOT NULL,
    lines_cleared INTEGER NOT NULL,
    play_duration INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

## 🔌 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### 게임 점수
- `POST /api/scores` - 점수 기록
- `GET /api/scores/top?limit=10` - 최고 점수 목록
- `GET /api/scores/my` - 내 게임 기록

### 페이지
- `GET /` - 로그인/회원가입 페이지 (메인)
- `GET /home` - 게임 설명 페이지 (로그인 후)
- `GET /game` - 게임 플레이 페이지 (로그인 필요)

## 🛠️ 기술 스택

- **Backend**: FastAPI, uvicorn
- **Database**: SQLite3
- **Authentication**: bcrypt (passlib)
- **Frontend**: Vanilla JavaScript, HTML5 Canvas
- **Styling**: CSS3 (Gradient, Flexbox, Grid)

## 📝 참고사항

- 세션은 메모리 기반으로 저장됩니다 (서버 재시작 시 초기화)
- 비밀번호는 bcrypt로 해싱되어 저장됩니다
- 로그인 세션은 7일간 유지됩니다

## 🎯 게임 규칙

- 한 줄을 완성하면 100점을 획득합니다
- 60초마다 레벨이 1씩 올라갑니다
- 레벨이 올라갈수록 블록이 더 빠르게 떨어집니다
- 블록이 화면 맨 위까지 쌓이면 게임이 종료됩니다

## 📄 라이선스

MIT License

## 👨‍💻 개발자

- 2026 Tetris Game Project
