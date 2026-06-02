import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-hot-toast";
import "./OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      const data = res.data?.data ?? res.data;

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
        toast.error("Unable to load order history.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setCancelLoading(orderId);

      await API.put(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled successfully.");

      setOrders((prev) =>
        prev.map((order) =>
          (order.id === orderId || order._id === orderId)
            ? { ...order, status: "cancelled" }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to cancel order.");
    } finally {
      setCancelLoading(null);
    }
  };

  const reorder = async (order) => {
    try {
      const addedIds = [];

      for (const item of order.items || []) {
        const res = await API.post("/add-to-cart", {
          product_id: item.product?.id || item.product_id,
          quantity: item.quantity || 1,
          buy_now: true,
        });

        if (res.data?.id) addedIds.push(res.data.id);
      }

      if (addedIds.length) {
        sessionStorage.setItem(
          "buy_now_cart_ids",
          JSON.stringify(addedIds)
        );
        toast.success("Added items for quick checkout");
        navigate("/checkout");
      } else {
        toast.error("Could not add items for reorder");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to reorder.");
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value || 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "#16a34a";
      case "cancelled":
        return "#ef4444";
      case "shipped":
        return "#2563eb";
      case "processing":
        return "#f59e0b";
      default:
        return "#64748b";
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="page-shell">
        <button className="secondary-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="empty-state">
          <Package size={70} />
          <h2>No Orders Yet</h2>
          <p>Your Buy Now orders will appear here.</p>

          <button
            className="primary-btn"
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>
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
            <button className="secondary-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back
            </button>

            <p className="eyebrow">📦 Order Management</p>
            <h2>Your Orders</h2>
          </div>
        </div>
      </section>

      {/* ORDERS */}
      <section className="section-block">

        {orders.map((order) => {
          const id = order.id || order._id;
          const isOpen = expandedOrder === id;

          return (
            <div
              key={id}
              className="home-product-card"
            >
              {/* TOP */}
              <div
                className="home-product-content"
                onClick={() =>
                  setExpandedOrder(isOpen ? null : id)
                }
              >
                <div className="order-top-row">
                  <h3>Order #{id}</h3>

                  <span
                    className="status-pill"
                    style={{
                      background: `${getStatusColor(order.status)}20`,
                      color: getStatusColor(order.status),
                    }}
                  >
                    {order.status || "pending"}
                  </span>
                </div>

                <div className="order-meta">
                  <span>
                    <Calendar size={14} />
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString("en-IN")
                      : "Just now"}
                  </span>

                  <span>•</span>

                  <span>
                    <Package size={14} />
                    {(order.items || []).length} Items
                  </span>
                </div>

                <div className="price-row">
                  <strong>
                    {formatCurrency(
                      order.total_price || order.total
                    )}
                  </strong>

                  <ChevronDown
                    className={isOpen ? "rotate" : ""}
                  />
                </div>
              </div>

              {/* EXPANDED */}
              {isOpen && (
                <div className="order-expanded">

                  <div className="items-grid">
                    {(order.items || []).map((item, i) => (
                      <div className="order-item-card" key={i}>
                        <img
                          src={
                            item.product?.image_url ||
                            "https://via.placeholder.com/100"
                          }
                          alt={item.product?.name}
                        />

                        <div>
                          <h4>{item.product?.name}</h4>
                          <p>Qty: {item.quantity}</p>
                          <strong>
                            {formatCurrency(item.price)}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ACTIONS */}
                  {order.status !== "cancelled" &&
                    order.status !== "delivered" && (
                      <div className="order-actions">
  <button
    className="primary-btn"
    onClick={() => reorder(order)}
  >
    Buy Again
  </button>

  <button
    className="secondary-btn cancel-btn"
    onClick={() => cancelOrder(id)}
    disabled={cancelLoading === id}
  >
    {cancelLoading === id ? "Cancelling..." : "Cancel Order"}
  </button>
</div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default OrderHistory;