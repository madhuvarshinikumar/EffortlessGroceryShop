from sqlalchemy.orm import Session
from app.models import Product


def create_product(db: Session, name: str, price: float, description: str):
    product = Product(
        name=name,
        price=price,
        description=description
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_products(db: Session, skip: int = 0, limit: int = 10, search: str = None):

    query = db.query(Product)

    if search:
        query = query.filter(Product.name.contains(search))

    return query.offset(skip).limit(limit).all()