import CategoryCard from './CategoryCard';
import './Categories.css';

function Categories() {
  const categories = [
    { id: 1, name: 'Fruits & Vegetables', icon: '🥦' },
    { id: 2, name: 'Dairy & Eggs', icon: '🥛' },
    { id: 3, name: 'Snacks', icon: '🍪' },
    { id: 4, name: 'Beverages', icon: '🧃' },
    { id: 5, name: 'Bakery', icon: '🥐' },
    { id: 6, name: 'Personal Care', icon: '🧴' }
  ];

  const handleCategoryClick = (categoryName) => {
    console.log(`Clicked: ${categoryName}`);
    // Navigate to products filtered by category
  };

  return (
    <section className="categories-section">
      <div className="categories-container">
        <h2 className="categories-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              icon={category.icon}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
