# GitHub Pages 배포 가이드

이 문서는 테트리스 게임을 GitHub Pages를 통해 무료로 배포하는 방법을 안내합니다.

## 📋 목차
1. [준비사항](#준비사항)
2. [저장소 생성 및 코드 업로드](#저장소-생성-및-코드-업로드)
3. [GitHub Pages 활성화](#github-pages-활성화)
4. [배포 확인](#배포-확인)
5. [문제 해결](#문제-해결)
6. [커스텀 도메인 설정 (선택사항)](#커스텀-도메인-설정-선택사항)

---

## 준비사항

### 필요한 것
- GitHub 계정 ([github.com](https://github.com)에서 무료 가입)
- Git 설치 (로컬에서 작업할 경우)
- 테트리스 게임 파일들

### 파일 구조 확인
배포할 파일들이 다음과 같이 구성되어 있는지 확인하세요:

```
tetris/
├── index.html       # 랜딩 페이지 (필수)
├── game.html        # 게임 페이지
├── landing.css      # 랜딩 페이지 스타일
├── style.css        # 게임 페이지 스타일
├── game.js          # 게임 로직
├── music.js         # 배경음악
└── README.md        # 선택사항
```

---

## 저장소 생성 및 코드 업로드

### 방법 1: GitHub 웹 인터페이스 사용 (초보자 추천)

1. **GitHub에 로그인**
   - [github.com](https://github.com)에 접속하여 로그인

2. **새 저장소 생성**
   - 우측 상단의 `+` 버튼 클릭 → `New repository` 선택
   - Repository name: `tetris-game` (원하는 이름 입력)
   - Public 선택 (Private은 GitHub Pages 무료 사용 불가)
   - `Add a README file` 체크 (선택사항)
   - `Create repository` 클릭

3. **파일 업로드**
   - 생성된 저장소 페이지에서 `Add file` → `Upload files` 클릭
   - 테트리스 게임 파일들을 드래그 앤 드롭
   - 하단에 커밋 메시지 입력 (예: "Add Tetris game files")
   - `Commit changes` 클릭

### 방법 2: Git CLI 사용 (개발자 추천)

```bash
# 1. 저장소 초기화
cd /path/to/tetris
git init

# 2. 파일 추가
git add .

# 3. 첫 커밋
git commit -m "Initial commit: Add Tetris game"

# 4. GitHub 저장소 연결 (저장소 URL은 GitHub에서 확인)
git remote add origin https://github.com/YOUR_USERNAME/tetris-game.git

# 5. 메인 브랜치로 이름 변경 (필요시)
git branch -M main

# 6. 푸시
git push -u origin main
```

---

## GitHub Pages 활성화

1. **저장소 설정 페이지로 이동**
   - GitHub 저장소 페이지에서 `Settings` 탭 클릭

2. **Pages 메뉴 선택**
   - 왼쪽 사이드바에서 `Pages` 클릭

3. **소스 설정**
   - **Source** 섹션에서:
     - Branch: `main` (또는 `master`) 선택
     - Folder: `/ (root)` 선택
   - `Save` 버튼 클릭

4. **배포 대기**
   - GitHub가 자동으로 사이트를 빌드하고 배포합니다
   - 보통 1-2분 소요됩니다
   - 페이지 상단에 배포된 URL이 표시됩니다
   - 예: `https://YOUR_USERNAME.github.io/tetris-game/`

---

## 배포 확인

### 배포 완료 확인

1. **Actions 탭 확인**
   - 저장소의 `Actions` 탭에서 배포 진행 상황 확인
   - 초록색 체크마크가 표시되면 배포 완료

2. **사이트 접속**
   - `Settings` → `Pages`에 표시된 URL 클릭
   - 또는 직접 `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/` 접속

3. **게임 테스트**
   - 랜딩 페이지가 정상적으로 표시되는지 확인
   - "게임 시작하기" 버튼 클릭하여 게임 페이지로 이동
   - 게임이 정상적으로 작동하는지 테스트
   - 배경음악이 재생되는지 확인

---

## 문제 해결

### 404 오류가 발생하는 경우

**원인:** index.html 파일이 루트 디렉토리에 없거나 Pages가 제대로 활성화되지 않음

**해결방법:**
1. 저장소 루트에 `index.html` 파일이 있는지 확인
2. `Settings` → `Pages`에서 올바른 브랜치와 폴더가 선택되었는지 확인
3. 몇 분 기다린 후 다시 시도 (배포에 시간이 걸림)

### 파일이 업데이트되지 않는 경우

**원인:** 브라우저 캐시 또는 배포 지연

**해결방법:**
1. 브라우저 캐시 삭제 (Ctrl + Shift + R 또는 Cmd + Shift + R)
2. 시크릿 모드로 접속
3. `Actions` 탭에서 배포가 완료되었는지 확인
4. 5-10분 정도 기다린 후 다시 확인

### 배경음악이 재생되지 않는 경우

**원인:** 브라우저의 자동재생 정책

**해결방법:**
- 이것은 정상적인 동작입니다
- 사용자가 페이지를 클릭하면 음악이 재생됩니다
- music.js에서 이미 처리되어 있습니다

### CSS/JS 파일이 로드되지 않는 경우

**원인:** 상대 경로 문제

**해결방법:**
1. HTML 파일에서 파일 경로가 상대 경로로 설정되어 있는지 확인
   ```html
   <!-- 올바른 예 -->
   <link rel="stylesheet" href="style.css">
   <script src="game.js" defer></script>
   
   <!-- 잘못된 예 -->
   <link rel="stylesheet" href="/style.css">
   ```

2. 모든 파일이 같은 디렉토리에 있는지 확인

---

## 커스텀 도메인 설정 (선택사항)

자신만의 도메인(예: tetris.yourdomain.com)을 사용하려면:

### 1. 도메인 구매
- Namecheap, GoDaddy, Cloudflare 등에서 도메인 구매

### 2. DNS 설정
도메인 제공업체의 DNS 설정에서 다음을 추가:

```
Type: CNAME
Name: tetris (또는 원하는 서브도메인)
Value: YOUR_USERNAME.github.io
```

### 3. GitHub Pages 설정
1. `Settings` → `Pages`로 이동
2. `Custom domain` 섹션에 도메인 입력 (예: tetris.yourdomain.com)
3. `Save` 클릭
4. `Enforce HTTPS` 체크 (권장)

### 4. 확인
- DNS 전파에 24-48시간 소요될 수 있음
- 설정 후 커스텀 도메인으로 접속 가능

---

## 업데이트 방법

### 웹 인터페이스 사용

1. GitHub 저장소 페이지에서 수정할 파일 클릭
2. 연필 아이콘 (Edit) 클릭
3. 수정 후 `Commit changes` 클릭
4. 1-2분 후 자동으로 재배포됨

### Git CLI 사용

```bash
# 1. 파일 수정 후 변경사항 확인
git status

# 2. 변경사항 추가
git add .

# 3. 커밋
git commit -m "Update game features"

# 4. 푸시
git push origin main

# 5. 1-2분 후 자동으로 재배포됨
```

---

## 배포 URL 예시

- **기본 URL:** `https://YOUR_USERNAME.github.io/tetris-game/`
- **사용자명이 `taqz915`이고 저장소명이 `tetris-game`인 경우:**
  - `https://taqz915.github.io/tetris-game/`

---

## 추가 팁

### README.md 추가
저장소에 README.md 파일을 추가하면 프로젝트 설명을 보여줄 수 있습니다:

```markdown
# 테트리스 게임

클래식 테트리스 게임을 HTML5, CSS3, JavaScript로 구현했습니다.

## 🎮 플레이하기
[여기를 클릭하여 게임 플레이](https://YOUR_USERNAME.github.io/tetris-game/)

## 🎯 기능
- 배경음악 (Korobeiniki)
- 시간 기반 레벨 시스템
- 다음 블록 미리보기
- 반응형 디자인

## 🕹️ 조작법
- ← → : 좌우 이동
- ↑ : 회전
- ↓ : 빠른 낙하
- 스페이스바 : 즉시 낙하
```

### .gitignore 추가
불필요한 파일을 제외하려면 `.gitignore` 파일 생성:

```
.DS_Store
node_modules/
*.log
.vscode/
```

### GitHub Actions 자동화
더 복잡한 빌드 프로세스가 필요한 경우 GitHub Actions를 사용할 수 있습니다.
하지만 이 테트리스 게임은 순수 HTML/CSS/JS이므로 필요하지 않습니다.

---

## 📚 참고 자료

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Git 기초 가이드](https://git-scm.com/book/ko/v2)
- [Markdown 작성법](https://www.markdownguide.org/)

---

## 🎉 배포 완료!

축하합니다! 이제 전 세계 누구나 당신의 테트리스 게임을 플레이할 수 있습니다.

배포된 링크를 친구들과 공유해보세요! 🚀
