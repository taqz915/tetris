import sqlite3
import uuid
from datetime import datetime
from typing import List, Optional, Dict

DATABASE_NAME = "tetris.db"

# 메모리 세션 저장소
sessions = {}  # {session_id: user_id}


def get_connection():
    """데이터베이스 연결 생성"""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """데이터베이스 초기화 및 테이블 생성"""
    conn = get_connection()
    cursor = conn.cursor()

    # users 테이블
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # game_scores 테이블
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS game_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            level INTEGER NOT NULL,
            lines_cleared INTEGER NOT NULL,
            play_duration INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()


# ============ 사용자 관련 함수 ============

def create_user(email: str, password_hash: str) -> Dict:
    """새 사용자 생성"""
    conn = get_connection()
    cursor = conn.cursor()

    now = datetime.now().isoformat()
    try:
        cursor.execute(
            "INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)",
            (email, password_hash, now)
        )
        user_id = cursor.lastrowid
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise ValueError("이미 존재하는 이메일입니다")
    finally:
        conn.close()

    return get_user_by_id(user_id)


def get_user_by_email(email: str) -> Optional[Dict]:
    """이메일로 사용자 조회"""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()

    conn.close()

    return dict(row) if row else None


def get_user_by_id(user_id: int) -> Optional[Dict]:
    """ID로 사용자 조회"""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()

    conn.close()

    return dict(row) if row else None


# ============ 세션 관련 함수 ============

def create_session(user_id: int) -> str:
    """세션 생성"""
    session_id = str(uuid.uuid4())
    sessions[session_id] = user_id
    return session_id


def get_session(session_id: str) -> Optional[int]:
    """세션에서 user_id 가져오기"""
    return sessions.get(session_id)


def delete_session(session_id: str):
    """세션 삭제"""
    if session_id in sessions:
        del sessions[session_id]


# ============ 점수 관련 함수 ============

def create_score(user_id: int, score: int, level: int, lines_cleared: int, play_duration: int) -> Dict:
    """게임 점수 기록 - 사용자당 최고 점수만 유지"""
    conn = get_connection()
    cursor = conn.cursor()

    # 기존 최고 점수 확인
    cursor.execute(
        "SELECT id, score FROM game_scores WHERE user_id = ? ORDER BY score DESC LIMIT 1",
        (user_id,)
    )
    existing = cursor.fetchone()

    now = datetime.now().isoformat()

    if existing and existing['score'] >= score:
        # 기존 점수가 더 높으면 기존 기록 반환
        conn.close()
        return get_score_by_id(existing['id'])
    elif existing:
        # 새 점수가 더 높으면 기존 기록 업데이트
        cursor.execute(
            """UPDATE game_scores
            SET score = ?, level = ?, lines_cleared = ?, play_duration = ?, created_at = ?
            WHERE id = ?""",
            (score, level, lines_cleared, play_duration, now, existing['id'])
        )
        score_id = existing['id']
    else:
        # 첫 기록이면 새로 삽입
        cursor.execute(
            """INSERT INTO game_scores
            (user_id, score, level, lines_cleared, play_duration, created_at)
            VALUES (?, ?, ?, ?, ?, ?)""",
            (user_id, score, level, lines_cleared, play_duration, now)
        )
        score_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return get_score_by_id(score_id)


def get_score_by_id(score_id: int) -> Optional[Dict]:
    """특정 점수 기록 조회"""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM game_scores WHERE id = ?", (score_id,))
    row = cursor.fetchone()

    conn.close()

    return dict(row) if row else None


def get_top_scores(limit: int = 10) -> List[Dict]:
    """전체 사용자 최고 점수 목록 - 사용자당 하나씩만"""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            gs.id,
            gs.user_id,
            u.email,
            gs.score,
            gs.level,
            gs.lines_cleared,
            gs.play_duration,
            gs.created_at
        FROM game_scores gs
        JOIN users u ON gs.user_id = u.id
        WHERE gs.id IN (
            SELECT id FROM game_scores gs2
            WHERE gs2.user_id = gs.user_id
            ORDER BY gs2.score DESC
            LIMIT 1
        )
        ORDER BY gs.score DESC
        LIMIT ?
    """, (limit,))

    rows = cursor.fetchall()
    scores = [dict(row) for row in rows]

    conn.close()

    return scores


def get_user_scores(user_id: int) -> List[Dict]:
    """특정 사용자의 점수 기록"""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM game_scores
        WHERE user_id = ?
        ORDER BY score DESC
    """, (user_id,))

    rows = cursor.fetchall()
    scores = [dict(row) for row in rows]

    conn.close()

    return scores
