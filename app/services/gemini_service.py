import os
import json

from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()


class GeminiRecipeService:

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")

        genai.configure(api_key=api_key)

        self.model = genai.GenerativeModel("gemini-2.5-flash")

        self.available_products = {
            "Rice",
            "Milk",
            "Sugar",
            "Salt",
            "Pepper",
            "Ghee",
            "Tomato",
            "Onion",
            "Tea",
            "Coffee",
            "Oil",
            "Butter",
            "Paneer",
            "Cheese",
            "Eggs",
            "Potato",
            "Carrot",
            "Beans",
            "Bread",
            "Honey",
            "Jam",
            "Peanut Butter",
            "Curd",
            "Noodles",
            "Pasta"
        }

    def generate_recipe(self, user_prompt: str) -> dict:

        prompt = f"""
Generate a recipe for:

{user_prompt}

Only use ingredients from:

{', '.join(sorted(self.available_products))}

Return ONLY valid JSON:

{{
    "recipe_name": "Recipe Name",
    "ingredients": [
        "2 slices Bread",
        "1 tbsp Butter"
    ],
    "instructions": "Step 1. Step 2. Step 3."
}}
"""

        response = self.model.generate_content(prompt)

        response_text = response.text.strip()

        if response_text.startswith("```json"):
            response_text = response_text[7:]

        if response_text.startswith("```"):
            response_text = response_text[3:]

        if response_text.endswith("```"):
            response_text = response_text[:-3]

        response_text = response_text.strip()

        return json.loads(response_text)

    def match_ingredients_with_products(
        self,
        ingredients: list[str],
        available_products: list[dict]
    ):

        matched_products = []

        for ingredient in ingredients:

            ingredient_lower = ingredient.lower()

            for product in available_products:

                if product["name"].lower() in ingredient_lower:

                    matched_products.append({
                        "product_id": product["id"],
                        "product_name": product["name"],
                        "ingredient_name": ingredient,
                        "quantity": 1,
                        "price": product["price"],
                        "available_quantity": product["quantity"],
                        "in_stock": product["quantity"] > 0
                    })

        return matched_products


def get_gemini_service():
    return GeminiRecipeService()