import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {api} from "../Services/axiosInstance"; // 👈 Import the centralized axios instance
import AuthorizedMessage from "../Pages/AuthForm/AuthorizedMessage";
import Loader from "./Loader/Loader";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // Allow access to the login page without an authentication check
      if (location.pathname === "/login") {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
        setIsLoading(false);
        return;
      }

      try {
        // Use the 'api' instance, which automatically adds the token and handles refresh
        const res = await api.get("/api/check-auth");
        
        if (res.data?.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          // This else block handles unexpected responses where the token is valid but isAuthenticated is false
          setIsAuthenticated(false);
          toast.error("Authentication failed. Please login again.");
          navigate("/login", { replace: true });
        }
      } catch (err) {
        // The interceptor handles the 401 (token invalid/expired) by refreshing or redirecting.
        // For any other unexpected error, we'll assume the user is not authenticated.
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  // Handle rendering logic
  if (isLoading) {
    return <Loader />;
  }

  // If the user is authenticated, render the children
  if (isAuthenticated) {
    return children;
  }

  // If the user is on the login page and not authenticated, render it
  if (!isAuthenticated && location.pathname === "/login") {
    return children;
  }
  
  // For all other cases, show an unauthorized message
  return <AuthorizedMessage message="Unauthorized: Please login to access this page." />;
};

export default ProtectedRoute;