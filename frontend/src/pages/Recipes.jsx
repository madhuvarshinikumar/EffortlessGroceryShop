import { useEffect, useMemo, useState } from "react";
import API from "../api";
import { toast } from "react-hot-toast";
import "./Recipes.css";

function Recipes() {
  // Tab state
  const [activeTab, setActiveTab] = useState("manual"); // "manual" or "ai"

  // Shared state
  const [products, setProducts] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Manual recipe builder state
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [addingRecipeId, setAddingRecipeId] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  // AI recipe generator state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecipe, setAiRecipe] = useState(null);
  const [aiMatchedProducts, setAiMatchedProducts] = useState([]);
  const [aiSelectedItems, setAiSelectedItems] = useState([]);
  const [aiRecipeName, setAiRecipeName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const parseResponse = (res) => res.data?.data ?? res.data ?? [];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productRes, recipeRes] = await Promise.all([
        API.get("/products"),
        API.get("/recipes"),
      ]);

      setProducts(parseResponse(productRes));
      setRecipes(parseResponse(recipeRes));
    } catch (err) {
      console.error("Failed to load recipes or products:", err);
      toast.error("Unable to load recipe data. Please refresh the page.");
      setProducts([]);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // MANUAL RECIPE BUILDER
  // ===========================

  const availableProducts = useMemo(
    () => products.filter((product) => product.quantity > 0),
    [products]
  );

  const toggleSelection = (product) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.product_id === product.id);
      if (exists) {
        return prev.filter((item) => item.product_id !== product.id);
      }
      return [...prev, { product_id: product.id, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(1, Number(value)) }
          : item
      )
    );
  };

  const removeSelected = (productId) => {
    setSelectedItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const createRecipe = async () => {
    if (!recipeName.trim() || !instructions.trim() || selectedItems.length === 0) {
      toast.error("Please provide a name, instructions, and at least one product.");
      return;
    }

    setSavingRecipe(true);
    try {
      await API.post("/recipes", {
        name: recipeName,
        instructions,
        items: selectedItems,
      });

      toast.success("Recipe saved successfully.");
      setRecipeName("");
      setInstructions("");
      setSelectedItems([]);
      fetchData();
    } catch (err) {
      console.error("Create recipe failed:", err);
      toast.error("Could not save recipe. Please try again.");
    } finally {
      setSavingRecipe(false);
    }
  };

  const selectedMap = useMemo(
    () => new Map(selectedItems.map((item) => [item.product_id, item.quantity])),
    [selectedItems]
  );

  const getSelectedProduct = (productId) => products.find((product) => product.id === productId);

  // ===========================
  // AI RECIPE GENERATOR
  // ===========================

  const generateAIRecipe = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a recipe prompt or description.");
      return;
    }

    setAiLoading(true);
    try {
      const response = await API.post("/ai/generate-recipe", {
        prompt: aiPrompt,
      });

      const recipeData = response.data?.data ?? response.data;

      setAiRecipe({
        recipe_name: recipeData.recipe_name,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
      });

      // Set matched products
      const enrichedMatches = (recipeData.matched_products || []).map((match) => ({
        ...match,
        quantity: match.quantity || 1,
      }));

      setAiMatchedProducts(enrichedMatches);
      setAiSelectedItems(
        enrichedMatches.map((m) => ({
          product_id: m.product_id,
          quantity: m.quantity,
        }))
      );
      setAiRecipeName(recipeData.recipe_name);

      toast.success("Recipe generated successfully!");
    } catch (err) {
      console.error("AI recipe generation failed:", err);
      const errorMsg =
        err.response?.data?.detail || "Failed to generate recipe. Please try again.";
      toast.error(errorMsg);
      setAiRecipe(null);
      setAiMatchedProducts([]);
      setAiSelectedItems([]);
    } finally {
      setAiLoading(false);
    }
  };

  const updateAiItemQuantity = (productId, value) => {
    const qty = Math.max(1, Number(value));
    setAiSelectedItems((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const saveAiRecipe = async () => {
    if (!aiRecipeName.trim() || !aiRecipe) {
      toast.error("Please generate a recipe first.");
      return;
    }

    if (aiSelectedItems.length === 0) {
      toast.error("Please select at least one ingredient.");
      return;
    }

    setSavingRecipe(true);
    try {
      await API.post("/recipes", {
        name: aiRecipeName,
        instructions: aiRecipe.instructions,
        items: aiSelectedItems,
      });

      toast.success("AI Recipe saved successfully!");
      setAiRecipe(null);
      setAiPrompt("");
      setAiRecipeName("");
      setAiMatchedProducts([]);
      setAiSelectedItems([]);
      fetchData();
    } catch (err) {
      console.error("Save AI recipe failed:", err);
      toast.error("Could not save recipe. Please try again.");
    } finally {
      setSavingRecipe(false);
    }
  };

  const addAiRecipeToCart = async () => {
    if (aiSelectedItems.length === 0) {
      toast.error("No items selected to add to cart.");
      return;
    }

    setAddingRecipeId("ai");
    try {
      await Promise.all(
        aiSelectedItems.map((item) =>
          API.post("/add-to-cart", {
            product_id: item.product_id,
            quantity: item.quantity,
          })
        )
      );
      toast.success("Recipe items added to cart.");
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Failed to add items to cart. Please try again.");
    } finally {
      setAddingRecipeId(null);
    }
  };

  const addRecipeToCart = async (recipe) => {
    if (!Array.isArray(recipe.items) || recipe.items.length === 0) {
      toast.error("This recipe has no items to add.");
      return;
    }

    setAddingRecipeId(recipe.id);
    try {
      await Promise.all(
        recipe.items.map((item) =>
          API.post("/add-to-cart", {
            product_id: item.product_id,
            quantity: item.quantity,
          })
        )
      );
      toast.success("Recipe items added to cart.");
    } catch (err) {
      console.error("Add recipe to cart failed:", err);
      toast.error("Failed to add recipe items to cart.");
    } finally {
      setAddingRecipeId(null);
    }
  };

  if (loading) {
    return (
      <div className="recipes-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipes-page">
      {/* Hero Section */}
      <section className="recipes-hero">
        <div className="recipes-hero-content">
          <h1>🍳 Smart Recipe Builder</h1>
          <p>Create recipes manually or use AI to generate recipes instantly</p>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="recipes-tabs-section">
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
              onClick={() => setActiveTab("manual")}
            >
              <span className="tab-icon">✋</span>
              Manual Recipe Builder
            </button>
            <button
              className={`tab-button ${activeTab === "ai" ? "active" : ""}`}
              onClick={() => setActiveTab("ai")}
            >
              <span className="tab-icon">🤖</span>
              AI Recipe Generator
            </button>
          </div>

          {/* Manual Recipe Builder Tab */}
          {activeTab === "manual" && (
            <div className="tab-content manual-tab">
              <section className="recipes-container">
                <div className="recipe-builder-wrapper">
                  {/* Left Panel - Products */}
                  <div className="products-panel">
                    <div className="panel-header">
                      <h2>Select Products</h2>
                      <span className="badge">{selectedItems.length} selected</span>
                    </div>
                    <p className="panel-subtitle">Browse and choose ingredients for your recipe</p>

                    <div className="products-grid">
                      {availableProducts.length > 0 ? (
                        availableProducts.map((product) => {
                          const selected = selectedMap.has(product.id);
                          return (
                            <div
                              key={product.id}
                              className={`product-item ${selected ? "selected" : ""}`}
                              onClick={() => toggleSelection(product)}
                            >
                              <div className="product-item-icon">🛒</div>
                              <h3>{product.name}</h3>
                              <p className="product-price">₹{product.price.toFixed(2)}</p>
                              <button className={`select-btn ${selected ? "selected" : ""}`}>
                                {selected ? "✓ Selected" : "Select"}
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="no-products">
                          <p>📭 No products available yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Panel - Recipe Summary */}
                  <div className="recipe-summary-panel">
                    <div className="panel-header">
                      <h2>Create Recipe</h2>
                    </div>

                    <form className="recipe-form">
                      <div className="form-group">
                        <label htmlFor="recipeName">Recipe Name</label>
                        <input
                          id="recipeName"
                          type="text"
                          value={recipeName}
                          onChange={(e) => setRecipeName(e.target.value)}
                          placeholder="e.g., Healthy Breakfast"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="instructions">Instructions</label>
                        <textarea
                          id="instructions"
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="Add cooking notes, servings, or preparation tips..."
                          className="form-textarea"
                          rows={4}
                        />
                      </div>

                      <div className="selected-ingredients">
                        <h3>Selected Ingredients ({selectedItems.length})</h3>
                        {selectedItems.length === 0 ? (
                          <div className="empty-state">
                            <p>👈 Select products to add them here</p>
                          </div>
                        ) : (
                          <div className="ingredients-list">
                            {selectedItems.map((item) => {
                              const product = getSelectedProduct(item.product_id) || {};
                              return (
                                <div key={item.product_id} className="ingredient-row">
                                  <div className="ingredient-info">
                                    <strong>{product.name || "Unknown product"}</strong>
                                    <span className="ingredient-stock">
                                      Stock: {product.quantity ?? 0}
                                    </span>
                                  </div>
                                  <div className="ingredient-controls">
                                    <input
                                      type="number"
                                      min="1"
                                      value={item.quantity}
                                      onChange={(e) =>
                                        updateQuantity(item.product_id, e.target.value)
                                      }
                                      className="qty-input"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeSelected(item.product_id)}
                                      className="remove-btn"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={createRecipe}
                        disabled={savingRecipe || selectedItems.length === 0}
                        className="save-recipe-btn"
                      >
                        {savingRecipe ? "💾 Saving..." : "💾 Save Recipe"}
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* AI Recipe Generator Tab */}
          {activeTab === "ai" && (
            <div className="tab-content ai-tab">
              <section className="ai-recipe-container">
                {/* Prompt Input Section */}
                <div className="ai-input-section">
                  <h2>Describe Your Recipe</h2>
                  <p className="ai-subtitle">
                    Tell the AI what kind of recipe you'd like. Example: "High protein breakfast",
                    "Quick snack", "Recipe using bread and cheese"
                  </p>

                  <div className="ai-prompt-group">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Enter recipe description... (e.g., 'Vegetarian pasta with tomato sauce')"
                      className="ai-prompt-input"
                      rows={3}
                      disabled={aiLoading}
                    />
                    <button
                      onClick={generateAIRecipe}
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="generate-btn"
                    >
                      {aiLoading ? (
                        <>
                          <span className="spinner-small"></span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <span>✨</span> Generate Recipe
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Generated Recipe Display */}
                {aiRecipe && (
                  <div className="ai-recipe-result">
                    <div className="recipe-result-card">
                      <div className="recipe-header">
                        <h2 className="recipe-title">{aiRecipe.recipe_name}</h2>
                        <span className="ai-badge">AI Generated</span>
                      </div>

                      {/* Recipe Name Edit */}
                      <div className="recipe-name-edit">
                        <label>Recipe Name:</label>
                        <input
                          type="text"
                          value={aiRecipeName}
                          onChange={(e) => setAiRecipeName(e.target.value)}
                          className="recipe-name-input"
                        />
                      </div>

                      {/* Instructions */}
                      <div className="recipe-section">
                        <h3>Instructions</h3>
                        <p className="recipe-instructions-text">{aiRecipe.instructions}</p>
                      </div>

                      {/* Original Ingredients */}
                      <div className="recipe-section">
                        <h3>Ingredients</h3>
                        <div className="ingredients-list-ai">
                          {aiRecipe.ingredients.map((ingredient, idx) => (
                            <div key={idx} className="ingredient-item-ai">
                              <span className="ingredient-bullet">•</span>
                              <span>{ingredient}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Matched Products */}
                      <div className="recipe-section matched-products-section">
                        <h3>Matched Products ({aiMatchedProducts.length})</h3>
                        <p className="section-subtitle">
                          Adjust quantities and select items to add to your recipe
                        </p>

                        {aiMatchedProducts.length > 0 ? (
                          <div className="matched-products-list">
                            {aiMatchedProducts.map((product) => {
                              const selectedItem = aiSelectedItems.find(
                                (item) => item.product_id === product.product_id
                              );
                              const isSelected = !!selectedItem;

                              return (
                                <div
                                  key={product.product_id}
                                  className={`matched-product-card ${isSelected ? "selected" : ""}`}
                                >
                                  <div className="product-match-info">
                                    <div className="product-name">
                                      <strong>{product.product_name}</strong>
                                      {!product.in_stock && (
                                        <span className="out-of-stock">Out of Stock</span>
                                      )}
                                    </div>
                                    <p className="ingredient-ref">
                                      Ingredient: <em>{product.ingredient_name}</em>
                                    </p>
                                    <p className="product-meta">
                                      Price: ₹{product.price.toFixed(2)} | Available: {product.available_quantity}
                                    </p>
                                  </div>

                                  <div className="product-match-controls">
                                    <input
                                      type="number"
                                      min="1"
                                      value={selectedItem?.quantity || 1}
                                      onChange={(e) =>
                                        updateAiItemQuantity(product.product_id, e.target.value)
                                      }
                                      className="qty-input-ai"
                                    />
                                    <label className="checkbox-container">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            if (!selectedItem) {
                                              setAiSelectedItems((prev) => [
                                                ...prev,
                                                {
                                                  product_id: product.product_id,
                                                  quantity: product.quantity || 1,
                                                },
                                              ]);
                                            }
                                          } else {
                                            setAiSelectedItems((prev) =>
                                              prev.filter(
                                                (item) => item.product_id !== product.product_id
                                              )
                                            );
                                          }
                                        }}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="no-matches">
                            <p>❌ No products matched the recipe ingredients</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="recipe-actions">
                        <button
                          onClick={saveAiRecipe}
                          disabled={savingRecipe || aiSelectedItems.length === 0}
                          className="action-btn save-btn"
                        >
                          {savingRecipe ? "💾 Saving..." : "💾 Save Recipe"}
                        </button>
                        <button
                          onClick={addAiRecipeToCart}
                          disabled={addingRecipeId === "ai" || aiSelectedItems.length === 0}
                          className="action-btn cart-btn"
                        >
                          {addingRecipeId === "ai" ? "⏳ Adding..." : "🛒 Add All to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!aiRecipe && !aiLoading && (
                  <div className="empty-ai-state">
                    <div className="empty-icon">🤖</div>
                    <p>Generate your first AI recipe to get started!</p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </section>

      {/* Existing Recipes Section */}
      <section className="existing-recipes-section">
        <div className="section-header">
          <h2>📚 Your Recipes</h2>
          <p>Quick-add favorite recipes directly to your cart</p>
        </div>

        {recipes.length > 0 ? (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-card-header">
                  <div className="recipe-icon">🍽️</div>
                  <h3>{recipe.name}</h3>
                </div>

                <p className="recipe-instructions">{recipe.instructions}</p>

                <div className="recipe-items">
                  <h4>Ingredients:</h4>
                  <ul>
                    {recipe.items.map((item) => (
                      <li key={item.product_id}>
                        <span>{item.product?.name ?? `Product ${item.product_id}`}</span>
                        <span className="qty">×{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => addRecipeToCart(recipe)}
                  disabled={addingRecipeId === recipe.id}
                  className="add-to-cart-btn"
                >
                  {addingRecipeId === recipe.id ? "⏳ Adding..." : "🛒 Add All to Cart"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-recipes">
            <p>📝 No recipes created yet. Build your first recipe above!</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Recipes;
