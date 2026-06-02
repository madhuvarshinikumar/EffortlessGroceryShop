from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base

from app.routes.auth import router as auth_router
from app.routes.cart import router as cart_router
from app.routes.product import router as product_router
from app.routes.recipe import router as recipe_router
from app.routes.order import router as order_router

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(cart_router)
app.include_router(product_router)
app.include_router(recipe_router)
app.include_router(order_router)

@app.get("/")
def home():
    return {
        "message": "Effortless Grocery Shop Backend Running"
    }