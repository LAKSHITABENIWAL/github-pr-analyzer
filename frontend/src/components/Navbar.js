import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3000/auth/github";
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        <h1 style={styles.title}>GitHub PR Analyzer</h1>
      </Link>
      <div style={styles.rightSection}>
        {user ? (
          <div style={styles.userSection}>
            <img src={user.avatar_url} alt="Profile" style={styles.avatar} />
            <span style={styles.username}>{user.login}</span>
            <button onClick={onLogout} style={styles.button}>Logout</button>
          </div>
        ) : (
          <button onClick={handleGitHubLogin} style={styles.button}>Login with GitHub</button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#24292e",
    color: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
  },
  logo: {
    textDecoration: "none",
    color: "white"
  },
  title: {
    margin: 0,
    fontSize: "1.5rem"
  },
  rightSection: {
    display: "flex",
    alignItems: "center"
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#2ea44f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#2c974b"
    }
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    marginRight: "8px"
  },
  username: {
    fontWeight: "500"
  }
};

export default Navbar;
