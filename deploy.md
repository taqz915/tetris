# 테트리스 실행 방법

이 테트리스 게임은 순수 HTML, CSS, JavaScript로 작성된 정적 웹 애플리케이션입니다. 별도의 빌드나 설치 과정 없이 바로 실행할 수 있습니다.

## 방법 1: 브라우저에서 직접 열기 (가장 간단)

1. 파일 탐색기에서 `index.html` 파일을 찾습니다
2. `index.html` 파일을 더블클릭하거나 우클릭 → "연결 프로그램" → 웹 브라우저 선택
3. 게임이 자동으로 시작됩니다

**지원 브라우저:**
- Chrome
- Firefox
- Safari
- Edge
- 기타 모던 브라우저

## 방법 2: 로컬 웹 서버 실행 (권장)

로컬 웹 서버를 사용하면 보다 안정적인 실행 환경을 제공합니다.

### Python 3 사용

```bash
# 현재 디렉토리에서 실행
python3 -m http.server 8000
```

그 다음 브라우저에서 접속:
```
http://localhost:8000
```

### Node.js 사용 (http-server)

```bash
# http-server 설치 (한 번만)
npm install -g http-server

# 서버 실행
http-server -p 8000
```

그 다음 브라우저에서 접속:
```
http://localhost:8000
```

### PHP 사용

```bash
php -S localhost:8000
```

그 다음 브라우저에서 접속:
```
http://localhost:8000
```

## 방법 3: VS Code Live Server 확장 사용

1. VS Code에서 "Live Server" 확장 설치
2. `index.html` 파일을 열고 우클릭
3. "Open with Live Server" 선택
4. 자동으로 브라우저가 열립니다

## 파일 구조

```
tetris/
├── index.html   # 메인 HTML 파일
├── style.css    # 스타일시트
├── game.js      # 게임 로직
├── plan.md      # 구현 계획
└── deploy.md    # 이 파일
```

## 게임 조작법

- **←** (왼쪽 화살표): 블록을 왼쪽으로 이동
- **→** (오른쪽 화살표): 블록을 오른쪽으로 이동
- **↑** (위 화살표): 블록 회전
- **↓** (아래 화살표): 블록 빠른 낙하

## 온라인 배포

### GitHub Pages

1. GitHub 저장소에 코드 푸시
2. Settings → Pages → Source를 "main branch" 선택
3. 자동으로 배포되는 URL 확인

### Netlify Drop

1. [https://app.netlify.com/drop](https://app.netlify.com/drop) 접속
2. tetris 폴더를 드래그 앤 드롭
3. 즉시 배포되는 URL 확인

### Vercel

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

## 문제 해결

### 게임이 로드되지 않을 경우

1. 브라우저 콘솔(F12)을 열어 오류 확인
2. `game.js`와 `style.css` 파일 경로가 올바른지 확인
3. 최신 브라우저를 사용하고 있는지 확인

### 파일 경로 오류

모든 파일(`index.html`, `style.css`, `game.js`)이 같은 디렉토리에 있어야 합니다.

## 요구사항

- 최소 요구사항: HTML5, CSS3, ES6를 지원하는 모던 브라우저
- 외부 라이브러리 없음
- 인터넷 연결 불필요 (오프라인 실행 가능)
