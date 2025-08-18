import React, { useState, useRef, useEffect, useContext } from "react";
import "./UserAccountDropdown.css";
import defaultUserIcon from "../../assets/images/defaultUserIcon.webp";
import Logout from "../../Pages/Logout";
import { BasicSettingsContext } from "../../App";
import { Link } from "react-router-dom";

const UserAccountDropdown = () => {
	const [open, setOpen] = useState(false);
	const menuRef = useRef();
const { isAuthenticated, currentUserData, setIsAuthenticated } = useContext(BasicSettingsContext) || {};


	  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      navigate("/logout");
    // }
  };

 const commonProps = {
    src: currentUserData?.profile_image || defaultUserIcon,
    alt: "User",
    className: "user-avatar",
    onError: (e) => { e.target.onerror = null; e.target.src = defaultUserIcon; }
  };
  console.log("Current User Data:", currentUserData);

  const renderDropdown = () => (
    <div className="dropdown">
      <div className="user-info">
        <img {...commonProps} className="user-avatar-large" />
        <div>
          <p className="user-name">{currentUserData?.username}</p>
          {currentUserData?.role === "admin" && <p className="user-role">Admin</p>}
        </div>
      </div>
      <ul className="menu-links">
        <li><Link to="/account">My Account</Link></li>
        {currentUserData?.role === "admin" && (
          <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
        )}
        <li><Link to='/logout'>Logout</Link></li>
      </ul>
    </div>
  );

  const renderPublicDropdown = () => (
    <div className="dropdown">
      <ul className="menu-links">
        <li><Link to="/login">Login</Link></li>
      </ul>
    </div>
  );

  return (
    <div className="user-menu" ref={menuRef}>
      <img
        {...commonProps}
        onClick={() => setOpen(!open)}
      />
      {open && (isAuthenticated ? renderDropdown() : renderPublicDropdown())}
    </div>
  );
};

export default UserAccountDropdown;
