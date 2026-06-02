import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h4>About Us</h4>
            <p>
              Effortless Shop brings fresh groceries to your doorstep in minutes. 
              Quality products at unbeatable prices, delivered fast.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">f</a>
              <a href="#" className="social-icon">𝕏</a>
              <a href="#" className="social-icon">📷</a>
              <a href="#" className="social-icon">in</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#products">Products</a></li>
              <li><a href="#categories">Categories</a></li>
              <li><a href="#recipes">Recipes</a></li>
              <li><a href="#offers">Offers</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#track">Track Order</a></li>
              <li><a href="#returns">Returns</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#shipping">Shipping Policy</a></li>
              <li><a href="#cancellation">Cancellation Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul className="footer-links">
              <li>📧 support@effortlessshop.com</li>
              <li>📞 1-800-SHOP-NOW</li>
              <li>📍 Available in your city</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; 2026 Effortless Shop. All rights reserved.</p>
          <p>Made with ❤️ for quick and easy grocery shopping</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
