import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { toast } from "react-hot-toast";

function Profile() {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [userRes, ordersRes] = await Promise.all([API.get("/me"), API.get("/orders")]);
      setUser(userRes.data);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
    } catch (err) {
      console.error("Profile load failed:", err);
      toast.error("Could not load profile." );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-card page-card-wide profile-shell">
        <div className="profile-top">
          <div className="profile-card">
            <div className="profile-avatar">{user?.username?.[0]?.toUpperCase() || "U"}</div>
            <div>
              <p className="eyebrow">Your profile</p>
              <h1>{user?.username || "Guest"}</h1>
              <p className="small-text">{user?.email || "No email available"}</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>

        <div className="profile-sections">
          <section className="profile-section">
            <h2>Saved addresses</h2>
            <div className="address-card">
              <p>Home</p>
              <p>123 Grocery Lane, Kitchen City</p>
              <p className="small-text">Default delivery address</p>
            </div>
          </section>

          <section className="profile-section">
            <h2>Recent orders</h2>
            {orders.length === 0 ? (
              <p className="small-text">No orders yet. Shop now to see your order history here.</p>
            ) : (
              orders.slice(0, 4).map((order) => (
                <div key={order.id} className="order-summary-card">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p className="small-text">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <span>{order.status}</span>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
