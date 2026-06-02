import './Offers.css';

function Offers() {
  const offers = [
    {
      id: 1,
      title: 'Buy 1 Get 1',
      category: 'Snacks',
      icon: '🤝'
    },
    {
      id: 2,
      title: "Today's Deals",
      category: 'Fresh Produce',
      icon: '⚡'
    },
    {
      id: 3,
      title: 'Combo Offers',
      category: 'Dairy & Pantry',
      icon: '🎁'
    },
    {
      id: 4,
      title: 'Weekly Specials',
      category: 'Beverages',
      icon: '🌟'
    }
  ];

  return (
    <section className="offers-section">
      <div className="offers-container">
        <h2 className="offers-title">Special Offers & Deals</h2>
        <div className="offers-grid">
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <div className="offer-icon">{offer.icon}</div>
              <h3 className="offer-title">{offer.title}</h3>
              <p className="offer-category">{offer.category}</p>
              <button className="offer-btn">Explore →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Offers;
