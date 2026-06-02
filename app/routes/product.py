from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Cart, Product
from app.schemas import ProductBase

from app.services.product_services import create_product, get_products
from app.utils.response import success

router = APIRouter()



# CREATE PRODUCT
@router.post("/products")
def add_product(product: ProductBase, db: Session = Depends(get_db)):

    result = create_product(
        db,
        product.name,
        product.price,
        product.description
    )

    return success("Product created", result)



# GET PRODUCTS (pagination + search)
@router.get("/products")
def list_products(skip: int = 0, limit: int = 10, search: str = None, db: Session = Depends(get_db)):

    data = get_products(db, skip, limit, search)

    return success("Products fetched", data)

# =========================
# GET PRODUCT BY ID
# =========================
@router.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# =========================
# DELETE PRODUCT
# =========================
@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
# STEP 1: delete cart items linked to this product
    db.query(Cart).filter(Cart.product_id == product.id).delete(synchronize_session=False)

# STEP 2: delete product itself
    db.delete(product)

# STEP 3: commit once
    db.commit()

    return {"message": "Product deleted successfully"}