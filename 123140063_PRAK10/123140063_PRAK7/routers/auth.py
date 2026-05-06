from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from utils.auth import create_token
from database import get_pool
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserCreate):
    pool = await get_pool()
    hashed = pwd_context.hash(user.password)
    async with pool.acquire() as conn:
        cek = await conn.fetchval("SELECT email FROM users WHERE email=$1", user.email)
        if cek: raise HTTPException(400, "Email sudah terdaftar")
        await conn.execute("INSERT INTO users (email, password_hash) VALUES ($1, $2)", user.email, hashed)
    return {"message": "Register berhasil"}

@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    pool = await get_pool()
    async with pool.acquire() as conn:
        user = await conn.fetchrow("SELECT * FROM users WHERE email=$1", form.username)
        if not user or not pwd_context.verify(form.password, user["password_hash"]):
            raise HTTPException(401, "Kredensial salah")
        token = create_token({"sub": user["email"]})
        return {"access_token": token, "token_type": "bearer"}