// src/components/AdminRoute.jsx

import React, { useEffect, useState } from "react";
// Remove this line: import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "./Loader/Loader";
// 👈 Import the custom 'api' instance
import { api } from "../Services/axiosInstance";

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
        // Use the centralized 'api' instance here
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
        // The interceptor should handle this 401. If this block is reached,
        // it's a network error or the refresh token is also invalid.
        // So, the interceptor will have already redirected,
        // making the code below largely redundant.
        console.error("Authentication check failed:", err);
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