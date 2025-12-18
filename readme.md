# GitHub Issue Analyzer 🕵️‍♂️

A full-stack application that fetches issues from GitHub repositories, caches them locally, and uses an LLM (Google Gemini 2.5 Flash) to analyze them for themes and fix recommendations.

## 🚀 Features
- **Fetch & Cache**: Retrieves open issues from any public GitHub repository and stores them in a local SQLite database.
- **AI Analysis**: Uses Google Gemini 2.5 Flash to generate natural language insights from the cached issues.
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS, featuring a tabbed interface and markdown rendering.
- **Robust Backend**: Python Flask API with SQLAlchemy for reliable data persistence.

## 🛠️ Tech Stack
- **Backend**: Python, Flask, Flask-Smorest, SQLAlchemy, SQLite, Google GenAI SDK
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, TanStack Query
- **Package Managers**: `uv` (Python), `yarn` (Node.js)

---

## 🏃‍♂️ How to Run

### Prerequisites
1.  **Google API Key**: Get one from [Google AI Studio](https://aistudio.google.com/).
2.  **GitHub Token (Optional)**: Recommended for higher rate limits.

### 1. Backend Setup
Navigate to the `backend` folder:
```

cd backend

# Initialize environment and install dependencies

uv sync

# Create a .env file

echo "GOOGLE_API_KEY=your_key_here" > .env
echo "GITHUB_TOKEN=your_token_here" >> .env  \# Optional

```

Run the server:
```

uv run app.py

```
*Server will start at `http://127.0.0.1:5000`*

### 2. Frontend Setup
Navigate to the `frontend` folder:
```

cd frontend

# Install dependencies

yarn install

# Start development server

yarn dev

```
*Open your browser at `http://localhost:5173`*

---

## 💾 Local Storage Choice: SQLite

For this assignment, I chose **SQLite** over In-Memory or JSON file storage.

**Reasoning:**
1.  **Durability**: Unlike in-memory storage, data persists even if the server restarts. This allows users to scan a large repo once and analyze it multiple times later without re-fetching.
2.  **Structured Querying**: It allows efficient filtering (e.g., `SELECT DISTINCT repo`) which is harder and slower to implement with raw JSON files.
3.  **Zero Configuration**: It requires no separate server process (unlike PostgreSQL/MySQL), keeping the setup "local" and simple as requested.

---


## 🤖 Prompts Used

Below are the prompts used to build the project components one by one.

### Backend \& Database

1. "Setup a Flask application with SQLAlchemy and SQLite to store GitHub issue data."
2. "Python function to fetch all open issues from a GitHub repository URL using the requests library."
3. "How to check if a record already exists in SQLAlchemy before adding a new one."

### AI Analysis

4. "Python code to initialize Google GenAI client and send a text prompt to Gemini 2.5 Flash."
5. "Prompt template to ask an LLM to find technical themes and fix recommendations in a list of software issues."

### Frontend \& UI

6. "Create a simple React form to input a repository name and send it to a Flask backend."
7. "How to display a loading spinner in React while waiting for an API response."
8. "React component to render Markdown text with Tailwind CSS styling."
9. "How to create a tabbed navigation menu using Tailwind CSS."

---

**Assignment Completion Date**: December 18, 2025