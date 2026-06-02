import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  MapPin,
  Plus,
  Minus,
  Zap,
  Leaf,
  Truck,
} from "lucide-react";

import API from "../api";
import { toast } from "react-hot-toast";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [removingItemId, setRemovingItemId] =
    useState(null);

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  const [updatingQtyId, setUpdatingQtyId] =
    useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await API.get("/cart");

      if (Array.isArray(res.data)) {
        setCart(res.data);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to load cart");

      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    setRemovingItemId(id);

    try {
      await API.delete(
        `/remove-from-cart/${id}`
      );

      setCart((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("Item removed");
    } catch (err) {
      console.error(err);

      toast.error("Failed to remove item");
    } finally {
      setRemovingItemId(null);
    }
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;

    setUpdatingQtyId(id);

    try {
      await API.put(`/cart/${id}`, {
        quantity: newQty,
      });

      setCart((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, quantity: newQty }
            : item
        )
      );

      toast.success("Quantity updated");
    } catch (err) {
      console.error(err);

      toast.error("Failed to update quantity");
    } finally {
      setUpdatingQtyId(null);
    }
  };

  const placeOrder = async () => {
    setIsPlacingOrder(true);

    try {
      await API.post("/checkout");

      toast.success(
        "Order placed successfully!"
      );

      setCart([]);

      navigate("/order-history");
    } catch (err) {
      console.error(err);

      toast.error("Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      (item.product
        ? item.product.price * item.quantity
        : 0),
    0
  );

  const deliveryFee = 40;
  const handlingFee = 10;

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-state">
          <div className="empty-icon">
            <ShoppingCart size={64} />
          </div>

          <h1>Your Cart is Empty</h1>

          <p>
            Looks like you haven't added any
            items yet. Start shopping fresh
            groceries today!
          </p>

          <button
            className="button-primary"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* DELIVERY HEADER */}

      <div className="cart-delivery-header">
        <button
          className="back-button"
          onClick={() =>
            navigate("/products")
          }
        >
          <ArrowLeft size={18} />
          Back to Shopping
        </button>

        <div className="delivery-location">
          <MapPin size={18} />

          <div>
            <p className="label">
              Delivering to
            </p>
            <span className="location">
              Chennai, Tamil Nadu
            </span>
          </div>
        </div>
      </div>

      {/* PAGE HEADER */}

      <div className="cart-header-section">
        <div className="header-content">
          <p className="tag">
            🛒 Shopping Cart
          </p>

          <h1>Your Order</h1>

          <p className="subtitle">
            Review and finalize your fresh
            grocery selection
          </p>
        </div>

        <div className="items-badge">
          {cart.length}{" "}
          {cart.length === 1 ? "Item" : "Items"}
        </div>
      </div>

      {/* MAIN CONTENT GRID */}

      <div className="cart-content">
        {/* ITEMS SECTION */}

        <div className="cart-items-list">
          <div className="section-title">
            Added Items
          </div>

          <div className="items-container">
            {cart.map((item) => (
              <div
                key={item.id}
                className="cart-item-card"
              >
                {/* ITEM IMAGE */}

                <div className="item-image-wrapper">
                  <img
                    src={
                      item.product?.image_url ||
                      "https://via.placeholder.com/140"
                    }
                    alt={
                      item.product?.name ||
                      "Product"
                    }
                    className="item-image"
                  />
                </div>

                {/* ITEM DETAILS */}

                <div className="item-details">
                  <div>
                    <h3 className="item-name">
                      {
                        item.product?.name
                      }
                    </h3>

                    <p className="item-description">
                      Fresh & premium quality
                      grocery item
                    </p>

                    <div className="item-badges">
                      <span className="badge fresh">
                        <Leaf size={14} />
                        Fresh
                      </span>

                      <span className="badge quick">
                        <Zap size={14} />
                        Quick Delivery
                      </span>
                    </div>
                  </div>

                  {/* QUANTITY CONTROLS */}

                  <div className="quantity-section">
                    <label className="qty-label">
                      Quantity:
                    </label>

                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        disabled={
                          updatingQtyId ===
                            item.id ||
                          item.quantity <=
                            1
                        }
                      >
                        <Minus size={16} />
                      </button>

                      <span className="qty-value">
                        {item.quantity}
                      </span>

                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        disabled={
                          updatingQtyId ===
                            item.id
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ITEM PRICE & ACTIONS */}

                <div className="item-footer">
                  <div className="item-price-section">
                    <p className="price-label">
                      Price
                    </p>

                    <div className="price-display">
                      <span className="item-price">
                        ₹
                        {item.product?.price}
                      </span>

                      <span className="total-price">
                        ₹
                        {(
                          item.product
                            ?.price *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(item.id)
                    }
                    disabled={
                      removingItemId ===
                      item.id
                    }
                  >
                    <Trash2 size={18} />

                    {removingItemId ===
                    item.id
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER SUMMARY SECTION */}

        <div className="cart-summary-box">
          <h2 className="summary-title">
            Order Summary
          </h2>

          <div className="summary-content">
            {/* PRICE BREAKDOWN */}

            <div className="price-breakdown">
              <div className="breakdown-row">
                <span className="label">
                  Items Subtotal
                </span>

                <span className="value">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="breakdown-row">
                <span className="label">
                  <Truck size={16} />
                  Delivery Fee
                </span>

                <span className="value">
                  ₹{deliveryFee}
                </span>
              </div>

              <div className="breakdown-row">
                <span className="label">
                  Handling Fee
                </span>

                <span className="value">
                  ₹{handlingFee}
                </span>
              </div>

              <div className="breakdown-divider"></div>

              <div className="breakdown-row total">
                <span className="label">
                  Total Amount
                </span>

                <span className="value total-amount">
                  ₹
                  {(
                    totalPrice +
                    deliveryFee +
                    handlingFee
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* SAVINGS INFO */}

            <div className="savings-info">
              <span className="savings-icon">
                💰
              </span>

              <p>
                You're saving with every
                fresh item! Fast delivery
                in 30 mins.
              </p>
            </div>

            {/* CHECKOUT BUTTON */}

            <button
              className="checkout-btn"
              onClick={placeOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout
                </>
              )}
            </button>

            {/* CONTINUE SHOPPING */}

            <button
              className="continue-shopping-btn"
              onClick={() =>
                navigate("/products")
              }
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;