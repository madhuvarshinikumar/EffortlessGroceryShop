from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Recipe, RecipeItem, Product
from app.schemas import (
    RecipeBase, 
    RecipeOut, 
    AIRecipeGenerateRequest, 
    AIRecipeGenerateResponse
)
from app.services.gemini_service import get_gemini_service

router = APIRouter()


# =========================
# CREATE RECIPE
# =========================
@router.post("/recipes")
def create_recipe(recipe: RecipeBase, db: Session = Depends(get_db)):

    # STEP 1: validate products exist
    for item in recipe.items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

    # STEP 2: create recipe
    new_recipe = Recipe(
        name=recipe.name,
        instructions=recipe.instructions
    )

    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)

    # STEP 3: add recipe items
    for item in recipe.items:
        db.add(RecipeItem(
            recipe_id=new_recipe.id,
            product_id=item.product_id,
            quantity=item.quantity
        ))

    db.commit()

    return {
        "message": "Recipe created successfully",
        "recipe_id": new_recipe.id
    }


# =========================
# GET ALL RECIPES
# =========================
@router.get("/recipes", response_model=list[RecipeOut])
def get_recipes(db: Session = Depends(get_db)):

    return db.query(Recipe).all()


# =========================
# GET RECIPE BY ID
# =========================
@router.get("/recipes/{recipe_id}", response_model=RecipeOut)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):

    recipe = db.query(Recipe).filter(
        Recipe.id == recipe_id
    ).first()

    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="Recipe not found"
        )

    return recipe


# =========================
# DELETE RECIPE (SAFE)
# =========================
@router.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):

    recipe = db.query(Recipe).filter(
        Recipe.id == recipe_id
    ).first()

    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="Recipe not found"
        )

    # delete child items first
    db.query(RecipeItem).filter(
        RecipeItem.recipe_id == recipe_id
    ).delete()

    db.delete(recipe)
    db.commit()

    return {"message": "Recipe deleted successfully"}


# =========================
# AI RECIPE GENERATION
# =========================
@router.post("/ai/generate-recipe", response_model=AIRecipeGenerateResponse)
def generate_ai_recipe(
    request: AIRecipeGenerateRequest, 
    db: Session = Depends(get_db)
):
    """
    Generate a recipe using Gemini AI based on user prompt.
    Matches ingredients with available products from the store.
    
    Args:
        request: Contains user's recipe prompt
        db: Database session
        
    Returns:
        AI-generated recipe with matched products
    """
    try:
        # Validate prompt
        if not request.prompt.strip():
            raise HTTPException(
                status_code=400,
                detail="Recipe prompt cannot be empty"
            )
        
        # Get available products from database
        available_products = db.query(Product).filter(
            Product.quantity > 0
        ).all()
        
        if not available_products:
            raise HTTPException(
                status_code=400,
                detail="No products available in store"
            )
        
        # Convert products to dict format for matching
        products_list = [
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "quantity": p.quantity
            }
            for p in available_products
        ]
        
        # Initialize Gemini service
        gemini_service = get_gemini_service()
        
        # Generate recipe using Gemini
        recipe_data = gemini_service.generate_recipe(request.prompt)
        
        # Match ingredients with available products
        matched_products = gemini_service.match_ingredients_with_products(
            recipe_data["ingredients"],
            products_list
        )
        
        return AIRecipeGenerateResponse(
            recipe_name=recipe_data["recipe_name"],
            ingredients=recipe_data["ingredients"],
            instructions=recipe_data["instructions"],
            matched_products=matched_products
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid recipe data: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recipe: {str(e)}"
        )