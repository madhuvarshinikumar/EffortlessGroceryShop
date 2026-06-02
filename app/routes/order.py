from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from fastapi import Path
from app.database import get_db
from app.models import Cart, Order, OrderItem, Product, User
from app.utils.auth import get_current_user
from pydantic import BaseModel


    
router = APIRouter()

class OrderStatusUpdate(BaseModel):
    status: str


# =========================
# CHECKOUT (CART → ORDER)
# =========================
@router.post("/checkout")
def checkout(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Load cart items with product in ONE query (fix N+1 problem)
    cart_items = db.query(Cart).options(
        joinedload(Cart.product)
    ).filter(
        Cart.user_id == current_user.id
    ).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = 0

    # Validate products + calculate total
    for item in cart_items:
        product = item.product

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Optional: stock check (industry standard)
        if hasattr(product, "stock") and product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        total += product.price * item.quantity

    try:
        # =========================
        # CREATE ORDER
        # =========================
        new_order = Order(
            user_id=current_user.id,
            total_price=total,
            status="pending"
        )

        db.add(new_order)
        db.flush()  # get order.id BEFORE commit (important)

        # =========================
        # CREATE ORDER ITEMS
        # =========================
        order_items = []

        for item in cart_items:
            order_items.append(
                OrderItem(
                    order_id=new_order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.product.price
                )
            )

        db.add_all(order_items)

        # =========================
        # CLEAR CART
        # =========================
        db.query(Cart).filter(
            Cart.user_id == current_user.id
        ).delete()

        db.commit()

        return {
            "message": "Order placed successfully",
            "order_id": new_order.id,
            "total_price": total
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Checkout failed: {str(e)}"
        )


# =========================
# GET MY ORDERS (OPTIMIZED)
# =========================


@router.get("/orders")
def get_all_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).all()

    result = []

    for order in orders:

        items = db.query(OrderItem).filter(
            OrderItem.order_id == order.id
        ).all()

        result.append({
            "id": order.id,
            "total_price": order.total_price,
            "status": order.status,
            "created_at": order.created_at,
            "items": [
                {
                    "id": item.id,
                    "quantity": item.quantity,
                    "price": item.price,
                    "product": db.query(Product).filter(
                        Product.id == item.product_id
                    ).first().__dict__ if db.query(Product).filter(Product.id == item.product_id).first() else None
                }
                for item in items
            ]
        })

    return result

    return result
@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = data.status

    db.commit()
    db.refresh(order)

    return {
        "message": "Status updated",
        "status": order.status
    }

@router.put("/orders/{order_id}/pay")
def confirm_payment(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.status == "paid":
        raise HTTPException(
            status_code=400,
            detail="Order already paid"
        )

    order.status = "paid"

    db.commit()
    db.refresh(order)

    return {
        "message": "Payment confirmed",
        "status": order.status
    }


@router.put("/orders/{order_id}/cancel")
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # Prevent cancelling delivered orders
    if order.status == "delivered":
        raise HTTPException(
            status_code=400,
            detail="Delivered orders cannot be cancelled"
        )

    # Prevent cancelling already cancelled orders
    if order.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Order already cancelled"
        )

    # Restore stock (optional but good)
    items = db.query(OrderItem).filter(
        OrderItem.order_id == order.id
    ).all()

    for item in items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product:
            product.quantity += item.quantity

    order.status = "cancelled"

    db.commit()
    db.refresh(order)

    return {
        "message": "Order cancelled successfully",
        "status": order.status
    }