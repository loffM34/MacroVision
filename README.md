# Macrovision: AI-Powered Food Recognition & Nutrition Tracker

**Marcovision** is a full-stack web app developed during a hackathon that leverages AI and computer vision to analyze meals from user-uploaded photos. By training a custom food classification model using the USDA food database, Marcovision identifies food items and provides detailed nutritional facts. Users can sign up, analyze meals, and track their nutritional data through a clean and responsive UI.

## Features

- **Custom-Trained AI Model:** Detects food items in user-uploaded images using a model trained on the USDA Food Database.
- **Nutritional Breakdown:** Displays estimated calories, protein, carbs, fat, and more.
- **User Authentication:** Supabase handles account creation and login securely.
- **Meal Tracking:** Users can save analyzed meals to their account and view a history of their nutritional intake.
- **Responsive UI:** Built with Next.js and React for fast and seamless page transitions.

## Tech Stack

### Frontend
- **Next.js** (React Framework)
- **React** (with Hooks)
- **TailwindCSS** or custom styling (optional — add what you used)
- **TypeScript** (if applicable)

### Backend & Services
- **Supabase**
  - User Authentication (email/password)
  - Postgres Database for storing meal history and user info
  - Supabase Storage for optional image storage
- **Custom AI Model**
  - Trained on the USDA Food Database
  - Classifies food from images and retrieves associated nutritional values

### Machine Learning
- **Model Type:** Image classification (CNN or other architecture)
- **Training Data:** USDA Food Dataset
- **Deployment:** (If hosted separately or in-app via API, mention this)

## How It Works

1. User logs in or signs up via Supabase.
2. User uploads a food image.
3. Image is processed by the custom ML model.
4. The identified food is matched to the USDA nutritional data.
5. Nutrition info is displayed and can be saved to the user’s account.

Developed by:
Ryan Jo, Michael Dox, and Michael Loff
Hackathon: Quackhacks 2025