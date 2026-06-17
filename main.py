from fastapi import FastAPI, HTTPException, Request, Response, Form, Cookie
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import database
import auth

app = FastAPI(title="테트리스 게임 API", description="회원가입, 로그인, 점수 기록 기능이 있는 테트리스 게임")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

database.init_db()


# ============ Pydantic 모델 ============

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ScoreRequest(BaseModel):
    score: int
    level: int
    lines_cleared: int
    play_duration: int


class UserResponse(BaseModel):
    id: int
    email: str
    created_at: str


class ScoreResponse(BaseModel):
    id: int
    user_id: int
    score: int
    level: int
    lines_cleared: int
    play_duration: int
    created_at: str


class TopScoreResponse(BaseModel):
    id: int
    user_id: int
    email: str
    score: int
    level: int
    lines_cleared: int
    play_duration: int
    created_at: str


# ============ 헬퍼 함수 ============

def get_current_user(session_id: Optional[str]) -> Optional[dict]:
    """쿠키에서 현재 사용자 가져오기"""
    if not session_id:
        return None

    user_id = database.get_session(session_id)
    if not user_id:
        return None

    return database.get_user_by_id(user_id)


# ============ 페이지 라우트 ============

@app.get("/", response_class=HTMLResponse)
async def auth_page(request: Request, session_id: Optional[str] = Cookie(None)):
    """로그인/회원가입 페이지 (메인)"""
    # 이미 로그인되어 있으면 홈으로 리다이렉트
    user = get_current_user(session_id)
    if user:
        return RedirectResponse(url="/home", status_code=302)

    return templates.TemplateResponse("auth.html", {"request": request})


@app.get("/home", response_class=HTMLResponse)
async def home_page(request: Request, session_id: Optional[str] = Cookie(None)):
    """게임 설명 페이지 (로그인 후)"""
    user = get_current_user(session_id)

    if not user:
        return RedirectResponse(url="/", status_code=302)

    return templates.TemplateResponse("index.html", {"request": request, "user": user})


@app.get("/game", response_class=HTMLResponse)
async def game_page(request: Request, session_id: Optional[str] = Cookie(None)):
    """게임 페이지 (로그인 필수)"""
    user = get_current_user(session_id)

    if not user:
        return RedirectResponse(url="/", status_code=302)

    return templates.TemplateResponse("game.html", {"request": request, "user": user})


# ============ 인증 API ============

@app.post("/api/auth/register")
async def register(data: RegisterRequest):
    """회원가입"""
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="비밀번호는 최소 6자 이상이어야 합니다")

    try:
        password_hash = auth.hash_password(data.password)
        user = database.create_user(data.email, password_hash)
        return {"message": "회원가입 성공", "email": user['email']}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/auth/login")
async def login(data: LoginRequest, response: Response):
    """로그인"""
    user = database.get_user_by_email(data.email)

    if not user or not auth.verify_password(data.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 잘못되었습니다")

    session_id = database.create_session(user['id'])
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        max_age=7 * 24 * 60 * 60,  # 7일
        samesite="lax"
    )

    return {"message": "로그인 성공", "email": user['email']}


@app.post("/api/auth/logout")
async def logout(response: Response, session_id: Optional[str] = Cookie(None)):
    """로그아웃"""
    if session_id:
        database.delete_session(session_id)

    response.delete_cookie("session_id")
    return {"message": "로그아웃 성공"}


@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(session_id: Optional[str] = Cookie(None)):
    """현재 로그인 사용자 정보"""
    user = get_current_user(session_id)

    if not user:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다")

    return user


# ============ 게임 점수 API ============

@app.post("/api/scores", response_model=ScoreResponse)
async def create_game_score(
    data: ScoreRequest,
    session_id: Optional[str] = Cookie(None)
):
    """게임 점수 기록"""
    user = get_current_user(session_id)

    if not user:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다")

    score = database.create_score(
        user_id=user['id'],
        score=data.score,
        level=data.level,
        lines_cleared=data.lines_cleared,
        play_duration=data.play_duration
    )

    return score


@app.get("/api/scores/top", response_model=List[TopScoreResponse])
async def get_top_scores(limit: int = 10):
    """전체 사용자 최고 점수"""
    scores = database.get_top_scores(limit)
    return scores


@app.get("/api/scores/my", response_model=List[ScoreResponse])
async def get_my_scores(session_id: Optional[str] = Cookie(None)):
    """내 게임 기록"""
    user = get_current_user(session_id)

    if not user:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다")

    scores = database.get_user_scores(user['id'])
    return scores


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
