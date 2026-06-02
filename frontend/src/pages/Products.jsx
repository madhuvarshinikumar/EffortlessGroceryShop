import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-hot-toast";

import "./Products.css";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [buyNowLoadingId, setBuyNowLoadingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products?limit=40");
      const payload = res.data?.data ?? res.data;

      setProducts(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    let result = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(normalized) ||
        (product.description || "").toLowerCase().includes(normalized)
      );
    });

    if (sortBy === "priceAsc") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "priceDesc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchTerm, sortBy]);

  const handleQuantityChange = (productId, value) => {
    const quantity = Math.max(1, Number(value) || 1);

    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  // ✅ FIXED BUY NOW (proper flow)
  const buyNow = async (productId) => {
    if (buyNowLoadingId) return;

    try {
      setBuyNowLoadingId(productId);

      const quantity = quantities[productId] || 1;

      // Add item to cart and remember the cart item id for buy-now flow
      const res = await API.post("/add-to-cart", {
        product_id: productId,
        quantity,
        buy_now: true,
      });

      const cartItemId = res.data?.id;

      if (cartItemId) {
        const existing = JSON.parse(sessionStorage.getItem("buy_now_cart_ids") || "[]");
        existing.push(cartItemId);
        sessionStorage.setItem("buy_now_cart_ids", JSON.stringify(existing));
      }

      // Navigate to checkout so user can review, confirm payment or cancel
      navigate("/checkout");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to initiate Buy Now");
    } finally {
      setBuyNowLoadingId(null);
    }
  };

  const addToCart = async (productId) => {
    setAddingProductId(productId);

    try {
      await API.post("/add-to-cart", {
        product_id: productId,
        quantity: quantities[productId] || 1,
      });

      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setAddingProductId(null);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Fresh Products</h1>

        <div className="products-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <img
                src={
                  product.image_url ||
                  "https://via.placeholder.com/300"
                }
                alt={product.name}
              />
            </div>

            <div className="product-content">
              <div className="product-top">
                <h3>{product.name}</h3>

                <div className="rating">
                  <Star size={14} fill="gold" />
                  <span>4.5</span>
                </div>
              </div>

              <p>{product.description || "Fresh grocery item"}</p>

              <div className="price-row">
                <h2>₹{product.price.toFixed(2)}</h2>
                <span>Stock: {product.quantity}</span>
              </div>

              {/* Quantity Controls */}
              <div className="quantity-row">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      product.id,
                      (quantities[product.id] || 1) - 1
                    )
                  }
                >
                  −
                </button>

                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(product.id, e.target.value)
                  }
                />

                <button
                  onClick={() =>
                    handleQuantityChange(
                      product.id,
                      (quantities[product.id] || 1) + 1
                    )
                  }
                >
                  +
                </button>
              </div>

              {/* BUY NOW BUTTON (MAIN FIX) */}
              <button
                className="buy-now-btn"
                onClick={() => buyNow(product.id)}
                disabled={buyNowLoadingId === product.id}
              >
                {buyNowLoadingId === product.id
                  ? "Processing..."
                  : "⚡ Buy Now"}
              </button>

              {/* ADD TO CART */}
              <button
                className="add-btn"
                onClick={() => addToCart(product.id)}
                disabled={addingProductId === product.id}
              >
                {addingProductId === product.id
                  ? "Adding..."
                  : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;