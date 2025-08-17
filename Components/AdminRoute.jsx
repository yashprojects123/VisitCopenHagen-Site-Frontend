import React, { useEffect, useState } from "react";
// Remove this line: import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "./Loader/Loader";
import { api } from "../src/Services/axiosInstance";

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Unauthorized: Please log in as admin");
        setTimeout(() => navigate("/", { replace: true }), 1500);
        setIsLoading(false);
        return;
      }

      try {
        // Use the centralized 'api' instance
        const res = await api.get("/api/check-auth");
        const user = res.data?.user;
        const isAuthenticated = res.data?.isAuthenticated;

        if (isAuthenticated && user?.role === "admin") {
          setIsAdmin(true);
        } else {
          toast.error("Unauthorized: Admin access required");
          setTimeout(() => navigate("/unauthorized", { replace: true }), 1500);
        }
      } catch (err) {
        // The interceptor is designed to handle this 401 error silently.
        // If this catch block is executed, it means a different kind of
        // error occurred (e.g., network error) or the refresh token also failed.
        console.error("Authentication check failed:", err);
        // The interceptor should have already handled the redirect.
        // A user-friendly message for a final fallback is good here.
        toast.error("An error occurred. Please try logging in again.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (isLoading) return <Loader />;

  if (!isAdmin) return null;

  return children;
};

export default AdminRoute;