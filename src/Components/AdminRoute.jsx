import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "./Loader/Loader";

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("accessToken");

      // No token → show toast and redirect to home after 1.5s
      if (!token) {
        toast.error("Unauthorized: Please login as admin");
        setTimeout(() => navigate("/", { replace: true }), 1500);
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/check-auth`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const user = res.data?.user;
        const isAuthenticated = res.data?.isAuthenticated;

        if (isAuthenticated && user?.role === "admin") {
          setIsAdmin(true); // render children
        } else {
          // Non-admin → show toast and redirect to /unauthorized after 1.5s
          toast.error("Unauthorized: Admin access required");
          setTimeout(() => navigate("/unauthorized", { replace: true }), 1500);
        }
      } catch (err) {
        toast.error("Unauthorized: Please login as admin");
        setTimeout(() => navigate("/", { replace: true }), 1500);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (isLoading) return <Loader />;

  // Only render children for admin
  if (!isAdmin) return null;

  return children;
};

export default AdminRoute;
