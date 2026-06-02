from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel




from app.schemas import CartUpdate

from app.database import get_db
from app.models import Cart, User
from app.schemas import CartBase
from app.services.cart_service import CartService
from app.utils.auth import get_current_user

router = APIRouter()


# =========================
# ADD TO CART
# =========================
@router.post("/add-to-cart")
def add_to_cart(
    cart: CartBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)   # ✅ ADD THIS
):

    db_cart = Cart(
        user_id=current_user.id,   # ✅ NOW IT EXISTS
        product_id=cart.product_id,
        quantity=cart.quantity
    )

    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)

    return db_cart
@router.put("/cart/{cart_id}")
def update_cart(
    cart_id: int,
    data: CartUpdate,
    db: Session = Depends(get_db)
):
    cart_item = (
        db.query(Cart)
        .filter(Cart.id == cart_id)
        .first()
    )

    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    cart_item.quantity = data.quantity

    db.commit()
    db.refresh(cart_item)

    return {
        "message": "Quantity updated",
        "quantity": cart_item.quantity
    }
# =========================
# GET CART
# =========================
@router.get("/cart")
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    cart_items = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).all()

    result = []

    for item in cart_items:
        result.append({
            "id": item.id,
            "product_id": item.product_id,
            "quantity": item.quantity,
            "product": {
                "id": item.product.id,
                "name": item.product.name,
                "price": item.product.price,
                "image_url": item.product.image_url
            }
        })

    return result


# =========================
# REMOVE FROM CART
# =========================
@router.delete("/remove-from-cart/{cart_id}")
def remove_from_cart(
    cart_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)   # ✅ FIX HERE
):

    item = db.query(Cart).filter(
        Cart.id == cart_id,
        Cart.user_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    db.delete(item)
    db.commit()

    return {"message": "Removed from cart"}