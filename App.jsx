import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import { createContext, useEffect, useState } from "react";
import { fetchSiteSettings } from "./Utils/fetchSiteSettings.js";
import { fetchAllUsers } from "./Utils/fetchAllUsers.js";
import { Toaster } from "react-hot-toast";

export const BasicSettingsContext = createContext();

function App() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [users, setUsers] = useState(null);
  const { pathname } = useLocation();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {

		// check access token is in localStorage
		const token = localStorage.getItem("accessToken");
		if(token) {
			setIsAuthenticated(true);
		}
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
    <BasicSettingsContext.Provider value={{ siteSettings, users,setUser,isAuthenticated,setIsAuthenticated, setSiteSettings }}>
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
