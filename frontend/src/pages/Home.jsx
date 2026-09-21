
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-hot-toast";
import "./Home.css";

const categoryTiles = [
  { label: "Fruits", description: "Fresh & organic products" },
  { label: "Vegetables", description: "Fresh & organic products" },
  { label: "Dairy", description: "Fresh & organic products" },
  { label: "Pantry", description: "Fresh & organic products" },
  { label: "Bakery", description: "Fresh & organic products" },
  { label: "Snacks", description: "Fresh & organic products" },
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
    <div className="home-page">

      {/* HERO */}
      <section className="home-hero">

        <div className="home-hero-content">

          <div className="home-badge">
            Fresh groceries delivered in minutes
          </div>

          <h1>
            Fresh food for your
            <span> everyday life.</span>
          </h1>

          <p>
            Order premium fruits, vegetables, dairy, bakery items and more —
            delivered fast with a beautiful shopping experience.
          </p>

          <div className="home-buttons">

            <button onClick={() => navigate("/products")}>
              Shop Now
            </button>

            <button
              className="home-secondary-btn"
              onClick={() => navigate("/recipes")}
            >
              Explore Recipes
            </button>

          </div>

        </div>

        <div className="home-hero-image">

          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
            alt="Fresh groceries"
          />

        </div>

      </section>


      {/* CATEGORIES */}
      <section className="home-section">

        <div className="home-section-title">

          <h2>
            Shop by collection
          </h2>

          <p>
            Browse our grocery categories
          </p>

        </div>

        <div className="home-categories-grid">

          {categoryTiles.map((category) => (

            <div
              key={category.label}
              className="home-category-card"
            >

              <p>
                {category.label}
              </p>

              <small>
                {category.description}
              </small>

            </div>

          ))}

        </div>

      </section>


      {/* FEATURED PRODUCTS */}
      <section className="home-section">

        <div className="home-section-title">

          <h2>
            Chef's picks for today
          </h2>

          <p>
            Fresh products selected for you
          </p>

        </div>

        <div className="home-products-grid">

          {loading ? (

            <p>
              Loading products...
            </p>

          ) : featured.length ? (

            featured.map((product) => (

              <div
                key={product.id}
                className="home-product-card"
                onClick={() =>
                  navigate(`/products/${product.id}`)
                }
              >

                <div className="home-product-image">

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

                </div>

                <div className="home-product-content">

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description ||
                      "Premium grocery item"}
                  </p>

                  <div className="home-price">
                    ₹ {product.price}
                  </div>

                </div>

              </div>

            ))

          ) : (

            <p>
              No products found.
            </p>

          )}

        </div>

      </section>


      {/* TRENDING */}
      <section className="home-section">

        <div className="home-section-title">

          <h2>
            Popular picks
          </h2>

          <p>
            Trending products customers love
          </p>

        </div>

        <div className="home-products-grid">

          {trending.map((product) => (

            <div
              key={product.id}
              className="home-product-card"
              onClick={() =>
                navigate(`/products/${product.id}`)
              }
            >

              <div className="home-product-image">

                <img
                  src={
                    product.image_url ||
                    "https://via.placeholder.com/240x180"
                  }
                  alt={product.name}
                />

              </div>

              <div className="home-product-content">

                <h3>
                  {product.name}
                </h3>

                <div className="home-price">
                  ₹ {product.price}
                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* FOOTER */}
      <footer className="home-footer">

        <div>

          <h3>
            FreshMart
          </h3>

          <p>
            Fresh groceries, fast delivery, and a premium
            shopping experience.
          </p>

        </div>

        <div className="home-footer-links">

          <a href="/products">
            Products
          </a>

          <a href="/recipes">
            Recipes
          </a>

          <a href="/cart">
            Cart
          </a>

        </div>

      </footer>

    </div>
  );
}

export default Home;
