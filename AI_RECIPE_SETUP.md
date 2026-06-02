# AI-Powered Recipe Assistant - Setup Guide

## Overview

This implementation adds an AI-powered recipe generation feature to your Effortless Shop e-commerce platform. The system uses Google's Gemini API to generate recipes based on user prompts and automatically matches ingredients with products in your store.

## Features

✅ **Manual Recipe Builder** - Existing functionality with improved UI  
✅ **AI Recipe Generator** - Generate recipes using natural language prompts  
✅ **Smart Ingredient Matching** - Automatically matches AI-generated ingredients with store products  
✅ **Modern Responsive UI** - Beautiful cards, tabs, gradients, and smooth animations  
✅ **Production-Ready Code** - Full error handling and loading states  

## Architecture

### Backend Components

1. **Gemini Service** (`app/services/gemini_service.py`)
   - Integrates with Google's Gemini API
   - Generates recipes from user prompts
   - Matches ingredients with available products
   - Handles JSON parsing and validation

2. **Recipe Routes** (`app/routes/recipe.py`)
   - New endpoint: `POST /api/ai/generate-recipe`
   - Validates store inventory
   - Processes Gemini responses
   - Returns matched products

3. **Schemas** (`app/schemas.py`)
   - `AIRecipeGenerateRequest` - Request validation
   - `MatchedProductItem` - Product matching data
   - `AIRecipeGenerateResponse` - Complete response structure

### Frontend Components

1. **Recipes Component** (`frontend/src/pages/Recipes.jsx`)
   - Tabbed interface (Manual + AI)
   - AI prompt input with rich feedback
   - Recipe generation with loading states
   - Product selection and quantity adjustment
   - Save and add-to-cart functionality

2. **Styling** (`frontend/src/pages/Recipes.css`)
   - Modern gradient designs
   - Responsive grid layouts
   - Smooth animations and transitions
   - Mobile-optimized interface

## Installation & Setup

### Step 1: Install Python Dependencies

Add Gemini SDK to your requirements.txt:

```bash
pip install google-generativeai
```

Or manually install:

```bash
pip install google-generativeai==0.3.0
```

### Step 2: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

### Step 3: Configure Environment Variables

Add to your `.env` file (or environment configuration):

```env
GEMINI_API_KEY=your_api_key_here
```

**For Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY = "your_api_key_here"
```

**For Linux/Mac (Bash):**
```bash
export GEMINI_API_KEY="your_api_key_here"
```

### Step 4: Verify Installation

Test the Gemini service:

```python
# In your Python environment
from app.services.gemini_service import GeminiRecipeService

service = GeminiRecipeService()
recipe = service.generate_recipe("High protein breakfast")
print(recipe)
```

### Step 5: Run Backend

```bash
cd d:\Effortless_shop
python -m uvicorn app.main:app --reload
```

Backend will be available at: `http://localhost:8000`

### Step 6: Run Frontend

```bash
cd d:\Effortless_shop\frontend
npm install  # if needed
npm run dev
```

Frontend will be available at: `http://localhost:5173` (or similar)

## API Endpoint Documentation

### POST /api/ai/generate-recipe

Generate a recipe using AI based on user prompt.

**Request:**
```json
{
  "prompt": "High protein breakfast with eggs and bread"
}
```

**Response:**
```json
{
  "recipe_name": "Protein-Packed Breakfast Sandwich",
  "ingredients": [
    "2 slices bread",
    "2 eggs",
    "1 tablespoon butter",
    "1 slice cheese",
    "salt and pepper to taste"
  ],
  "instructions": "...",
  "matched_products": [
    {
      "product_id": 36,
      "product_name": "Bread",
      "ingredient_name": "2 slices bread",
      "quantity": 2,
      "price": 50.0,
      "available_quantity": 15,
      "in_stock": true
    },
    ...
  ]
}
```

**Status Codes:**
- `200` - Recipe generated successfully
- `400` - Empty prompt or no available products
- `422` - Invalid recipe data
- `500` - API error

## Frontend Usage

### Manual Recipe Builder Tab

1. Select products from the grid (left panel)
2. Enter recipe name and instructions (right panel)
3. Adjust quantities in the ingredient list
4. Click "Save Recipe"
5. Recipe appears in "Your Recipes" section

### AI Recipe Generator Tab

1. Enter recipe description (e.g., "Quick pasta dinner")
2. Click "✨ Generate Recipe"
3. Wait for AI to generate recipe
4. Review generated recipe name, ingredients, and instructions
5. Edit recipe name if desired
6. Select/deselect matched products
7. Adjust quantities as needed
8. Click "💾 Save Recipe" or "🛒 Add All to Cart"

## Available Products

The system recognizes these products for ingredient matching:

```
Rice, Milk, Sugar, Salt, Pepper, Ghee, Tomato, Onion, Chili Powder, 
Coriander Powder, Tea, Coffee, Oil, Butter, Paneer, Cheese, Eggs, Potato, 
Carrot, Beans, Cabbage, Cauliflower, Apple, Banana, Orange, Mango, Grapes, 
Watermelon, Pineapple, Noodles, Pasta, Peanut Butter, Green Tea, Honey, Jam, 
Bread, Cookies, Chips, Soft Drink, Juice, Curd
```

