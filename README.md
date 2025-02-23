# HelpHive Setup Guide

## Prerequisites

Ensure you have the following installed before proceeding:

- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js (LTS version)](https://nodejs.org/)
- [MongoDB Atlas Account](https://www.mongodb.com/atlas/database)
- [Pinecone Account](https://www.pinecone.io/)

## Backend Setup

### Step 1: Create a `.env` File

Navigate to the root directory of the project and create a `.env` file with the following format:

```ini
mongo_url=<YOUR_MONGODB_ATLAS_URL>
pinecone_key=<YOUR_PINECONE_API_KEY>
index_host=<YOUR_PINECONE_INDEX_HOST>
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
```

Replace the placeholders with your actual credentials.

### Step 2: Install Dependencies

Run the following command to install the required Python dependencies:

```sh
pip install -r requirements.txt
```

### Step 3: Start the Backend Server

Start the backend server using Uvicorn:

```sh
uvicorn server:app --reload
```

## Frontend Setup

### Step 1: Navigate to the Frontend Directory

Change to the frontend directory:

```sh
cd frontend
```

### Step 2: Install Dependencies

Run the following command to install frontend dependencies:

```sh
npm install
```

### Step 3: Start the Frontend Server

Run the following command to start the frontend development server:

```sh
npm run dev
```

## Running the Application

- The application should now be available at `http://localhost:3000`
