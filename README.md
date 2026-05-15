# 🤖 AI Chat Application - Gemini Powered

A full-stack web application with a Python Flask backend and interactive frontend that uses Google's Gemini API for AI-powered conversations.

## 📋 Features

- **User Authentication**: Simple login system with demo credentials
- **AI Chat**: Real-time chat with Google Gemini API
- **Conversation History**: Maintains chat history per user
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Beautiful gradient design with smooth animations
- **Clear Chat**: Option to clear conversation history

## 🛠️ Prerequisites

- Python 3.8+
- pip (Python package manager)
- Google Gemini API Key

## 📦 Installation & Setup

### 1. Install Dependencies

Open PowerShell/Terminal in the project directory and run:

```bash
pip install -r requirements.txt
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key
4. Copy the API key

### 3. Configure Environment Variables

Edit the `.env` file and replace `your_gemini_api_key_here` with your actual API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

## 🚀 Running the Application

### 1. Start the Flask Server

```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

### 2. Open in Browser

Navigate to: `http://localhost:5000`

### 3. Login with Demo Credentials

- **Username**: `admin` | **Password**: `password123`
- **Username**: `user` | **Password**: `user123`

## 📁 Project Structure

```
projet 1/
├── app.py                 # Flask backend with Gemini API
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables (add your API key)
├── .gitignore            # Git ignore file
├── templates/
│   └── index.html        # HTML template
├── static/
│   ├── style.css         # Styling
│   └── script.js         # Frontend JavaScript
└── README.md            # This file
```

## 🔑 Demo Credentials

| Username | Password     |
|----------|-------------|
| admin    | password123 |
| user     | user123     |

## 🌐 API Endpoints

### `/` (GET)
Returns the main chat interface

### `/login` (POST)
**Request:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Login successful"
}
```

### `/chat` (POST)
**Request:**
```json
{
  "message": "Your message here",
  "username": "admin"
}
```

**Response:**
```json
{
  "ok": true,
  "reply": "AI response here"
}
```

### `/clear-chat` (POST)
**Request:**
```json
{
  "username": "admin"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Chat cleared"
}
```

## 🔐 Security Notes

⚠️ **Important**: This demo uses simple credentials. For production:
- Use proper user authentication (JWT, OAuth, etc.)
- Hash passwords with bcrypt
- Use environment variables for all secrets
- Add rate limiting
- Implement proper error handling
- Use HTTPS

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'google'"
**Solution**: Run `pip install -r requirements.txt` again

### Issue: "GEMINI_API_KEY is not set"
**Solution**: Make sure `.env` file has your actual API key

### Issue: "Connection refused at localhost:5000"
**Solution**: Make sure Flask is running (`python app.py`)

### Issue: AI not responding
**Solution**: Check that your Gemini API key is valid and has not exceeded usage limits

## 📚 Customization

### Change Login Credentials
Edit the `USERS` dictionary in `app.py`:

```python
USERS = {
    "your_username": "your_password",
    "another_user": "another_password"
}
```

### Change AI Model
In `app.py`, change the model name:

```python
model = genai.GenerativeModel("gemini-pro")  # or "gemini-pro-vision"
```

### Customize UI Colors
Edit `static/style.css` and change the gradient colors:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 🚀 Deployment

To deploy to a production server:

1. Set `debug=False` in `app.py`
2. Use a production WSGI server (gunicorn, uWSGI)
3. Set up a reverse proxy (nginx)
4. Use HTTPS with SSL certificates
5. Store secrets in environment variables

Example with Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 📝 License

This project is open source and available under the MIT License.

## 💡 Tips

- Use "Clear Chat" to start a fresh conversation
- The AI maintains conversation context within a session
- Type messages and press Enter or click Send
- Logout to switch users or start fresh

Enjoy your AI Chat! 🚀
