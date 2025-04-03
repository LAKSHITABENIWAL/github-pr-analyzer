import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/profile", {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      if (response.status === 401) {
        // Redirect to GitHub OAuth if unauthorized
        window.location.href = "http://localhost:3000/auth/github";
      } else if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        console.error("Failed to fetch profile:", response.status);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      window.location.href = "http://localhost:3000/auth/github";
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.profile.displayName}</h1>
      <p>Username: {user.profile.username}</p>
      <img src={user.profile.photos[0].value} alt="Profile" />
    </div>
  );
};

export default Profile;