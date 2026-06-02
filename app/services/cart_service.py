from sqlalchemy.orm import Session
from app.models import Cart, Product


class CartService:

    def __init__(self, db: Session):
        self.db = db

    def add_to_cart(self, user_id: int, product_id: int, quantity: int):

        product = self.db.query(Product).filter(Product.id == product_id).first()

        if not product:
            return None, "Product not found"

        # 🚀 CHECK IF ITEM ALREADY IN CART
        existing_item = self.db.query(Cart).filter(
            Cart.user_id == user_id,
            Cart.product_id == product_id
        ).first()

        # ✅ If exists → update quantity
        if existing_item:
            existing_item.quantity += quantity
            self.db.commit()
            self.db.refresh(existing_item)
            return existing_item, "Cart updated successfully"

        # ❌ else create new
        cart = Cart(
            user_id=user_id,
            product_id=product_id,
            quantity=quantity
        )

        self.db.add(cart)
        self.db.commit()
        self.db.refresh(cart)

        return cart, "Added successfully"