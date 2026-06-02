import './Banner.css';

function Banner() {
  const banners = [
    {
      id: 1,
      title: 'Get groceries in 10 minutes',
      subtitle: 'Fast & Fresh Delivery',
      bgColor: 'linear-gradient(135deg, #f7c400 0%, #f0b800 100%)',
      icon: '⚡'
    },
    {
      id: 2,
      title: '50% OFF on vegetables',
      subtitle: 'Today\'s Special Deal',
      bgColor: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      icon: '🥦'
    },
    {
      id: 3,
      title: 'Free Delivery',
      subtitle: 'On orders above ₹499',
      bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #ee5a52 100%)',
      icon: '🚚'
    }
  ];

  return (
    <section className="banner-section">
      <div className="banner-container">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="banner-card"
            style={{ background: banner.bgColor }}
          >
            <div className="banner-icon">{banner.icon}</div>
            <div className="banner-content">
              <h2 className="banner-title">{banner.title}</h2>
              <p className="banner-subtitle">{banner.subtitle}</p>
            </div>
            <button className="banner-btn">Shop Now →</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Banner;
