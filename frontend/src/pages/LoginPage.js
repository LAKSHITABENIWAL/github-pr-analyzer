import React from "react";

const LoginPage = () => {
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3000/auth/github";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome to GitHub PR Analyzer</h2>
        <p style={styles.description}>
          Analyze and manage your GitHub Pull Requests efficiently
        </p>
        <button onClick={handleGitHubLogin} style={styles.button}>
          <svg style={styles.githubIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Login with GitHub
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "#f6f8fa"
  },
  card: {
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%"
  },
  title: {
    margin: "0 0 16px 0",
    color: "#24292e",
    fontSize: "24px"
  },
  description: {
    margin: "0 0 24px 0",
    color: "#586069",
    fontSize: "16px"
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "12px 24px",
    backgroundColor: "#24292e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#2c974b"
    }
  },
  githubIcon: {
    width: "20px",
    height: "20px",
    marginRight: "8px"
  }
};

export default LoginPage;
