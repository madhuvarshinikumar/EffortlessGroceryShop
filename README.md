# EffortlessGroceryShop
# 🛒 Effortless Grocery Shop

A modern full-stack grocery e-commerce platform built using React, FastAPI, and PostgreSQL. The application provides a seamless online grocery shopping experience with secure user authentication, intelligent product management, order tracking, and AI-powered recipe recommendations based on available ingredients.

---

# Table of Contents

* Overview
* Key Features
* System Architecture
* Technology Stack
* Project Structure
* Installation
* Environment Variables
* Running the Application
* API Documentation
* Database Design
* AI Recipe Recommendation
* Future Enhancements
* Screenshots
* Contributing
* License
* Author

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

# Installation

## Clone the Repository

```bash
git clone https://github.com/USERNAME/EffortlessGroceryShop.git
cd EffortlessGroceryShop
```

---

## Backend Setup

Create a virtual environment.

```bash
python -m venv venv
```

Activate the environment.

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run the backend server.

```bash
uvicorn main:app --reload
```

---

## Frontend Setup

Navigate to the frontend folder.

```bash
cd frontend
```

Install packages.

```bash
npm install
```

Run the development server.

```bash
npm run dev
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

# Future Enhancements

* Online Payment Gateway
* Wishlist
* Product Reviews and Ratings
* Admin Dashboard
* Inventory Management
* Email Notifications
* Discount Coupons
* Delivery Tracking
* Product Recommendation System
* Dark Mode
* Multi-language Support

---

# Screenshots



---



# License

This project is intended for educational and learning purposes.

---

# Author

**Madhuvarshini Kumar**

Bachelor of Technology – Computer Science and Engineering

Passionate about Full-Stack Development, Artificial Intelligence, and Software Engineering.

GitHub: https://github.com/YOUR_USERNAME
