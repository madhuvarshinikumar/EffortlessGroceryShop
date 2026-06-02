from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str


# product schema
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    quantity: int

class ProductOut(ProductBase):
    id: int

    class Config:
        from_attributes = True

# cart schema
class CartBase(BaseModel):
    product_id: int
    quantity: int

# recipe schema
class RecipeItemBase(BaseModel):
    product_id: int
    quantity: int

class RecipeItemOut(BaseModel):
    product_id: int
    quantity: int
    product: ProductOut | None = None

    class Config:
        from_attributes = True

class RecipeBase(BaseModel):
    name: str
    instructions: str
    items: list[RecipeItemBase]

class RecipeOut(BaseModel):
    id: int
    name: str
    instructions: str
    items: list[RecipeItemOut]

    class Config:
        from_attributes = True


# AI Recipe Schemas
class AIRecipeGenerateRequest(BaseModel):
    """Request schema for AI recipe generation"""
    prompt: str


class MatchedProductItem(BaseModel):
    """Schema for matched product in AI recipe"""
    product_id: int
    product_name: str
    ingredient_name: str
    quantity: int
    price: float
    available_quantity: int
    in_stock: bool


class AIRecipeGenerateResponse(BaseModel):
    """Response schema for AI recipe generation"""
    recipe_name: str
    ingredients: list[str]
    instructions: str
    matched_products: list[MatchedProductItem]


class CartUpdate(BaseModel):
    quantity: int