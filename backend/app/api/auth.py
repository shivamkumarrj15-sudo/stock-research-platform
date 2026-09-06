"""
Auth API Router
===============
Handles registration, authentication login, token refreshes, and profile management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
    get_current_user,
)
from app.core.config import settings
from app.schemas.schemas import UserCreate, UserResponse, UserLogin, TokenResponse

router = APIRouter()

# In-Memory Fallback User DB for fast demo run
DEMO_USERS = {}

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    if user_in.email in DEMO_USERS:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = {
        "id": f"usr_{len(DEMO_USERS)+1}",
        "email": user_in.email,
        "full_name": user_in.full_name or user_in.email.split("@")[0],
        "hashed_password": get_password_hash(user_in.password),
        "is_active": True,
        "is_admin": False,
        "subscription_tier": "free",
        "created_at": "2026-08-30T00:00:00Z"
    }
    DEMO_USERS[user_in.email] = user_dict
    return user_dict

@router.post("/login", response_model=TokenResponse)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    user = DEMO_USERS.get(user_in.email)
    if not user:
        # Default demo fallback login
        if user_in.email == "demo@stockiq.com" and user_in.password == "demo123":
            user = {
                "id": "usr_demo",
                "email": "demo@stockiq.com",
                "full_name": "Demo Trader",
                "hashed_password": get_password_hash("demo123"),
                "is_active": True,
                "is_admin": True,
                "subscription_tier": "pro_plus",
                "created_at": "2026-08-30T00:00:00Z"
            }
            DEMO_USERS["demo@stockiq.com"] = user
        else:
            raise HTTPException(status_code=401, detail="Incorrect email or password")

    if not verify_password(user_in.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token(
        data={"sub": user["email"], "id": user["id"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_refresh_token(
        data={"sub": user["email"], "id": user["id"]}
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
async def get_me():
    # Return demo profile
    return DEMO_USERS.get("demo@stockiq.com", {
        "id": "usr_demo",
        "email": "demo@stockiq.com",
        "full_name": "Demo Trader",
        "is_active": True,
        "is_admin": True,
        "subscription_tier": "pro_plus",
        "created_at": "2026-08-30T00:00:00Z"
    })