## Customization

### Add More Products

Edit `app/services/gemini_service.py`:

```python
self.available_products = {
    "Rice", "Milk", "Sugar", 
    # Add your products here
}
```

### Change AI Model

Edit `app/services/gemini_service.py`:

```python
self.model = genai.GenerativeModel("gemini-1.5-flash")  # or other models
```

### Customize Prompts

Modify the prompt template in `generate_recipe()` method to adjust AI behavior.

## Troubleshooting

### Issue: "GEMINI_API_KEY environment variable not set"

**Solution:**
```bash
# Check if env var is set
echo $GEMINI_API_KEY

# Set it (choose one):
# PowerShell:
$env:GEMINI_API_KEY = "your_key"

# Bash:
export GEMINI_API_KEY="your_key"
```

### Issue: "Invalid JSON response from Gemini"

**Solution:**
- The service handles markdown-wrapped JSON automatically
- If still failing, the Gemini API might be rate-limited
- Wait a moment and try again

### Issue: Ingredients not matching products

**Solution:**
- Ensure products are in the database with quantity > 0
- Check `app/services/gemini_service.py` for ingredient matching logic
- Add more product aliases in the matching function

### Issue: Slow API response

**Solution:**
- Gemini API calls take 2-10 seconds depending on load
- Add loading spinner (already implemented)
- Consider implementing response caching for common recipes

## Performance Optimization

### Implement Caching

Add caching for frequently generated recipes:

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def generate_recipe(prompt):
    # Will cache up to 100 prompts
    ...
```

### Batch Processing

For multiple recipe generations, use async:

```python
import asyncio

async def generate_multiple_recipes(prompts):
    tasks = [generate_recipe(p) for p in prompts]
    return await asyncio.gather(*tasks)
```

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Validate user input** - Already implemented
3. **Rate limiting** - Consider adding if high traffic
4. **HTTPS only** - Use in production
5. **Sanitize responses** - Already implemented

## Database Schema

No new tables required. The system uses existing:

- `products` - Store inventory
- `recipes` - Save user recipes
- `recipe_items` - Link recipes to products

## Testing

### Manual Testing Prompts

Try these prompts to test:

1. "High protein breakfast"
2. "Quick snack under 5 minutes"
3. "Recipe using bread and cheese"
4. "Vegetarian pasta dinner"
5. "Sweet dessert with fruits"
6. "Coffee and tea based recipes"

### API Testing with cURL

```bash
curl -X POST http://localhost:8000/api/ai/generate-recipe \
  -H "Content-Type: application/json" \
  -d '{"prompt":"High protein breakfast"}'
```

## Production Deployment

### Environment Variables

Set these in your production environment:

```env
GEMINI_API_KEY=your_production_key
DATABASE_URL=your_production_db
ENVIRONMENT=production
```

### Rate Limiting

Add rate limiting middleware:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/ai/generate-recipe")
@limiter.limit("5/minute")
def generate_ai_recipe(...):
    ...
```

### Error Monitoring

Implement error tracking (e.g., Sentry):

```python
import sentry_sdk

sentry_sdk.init("your_sentry_dsn")

try:
    recipe = service.generate_recipe(prompt)
except Exception as e:
    sentry_sdk.capture_exception(e)
```

## Support & Maintenance

### Update Gemini SDK

```bash
pip install --upgrade google-generativeai
```

### Monitor API Costs

Track Gemini API usage in [Google Cloud Console](https://console.cloud.google.com)

### Regular Testing

Run tests weekly to ensure:
- Products are properly stored
- API responses are valid
- Ingredient matching works correctly

## Code Files Modified/Created

### Created Files
- `app/services/gemini_service.py` - Gemini integration service

### Modified Files
- `app/routes/recipe.py` - Added AI endpoint
- `app/schemas.py` - Added AI schemas
- `frontend/src/pages/Recipes.jsx` - Updated component with tabs
- `frontend/src/pages/Recipes.css` - Added modern UI styles

### Unchanged Files
- `app/models.py` - No changes needed
- `app/database.py` - No changes needed
- Other components - No changes needed

## Future Enhancements

1. **Recipe Personalization**
   - Save user preferences
   - Generate based on dietary restrictions
   - Include calorie/nutrition info

2. **Social Features**
   - Share recipes
   - Rate recipes
   - Recipe collections

3. **Advanced Matching**
   - Fuzzy matching for ingredients
   - Substitute suggestions
   - Dietary filters

4. **Mobile App**
   - Native iOS/Android app
   - Offline recipe access
   - Barcode scanning

## License

This implementation is part of the Effortless Shop e-commerce platform.

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review Gemini API documentation
3. Check FastAPI documentation
4. Review React documentation

---

**Last Updated:** June 1, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
