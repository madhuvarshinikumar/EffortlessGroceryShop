import './CategoryCard.css';

function CategoryCard({ name, icon, onClick }) {
  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-icon">{icon}</div>
      <h3 className="category-name">{name}</h3>
    </div>
  );
}

export default CategoryCard;
