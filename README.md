# EffortlessGroceryShop
# 🛒 Effortless Grocery Shop

A modern full-stack grocery e-commerce platform built using React, FastAPI, and PostgreSQL. The application provides a seamless online grocery shopping experience with secure user authentication, intelligent product management, order tracking, and AI-powered recipe recommendations based on available ingredients.

---

# Overview

Effortless Grocery Shop is designed to simplify the grocery shopping experience by enabling customers to browse products, manage shopping carts, place orders, and receive personalized recipe suggestions.

The project follows a **client-server architecture**, where the React frontend communicates with a FastAPI backend through REST APIs. PostgreSQL is used for persistent data storage, while Google's Gemini API powers the recipe recommendation feature.

---

# Key Features

## User Authentication

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes
* User Profile Management

## Product Management

* Browse Products
* Product Details
* Product Categories
* Search Products
* Responsive Product Cards

## Shopping Cart

* Add to Cart
* Remove from Cart
* Update Quantity
* View Cart Summary

## Order Management

* Secure Checkout
* Place Orders
* Order History
* Track Previous Purchases

## AI Recipe Recommendation

* Suggest recipes from available ingredients
* AI-generated cooking instructions
* Ingredient-based recommendations
* Powered by Google Gemini

## Responsive Design

* Desktop Support
* Tablet Support
* Mobile Friendly Interface

---

# System Architecture

```
                    React Frontend
                           │
                    Axios REST API
                           │
                     FastAPI Backend
        ┌──────────────┼──────────────┐
        │              │              │
 Authentication    Business Logic   AI Service
        │              │              │
        └──────────────┼──────────────┘
                       │
                  PostgreSQL Database
```

---

# Technology Stack

## Frontend

* React
* Vite
* JavaScript (ES6+)
* Axios
* CSS3
* React Context API

## Backend

* FastAPI
* Python
* SQLAlchemy
* Pydantic
* Uvicorn

## Database

* PostgreSQL

## Artificial Intelligence

* Google Gemini API


# Project Structure

```
EffortlessGroceryShop/

├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---



# Environment Variables

Create a `.env` file in the backend directory.

Example:

```
DATABASE_URL=your_database_connection
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=your_google_gemini_api_key
```

---

# Running the Application

Backend

```
http://localhost:8000
```

Frontend

```
http://localhost:5173
```

FastAPI Swagger Documentation

```
http://localhost:8000/docs
```

---

# API Modules

The backend exposes REST APIs for:

* Authentication
* Product Management
* Shopping Cart
* Orders
* AI Recipe Recommendation

---

# Database Design

Main database entities include:

* Users
* Products
* Cart
* Orders
* Order Items

The database is managed using SQLAlchemy ORM with PostgreSQL.

---

# AI Recipe Recommendation

The application integrates Google's Gemini API to generate recipes dynamically based on user-selected grocery items or ingredients.

Capabilities include:

* Personalized recipe suggestions
* Cooking instructions
* Ingredient recommendations
* Meal preparation guidance

---

