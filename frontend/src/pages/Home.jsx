import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-hot-toast";
import "./Home.css";

const categoryTiles = [
  { label: "Fruits", icon: "🍎" },
  { label: "Vegetables", icon: "🥦" },
  { label: "Dairy", icon: "🥛" },
  { label: "Pantry", icon: "🥫" },
  { label: "Bakery", icon: "🥐" },
  { label: "Snacks", icon: "🍪" },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products?limit=12");

      const payload = res.data?.data ?? res.data;

      if (Array.isArray(payload)) {
        setProducts(payload);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Unable to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const featured = products.slice(0, 4);
  const trending = products.slice(4, 10);

  return (
    <div className="page-shell">
      {/* HERO SECTION */}

      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Fresh groceries delivered in minutes</p>

          <h1>
            Fresh food for your
            <span> everyday life.</span>
          </h1>

          <p className="hero-text">
            Order premium fruits, vegetables, dairy, bakery items and more —
            delivered fast with a beautiful shopping experience.
          </p>

          <div className="hero-actions">
            <button onClick={() => navigate("/products")}>
              Shop Now
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("/recipes")}
            >
              Explore Recipes
            </button>
          </div>
        </div>

        <div className="hero-image">
  <img
    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
    alt="Fresh groceries"
  />
</div>
      </section>

      {/* CATEGORY SECTION */}

      <section className="section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Browse Categories</p>
            <h2>Shop by collection</h2>
          </div>

          <button
            className="secondary-outline"
            onClick={() => navigate("/products")}
          >
            View All
          </button>
        </div>

        <div className="category-grid">
          {categoryTiles.map((category) => (
            <div key={category.label} className="category-card">
              <div className="category-icon">
                {category.icon}
              </div>

              <h3>{category.label}</h3>

              <p>Fresh & organic products</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}

      <section className="section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Featured Products</p>
            <h2>Chef's picks for today</h2>
          </div>

          <button
            className="secondary-outline"
            onClick={() => navigate("/products")}
          >
            See All
          </button>
        </div>

        <div className="featured-grid">
          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : featured.length ? (
            featured.map((product) => (
              <div
                key={product.id}
                className="featured-card"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="featured-image">
                  <img
                    src={
                      product.image_url ||
                      "https://via.placeholder.com/320x240"
                    }
                    alt={product.name}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/320x240";
                    }}
                  />

                  <span className="badge">
                    Fresh
                  </span>
                </div>

                <div className="featured-copy">
                  <h3>{product.name}</h3>

                  <p className="small-text">
                    {product.description ||
                      "Premium grocery item"}
                  </p>

                  <div className="price-row">
                    <strong>
                      ₹ {product.price}
                    </strong>

                    <button>Add</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </section>

      {/* OFFER SECTION */}

      <section className="offer-section">
        <div className="offer-card">
          <div>
            <p className="eyebrow">Special Offer</p>

            <h2>Save 15% on your first order</h2>

            <p>
              Use code <strong>FRESH15</strong> at checkout.
            </p>
          </div>

          <button onClick={() => navigate("/checkout")}>
            Apply Coupon
          </button>
        </div>
      </section>

      {/* TRENDING */}

      <section className="section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Trending Now</p>
            <h2>Popular picks</h2>
          </div>
        </div>

        <div className="trending-grid">
          {trending.map((product) => (
            <div
              key={product.id}
              className="trending-card"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="trending-image">
                <img
                  src={
                    product.image_url ||
                    "https://via.placeholder.com/240x180"
                  }
                  alt={product.name}
                />
              </div>

              <div className="trending-copy">
                <h3>{product.name}</h3>

                <p>₹ {product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}

      <footer className="home-footer">
        <div>
          <h3>FreshMart</h3>

          <p>
            Fresh groceries, fast delivery, and a premium shopping
            experience.
          </p>
        </div>

        <div className="footer-links">
          <a href="/products">Products</a>
          <a href="/recipes">Recipes</a>
          <a href="/cart">Cart</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;