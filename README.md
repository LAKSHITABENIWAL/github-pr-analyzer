# GitHub PR Analyzer

GitHub PR Analyzer is a web application that helps you analyze and manage GitHub pull requests efficiently. It leverages AI-powered analysis using Google's Gemini AI to provide insights into pull requests, including code quality, security considerations, and testing recommendations.

## Features

- **GitHub OAuth Authentication**: Securely log in with your GitHub account.
- **Pull Request Management**: View, filter, and sort pull requests by various criteria.
- **AI-Powered Analysis**: Get detailed insights into pull requests using Google's Gemini AI.
- **Customizable Filters & Sorting**: Filter PRs by status, assignee, and date range for better organization.
- **User-Friendly Dashboard**: A structured and interactive UI for seamless navigation.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **A GitHub account**
- **A Google Gemini API key**

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/LAKSHITABENIWAL/github-pr-analyzer.git
cd github-pr-analyzer
```

### 2. Set Up Environment Variables

Create a `.env` file in the `backend/` directory and add the following variables:

```plaintext
GITHUB_TOKEN=your_github_token
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SESSION_SECRET=your_session_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

### 3. Install Dependencies

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd ../frontend
npm install
```

### 4. Start the Application

#### Start the Backend Server:

```bash
cd backend
npm start
```

#### Start the Frontend:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:3001`.

## Project Structure

```
github-pr-analyzer/
├── backend/         # Backend server (Node.js + Express)
│   ├── .env         # Environment variables
│   ├── index.js     # Main server file
│   ├── package.json # Backend dependencies
│   ├── routes/      # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── aiAnalysis.js # AI analysis routes
│   │   ├── analyzePR.js  # PR analysis routes
├── frontend/        # Frontend application (React)
│   ├── public/      # Static files
│   ├── src/         # React source code
│   │   ├── components/ # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── styles/      # CSS styles
│   │   ├── App.js       # Main React component
│   │   ├── index.js     # React entry point
│   ├── package.json  # Frontend dependencies
├── .gitignore       # Git ignore file
└── README.md        # Project documentation
```

## Deployment

### Deploying the Backend
#### Option 1: Deploy on Render
- Sign up on [Render](https://render.com/)
- Create a new web service and connect your GitHub repo
- Choose **Node.js** as the runtime
- Add environment variables
- Deploy the backend

#### Option 2: Deploy on Railway
- Sign up on [Railway](https://railway.app/)
- Create a new project and connect your GitHub repo
- Add environment variables
- Deploy the backend

### Deploying the Frontend
#### Option 1: Deploy on Vercel
```bash
npm install -g vercel
cd frontend
vercel
```

#### Option 2: Deploy on Netlify
```bash
npm install -g netlify-cli
cd frontend
netlify deploy --prod
```

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For any queries, feel free to reach out via GitHub issues or email at `your-email@example.com`.

---

### **To Add and Commit Your README File**
```bash
git add README.md
git commit -m "Added project documentation"
git push origin main
```

