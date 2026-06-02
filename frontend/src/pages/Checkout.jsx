import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-hot-toast";
import "./Checkout.css";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);
  const [buyNowCartIds, setBuyNowCartIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [coupon, setCoupon] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("buy_now_cart_ids");

    if (stored) {
      try {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids) && ids.length) {
          setIsBuyNowFlow(true);
          setBuyNowCartIds(ids);
        }
      } catch {}
    }

    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Could not load cart");
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const discount =
    coupon.toLowerCase() === "fresh15" ? subtotal * 0.15 : 0;

  const delivery = subtotal > 0 ? 40 : 0;
  const total = subtotal + delivery - discount;

  const placeOrder = async () => {
    if (!address.trim()) {
      toast.error("Please add delivery address");
      return;
    }

    setPlacingOrder(true);

    try {
      const res = await API.post("/checkout");

      const orderId = res.data?.order_id;

      sessionStorage.removeItem("buy_now_cart_ids");

      if (!orderId) {
        toast.success("Order placed!");
        navigate("/orders");
        return;
      }

      toast.success("Order placed successfully!");
      navigate("/orders");

    } catch (err) {
      toast.error("Checkout failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">

      {/* HEADER */}
      <section className="section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Checkout</p>
            <h2>Complete your order</h2>
          </div>

          <button
            className="secondary-btn"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </section>

      {/* GRID */}
      <div className="checkout-grid">

        {/* LEFT PANEL */}
        <div className="checkout-card">

          <h3>Delivery Details</h3>

          <textarea
            placeholder="Enter your full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <h3>Payment Method</h3>

          <div className="payment-options">
            <label className={paymentMethod === "card" ? "selected" : ""}>
              <input
                type="radio"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Card
            </label>

            <label className={paymentMethod === "upi" ? "selected" : ""}>
              <input
                type="radio"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              UPI
            </label>
          </div>

          <div className="coupon-row">
            <input
              placeholder="Coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />

            <button
  className="apply-btn"
  type="button"
  onClick={() => toast.success("Coupon applied")}
>
  Apply
</button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="summary-card">

          <h3>Order Summary</h3>

          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="summary-item">
                <span>{item.product?.name}</span>
                <span>
                  ₹ {(item.product?.price || 0) * item.quantity}
                </span>
              </div>
            ))
          )}

          <div className="summary-box">

            <div>
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>

            <div>
              <span>Delivery</span>
              <span>₹ {delivery}</span>
            </div>

            <div>
              <span>Discount</span>
              <span>- ₹ {discount}</span>
            </div>

            <div className="total">
              <strong>Total</strong>
              <strong>₹ {total}</strong>
            </div>

          </div>

          <button
  className="place-order-btn"
  onClick={placeOrder}
  disabled={placingOrder || cart.length === 0}
>
  {placingOrder ? "Placing Order..." : "Place Order"}
</button>

        </div>

      </div>
    </div>
  );
}

export default Checkout;