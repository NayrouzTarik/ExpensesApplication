from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import sqlite3

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['DATABASE'] = 'expense_app.db'
AI_API_KEY = os.getenv('AI_API_KEY')
AI_API_URL = "https://api.together.xyz/v1/chat/completions"

# Database setup
def get_db():
    db = sqlite3.connect(app.config['DATABASE'])
    db.row_factory = sqlite3.Row
    return db

def init_db():
    with app.app_context():
        db = get_db()
        db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        db.execute("""
        CREATE TABLE IF NOT EXISTS financial_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            salary REAL NOT NULL,
            rent REAL NOT NULL,
            food REAL NOT NULL,
            utilities REAL NOT NULL,
            transportation REAL NOT NULL,
            other_expenses REAL NOT NULL,
            target_amount REAL NOT NULL,
            timeframe_months INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """)
        db.execute("""
        CREATE TABLE IF NOT EXISTS user_settings (
            user_id INTEGER PRIMARY KEY,
            currency TEXT DEFAULT 'USD',
            city TEXT,
            country TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """)
        db.commit()

init_db()

def create_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except:
        return None

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    db = get_db()
    try:
        password_hash = generate_password_hash(password)
        db.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (username, password_hash)
        )
        db.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    db = get_db()
    user = db.execute(
        "SELECT * FROM users WHERE username = ?", (username,)
    ).fetchone()
    
    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = create_token(user['id'])
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user_id': user['id']
    }), 200

@app.route('/api/save-financial-data', methods=['POST'])
def save_financial_data():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401
    
    user_id = verify_token(token.split()[1] if ' ' in token else token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    data = request.json
    required_fields = [
        'salary', 'rent', 'food', 'utilities', 
        'transportation', 'other_expenses', 
        'target_amount', 'timeframe_months'
    ]
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    db = get_db()
    try:
        db.execute(
            """
            INSERT INTO financial_data 
            (user_id, salary, rent, food, utilities, transportation, other_expenses, target_amount, timeframe_months)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id, data['salary'], data['rent'], data['food'],
                data['utilities'], data['transportation'], data['other_expenses'],
                data['target_amount'], data['timeframe_months']
            )
        )
        db.commit()
        return jsonify({'message': 'Financial data saved successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/save-settings', methods=['POST'])
def save_settings():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401
    
    user_id = verify_token(token.split()[1] if ' ' in token else token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    data = request.json
    db = get_db()
    
    try:
        db.execute(
            """
            INSERT OR REPLACE INTO user_settings 
            (user_id, currency, city, country)
            VALUES (?, ?, ?, ?)
            """,
            (user_id, data.get('currency', 'USD'), 
             data.get('city'), data.get('country'))
        )
        db.commit()
        return jsonify({'message': 'Settings saved successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-settings', methods=['GET'])
def get_settings():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401
    
    user_id = verify_token(token.split()[1] if ' ' in token else token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    db = get_db()
    settings = db.execute(
        "SELECT currency, city, country FROM user_settings WHERE user_id = ?",
        (user_id,)
    ).fetchone()
    
    return jsonify(dict(settings) if settings else {
        'currency': 'USD',
        'city': None,
        'country': None
    }), 200
@app.route('/api/generate-plan', methods=['POST'])
def generate_plan():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401
    
    user_id = verify_token(token.split()[1] if ' ' in token else token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    db = get_db()
    settings = db.execute(
        "SELECT currency, city, country FROM user_settings WHERE user_id = ?",
        (user_id,)
    ).fetchone()
    settings = dict(settings) if settings else {'currency': 'USD'}
    
    # Prepare prompt with location context
    location = ""
    if settings.get('city') and settings.get('country'):
        location = f"{settings['city']}, {settings['country']}"
    elif settings.get('city'):
        location = settings['city']
    elif settings.get('country'):
        location = settings['country']
    
    prompt = f"""
        Create a precise, actionable savings plan based on these financial details (Currency: {settings.get('currency', 'USD')}):

        Location: {location or 'Not specified'}
        Monthly Income: {settings.get('currency', '$')}{data.get('salary', 0)}
        Monthly Expenses:
        - Rent: {settings.get('currency', '$')}{data.get('rent', 0)}
        - Food: {settings.get('currency', '$')}{data.get('food', 0)}
        - Utilities: {settings.get('currency', '$')}{data.get('utilities', 0)}
        - Transportation: {settings.get('currency', '$')}{data.get('transportation', 0)}
        - Other: {settings.get('currency', '$')}{data.get('other_expenses', 0)}
        Savings Goal: {settings.get('currency', '$')}{data.get('target_amount', 0)} in {data.get('timeframe_months', 6)} months

        Generate a practical plan with these components:

        1. Current Financial Situation
        - Available monthly savings: [calculated amount]
        - Percentage of income going to expenses: [calculated percentage]
        - Comparison to typical costs in {location.split(',')[0] if location else 'your area'}

        2. Monthly Savings Plan
        - Required monthly savings: [calculated amount]
        - Suggested percentage to save from income: [calculated percentage]
        - Recommended allocation across expense categories

        3. Expense Reduction Strategies for {location.split(',')[0] if location else 'your location'}
        - Housing: [1-2 specific suggestions based on location]
        - Food: [local market or shopping tips]
        - Transportation: [city-specific options]
        - Utilities: [area-specific conservation programs]

        4. Timeline
        - Month-by-month savings targets
        - Key milestones with dates
        - Adjustments for seasonal expenses in {location.split(',')[0] if location else 'the area'}

        5. Practical Implementation
        - Recommended local banks/credit unions
        - Specific budgeting tools that work with {settings.get('currency', 'USD')}
        - Local resources for financial counseling if available

        Provide only the raw plan content without:
        - Section headers or titles
        - Emojis or decorative elements
        - Generic financial advice

        Focus exclusively on actionable steps tailored to:
        - The specified income level
        - The local economy of {location or 'the region'}
        - The requested {data.get('timeframe_months', 6)} month timeframe
        - Practical daily implementation
        """
    
    headers = {
        "Authorization": f"Bearer {AI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "meta-llama/Llama-3-70b-chat-hf",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 1500
    }
    
    try:
        response = requests.post(AI_API_URL, headers=headers, json=payload)
        ai_response = response.json()
        plan = ai_response['choices'][0]['message']['content']
        
        return jsonify({'plan': plan}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/financial-history', methods=['GET'])
def get_financial_history():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401
    
    user_id = verify_token(token.split()[1] if ' ' in token else token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    db = get_db()
    history = db.execute(
        """
        SELECT salary, rent, food, utilities, transportation, other_expenses,
               target_amount, timeframe_months, created_at
        FROM financial_data
        WHERE user_id = ?
        ORDER BY created_at DESC
        """,
        (user_id,)
    ).fetchall()
    
    return jsonify([dict(row) for row in history]), 200

if __name__ == '__main__':
    app.run(debug=True)
