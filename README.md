# ExpenseAI Planner

ExpenseAI Planner is a full-stack web application designed to help users manage their finances effectively. It leverages AI (powered by AI Together APIs) to generate personalized savings plans based on user-provided financial data. The application consists of a React-based frontend and a Flask-based backend.

## Features

- **User Authentication**: Users can register and log in to access their financial dashboard.
- **Financial Data Management**: Users can input their income, expenses, and savings goals.
- **AI-Powered Savings Plan**: The app generates a personalized savings plan using AI Together APIs.
- **Financial Summary**: Visual representation of income, expenses, and savings using charts.
- **User Settings**: Users can customize their currency, city, and country preferences.

## Project Structure

### Client (Frontend)

The frontend is built with React and Material-UI for a modern and responsive user interface.

- **Framework**: React with Vite for fast development.
- **Styling**: Material-UI and custom themes.
- **Routing**: React Router for navigation.
- **Charts**: Recharts for data visualization.

### Server (Backend)

The backend is built with Flask and provides RESTful APIs for user authentication, financial data management, and AI-powered savings plan generation.

- **Framework**: Flask with SQLite for data storage.
- **Authentication**: JWT-based authentication.
- **AI Integration**: Uses AI Together APIs to generate savings plans.

## Prerequisites

- **Node.js**: Required for running the frontend.
- **Python 3.10+**: Required for running the backend.
- **SQLite**: Used as the database for the backend.

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-repo/ExpenseAI-Planner.git
cd ExpenseAI-Planner

### Backend Setup
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

### Create .env:
Create `.env` file in the `server` directory with:

FLASK_APP=app.py
FLASK_ENV=development
AI_API_KEY=your-ai-api-key  # Replace with actual API key from AI together

### Run backend:
python app.py
flask run

### Frontend Setup
cd ../client
npm install
npm run dev

### Access
- **Frontend Application**: [http://localhost:5173](http://localhost:5173)  
- **Backend API**: [http://localhost:5000](http://localhost:5000) 

## Technologies

### Frontend
- **React** - JavaScript library for building user interfaces
- **Material-UI** - React components for faster UI development
- **Recharts** - Charting library for data visualization
- **Axios** - Promise-based HTTP client
- **React Router** - Navigation and routing for React apps

### Backend
- **Flask** - Python web framework
- **SQLite** - Lightweight database engine
- **JWT** (JSON Web Tokens) - Secure user authentication
- **Flask-CORS** - Cross-Origin Resource Sharing support
- **AI Together APIs** - AI-powered financial recommendations
