import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import { toast } from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Failed to load product:", err);
      toast.error("Could not load this product.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await API.post("/add-to-cart", {
        product_id: product.id,
        quantity: qty,
      });
      toast.success("Added to cart");
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Failed to add this product to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-shell">
        <div className="page-card page-card-wide">
          <div className="page-header">
            <p className="eyebrow">Product not found</p>
            <h1>We couldn't find this item</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-card page-card-wide product-detail-card">
        <div className="product-detail-grid">
          <div className="product-detail-images">
            <div className="image-large">
              <img
                src={product.image_url || "https://via.placeholder.com/640x480"}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/640x480";
                }}
              />
            </div>
            <div className="image-thumbs">
              {[0, 1, 2].map((index) => (
                <div key={index} className="thumb-item">
                  <img
                    src={product.image_url || "https://via.placeholder.com/180x140"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="product-detail-info">
            <p className="eyebrow">Product details</p>
            <h1>{product.name}</h1>
            <div className="rating-row">
              <span>★★★★☆</span>
              <span className="small-text">4.3 rating</span>
            </div>
            <p className="product-description">{product.description || "A fresh grocery item selected for your kitchen."}</p>
            <div className="product-meta">
              <div>
                <span className="meta-label">Price</span>
                <strong>₹ {product.price}</strong>
              </div>
              <div>
                <span className="meta-label">Stock</span>
                <strong>{product.quantity}</strong>
              </div>
            </div>

            <div className="quantity-row">
              <div className="quantity-selector">
                <button onClick={() => setQty((current) => Math.max(1, current - 1))}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty((current) => Math.min(product.quantity, current + 1))}>+</button>
              </div>
              <button className="button-large" onClick={addToCart} disabled={adding || product.quantity === 0}>
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            <div className="review-block">
              <h2>Reviews</h2>
              <div className="review-item">
                <strong>Anna R.</strong>
                <p>Great quality and fresh delivery. Perfect for everyday cooking.</p>
              </div>
              <div className="review-item">
                <strong>Vijay S.</strong>
                <p>Love the flavour and the quick add-to-cart flow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
