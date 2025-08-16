import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast"; // Make sure Toaster is imported

// A simple logout function to clear token and redirect
const handleLogout = (navigate) => {
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("showWelcomeMessage"); // Clear the welcome message flag too
  toast.success("Logged out successfully!");
  setTimeout(() => {
    navigate("/login");
  }, 500); // Short delay for toast to show
};

function UserAccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false); // State for welcome message
  const navigate = useNavigate();

  useEffect(() => {
    // Check for the welcome message flag on component load
    if (sessionStorage.getItem("showWelcomeMessage") === "true") {
      setShowWelcome(true);
      // Immediately remove the flag so it doesn't show again on subsequent visits
      sessionStorage.removeItem("showWelcomeMessage");
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.user_data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        localStorage.removeItem("accessToken"); // Clear invalid token
        toast.error("Session expired. Please log in again.");
        // navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]); // navigate is a dependency of useEffect

  if (loading) {
    return (
      <div className="user-account-container loading-state">
        <p>Loading your awesome profile...</p>
        <div className="spinner"></div> {/* Simple loading spinner */}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-account-container error-state">
        <p>Could not load user data. Please try logging in again.</p>
        <button onClick={() => navigate("/login")} className="btn-primary">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="user-account-container">
      <Toaster position="top-right" />
      {showWelcome && (
        <div className="welcome-banner">
          <h2>Welcome Back, {user.username}! 🎉</h2>
          <p>We're glad to see you again!</p>
        </div>
      )}

      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user.profile_image || "https://placehold.co/120x120/007bff/ffffff?text=User"}
            alt="Profile"
            className="profile-image"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/120x120/007bff/ffffff?text=User" }}
          />
          <h1 className="username">{user.username}</h1>
          <p className="role">
            {user.role ? user.role.toUpperCase() : "REGULAR USER"}
          </p>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="icon">📧</span>
            <span>{user.email}</span>
          </div>
          {user.contact_number && (
            <div className="detail-item">
              <span className="icon">📞</span>
              <span>{user.contact_number}</span>
            </div>
          )}
          {user.address && (
            <div className="detail-item">
              <span className="icon">🏠</span>
              <span>{user.address}</span>
            </div>
          )}
          {user.gender && (
            <div className="detail-item">
              <span className="icon">🚻</span>
              <span>{user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</span>
            </div>
          )}
        </div>

        <button onClick={() => handleLogout(navigate)} className="btn-logout">
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserAccountPage;
