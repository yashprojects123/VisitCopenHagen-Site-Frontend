import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import { createContext, useEffect, useState } from "react";
import { fetchSiteSettings } from "./Utils/fetchSiteSettings.js";
import { fetchAllUsers } from "./Utils/fetchAllUsers.js";
import { Toaster } from "react-hot-toast";
import { api } from "./Services/axiosInstance.js"; // Import the centralized axios instance

export const BasicSettingsContext = createContext();

function App() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [users, setUsers] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const { pathname } = useLocation();
	const [isAuthenticated, setIsAuthenticated] = useState(false);



  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsAuthenticated(false);
        setCurrentUserData(null);
        return;
      }

      try {
  
        const res = await api.get("/api/check-auth");
        console.log(res.data)
        if (res.data?.isAuthenticated && res.data?.user) {
          setIsAuthenticated(true);
          setCurrentUserData(res.data.user); // Store the user data
        } else {
          // If the token exists but the backend says not authenticated, log out
          localStorage.removeItem("accessToken");
          setIsAuthenticated(false);
          setCurrentUserData(null);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
        // Interceptor handles 401 and redirect to login
        // For other errors, ensure user is logged out
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        setCurrentUserData(null);
      }
    };

    checkAuthStatus();
  }, []);



  useEffect(() => {

		// Fetch site settings and users data
    const fetchData = async () => {
      try {
        const [siteRes, usersRes] = await Promise.all([
          fetchSiteSettings(),
          fetchAllUsers(),
        ]);

        if (!siteRes.error) setSiteSettings(siteRes.data);
        if (!usersRes.error) setUsers(usersRes.users);

        // Optionally log errors for debugging
        if (siteRes.error) console.error("Site settings fetch error:", siteRes.error);
        if (usersRes.error) console.error("Users fetch error:", usersRes.error);
      } catch (err) {
        console.error("Unexpected error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <BasicSettingsContext.Provider value={{ siteSettings,currentUserData, setCurrentUserData,users,isAuthenticated,setIsAuthenticated, setSiteSettings }}>
      {!pathname.includes("/admin") && <Header />}

      <main className="main-content">
        <Outlet />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
      </main>

      {!pathname.includes("/admin") && <Footer />}
    </BasicSettingsContext.Provider>
  );
}

export default App;
