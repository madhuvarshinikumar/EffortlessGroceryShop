from fastapi import FastAPI
from app.routes.order import router as order_router
from app.database import engine
from app.models import Base
from app.routes.order import router as order_router

# routers
from app.routes.auth import router as auth_router
from app.routes.cart import router as cart_router
from app.routes.product import router as product_router
from app.routes.recipe import router as recipe_router

from fastapi.middleware.cors import CORSMiddleware
# create app
app = FastAPI()


# create tables (DEV ONLY)
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# register routers
app.include_router(auth_router)
app.include_router(cart_router)
app.include_router(product_router)
app.include_router(recipe_router)
app.include_router(order_router)


# home route
@app.get("/")
def home():
    return {"message": "Backend Working"}