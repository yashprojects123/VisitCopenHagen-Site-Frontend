import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthorizedMessage from "../Pages/AuthForm/AuthorizedMessage";
import Loader from "./Loader/Loader"; // optional spinner component

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");

      // If no token and trying to access protected route, redirect
      if (!token && location.pathname !== "/login") {
        navigate("/login", { replace: true });
        setIsLoading(false);
        return;
      }

      try {
        if (token) {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/check-auth`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );

          if (res.data?.isAuthenticated) {
            setIsAuthenticated(true);

            // Refresh token if provided
            if (res.data.accessToken) {
              localStorage.setItem("accessToken", res.data.accessToken);
              axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
            }

            // If user is on login page, redirect to home
            if (location.pathname === "/login") {
              toast("Already logged in");
              navigate("/", { replace: true });
            }
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  if (isLoading) return <Loader />; 

  if (!isAuthenticated && location.pathname === "/login") {
    return children; // allow login page
  }

  if (!isAuthenticated && location.pathname !== "/login") {
    return (
      <AuthorizedMessage message="Unauthorized: Please login to access this page." />
    );
  }

  return children; // render protected page
};

export default ProtectedRoute;
