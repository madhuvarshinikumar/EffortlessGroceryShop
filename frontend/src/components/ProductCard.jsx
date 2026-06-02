import { useState } from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart, onViewDetails }) {
  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (quantity > 0) {
      onAddToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const handleQuantityChange = (e, value) => {
    e.stopPropagation();
    setQuantity(value);
  };

  return (
    <div className="product-card" onClick={() => onViewDetails(product.id)}>
      <div className="product-image-container">
        <img
          src={product.image || 'https://via.placeholder.com/200?text=Product'}
          alt={product.name}
          className="product-image"
        />
        {product.discount && (
          <div className="discount-badge">{product.discount}% OFF</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-quantity">
          <span className="quantity-label">{product.quantity || '500ml'}</span>
        </div>

        <div className="product-price-section">
          <span className="product-price">₹{product.price}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="product-original-price">₹{product.original_price}</span>
          )}
        </div>

        <div className="product-controls">
          {quantity === 0 ? (
            <button 
              className="add-btn"
              onClick={handleAddToCart}
            >
              ADD
            </button>
          ) : (
            <div className="quantity-controls">
              <button 
                className="qty-btn"
                onClick={(e) => handleQuantityChange(e, quantity - 1)}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button 
                className="qty-btn"
                onClick={(e) => handleQuantityChange(e, quantity + 1)}
              >
                +
              </button>
            </div>
          )}
        </div>

        {isAdded && <div className="added-message">✓ Added to cart</div>}
      </div>
    </div>
  );
}

export default ProductCard;
