# 🚀 Quick Start - AI Recipe Assistant

## 5-Minute Setup

### 1. Get Your Gemini API Key (2 min)
- Visit: https://makersuite.google.com/app/apikey
- Click "Create API Key"
- Copy the key

### 2. Set Environment Variable (1 min)

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY = "paste_your_key_here"
```

**Mac/Linux (Terminal):**
```bash
export GEMINI_API_KEY="paste_your_key_here"
```

### 3. Install Dependency (1 min)
```bash
pip install google-generativeai
```

### 4. Start Backend (1 min)
```bash
cd d:\Effortless_shop
python -m uvicorn app.main:app --reload
```

### 5. Start Frontend (Already done? Just run)
```bash
cd d:\Effortless_shop\frontend
npm run dev
```

## Test It!

1. Open http://localhost:5173
2. Navigate to Recipes page
3. Click the **"🤖 AI Recipe Generator"** tab
4. Type: "High protein breakfast"
5. Click: **"✨ Generate Recipe"**
6. See magic happen! ✨

## Example Prompts to Try

```
- "Quick pasta dinner for 2 people"
- "Healthy smoothie bowl"
- "Recipe using bread and cheese"
- "Sweet dessert with fruits"
- "Low-carb breakfast"
- "Beverage using tea or coffee"
```

## Features in This Release

| Feature | Status |
|---------|--------|
| Manual Recipe Builder | ✅ Improved UI |
| AI Recipe Generator | ✅ New |
| Smart Ingredient Matching | ✅ New |
| Save Recipes | ✅ Works |
| Add to Cart | ✅ Works |
| Loading States | ✅ Smooth |
| Error Handling | ✅ Complete |
| Mobile Responsive | ✅ Optimized |

## File Structure

```
d:\Effortless_shop\
├── app/
│   ├── services/
│   │   └── gemini_service.py          (NEW)
│   ├── routes/
│   │   └── recipe.py                  (UPDATED)
│   ├── schemas.py                     (UPDATED)
│   └── main.py
├── frontend/
│   └── src/
│       └── pages/
│           ├── Recipes.jsx            (UPDATED)
│           └── Recipes.css            (UPDATED)
└── AI_RECIPE_SETUP.md                 (NEW - Full docs)
```

## API Call Example

```javascript
// Frontend code
const response = await API.post("/ai/generate-recipe", {
  prompt: "High protein breakfast"
});

// Response:
{
  "recipe_name": "Protein Breakfast Sandwich",
  "ingredients": ["2 eggs", "bread", "cheese", ...],
  "instructions": "...",
  "matched_products": [
    {
      "product_id": 36,
      "product_name": "Bread",
      "quantity": 2,
      "price": 50.0,
      "in_stock": true
    },
    ...
  ]
}
```

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| API Key Error | Check `echo $GEMINI_API_KEY` or `echo $env:GEMINI_API_KEY` |
| Module Not Found | Run `pip install google-generativeai` |
| Slow Response | Normal (2-10 sec). Gemini API is processing |
| No Matching Products | Check if products have quantity > 0 in database |
| Tab Not Switching | Clear browser cache and refresh |

## Performance Tips

- First request takes 3-10 seconds (API processing)
- Subsequent requests are faster
- Each recipe generation is independent
- No rate limiting on local dev (add for production)

## What's New in This Version

### Backend
✅ New Gemini service with smart matching  
✅ New `/api/ai/generate-recipe` endpoint  
✅ Automatic product matching from AI ingredients  
✅ Full error handling and validation  

### Frontend
✅ Beautiful tabbed interface  
✅ Modern gradient UI with animations  
✅ Smooth loading states and spinners  
✅ Rich product matching display  
✅ Mobile-responsive design  
✅ Full error messages for debugging  

## Next Steps

1. ✅ Test the AI generator
2. ✅ Try saving recipes
3. ✅ Check "Your Recipes" section
4. ✅ Test "Add to Cart" functionality
5. 📖 Read `AI_RECIPE_SETUP.md` for full documentation

## Common Questions

**Q: Is my API key stored securely?**  
A: API key is only in environment variables, never in code or localStorage.

**Q: What happens if Gemini API is down?**  
A: You'll see an error message. Manual Recipe Builder still works.

**Q: Can I use in production?**  
A: Yes! See "Production Deployment" in `AI_RECIPE_SETUP.md`.

**Q: How much does Gemini API cost?**  
A: Free tier is generous (15 requests/min). Check Google Cloud Console for details.

**Q: Can I add more products?**  
A: Edit the list in `app/services/gemini_service.py` line 20-30.

## Production Checklist

Before going live:

- [ ] Set proper `GEMINI_API_KEY` in production environment
- [ ] Test with production database
- [ ] Add rate limiting (described in docs)
- [ ] Set up error monitoring (Sentry)
- [ ] Use HTTPS only
- [ ] Test on mobile devices
- [ ] Load test with multiple users
- [ ] Monitor API costs

## Support

📚 **Full Documentation:** Read `AI_RECIPE_SETUP.md`  
🐛 **Bugs:** Check the troubleshooting section  
💡 **Feature Requests:** See "Future Enhancements" in setup docs  

---

Enjoy your AI Recipe Assistant! 🍳✨

For detailed information, see `AI_RECIPE_SETUP.md`
