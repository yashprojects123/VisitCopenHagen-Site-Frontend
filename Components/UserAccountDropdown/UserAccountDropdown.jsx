import React, { useState, useRef, useEffect, useContext } from "react";
import "./UserAccountDropdown.css";
import defaultUserIcon from "../../assets/images/defaultUserIcon.webp";
import Logout from "../../Pages/Logout";
import { BasicSettingsContext } from "../../App";
import { Link } from "react-router-dom";

const UserAccountDropdown = () => {
	const [open, setOpen] = useState(false);
	const [currentUserData, setCurrentUserData] = useState(null);
	const menuRef = useRef();
	const BasicSettingsContextObj = useContext(BasicSettingsContext);
	const userAuthenticated = BasicSettingsContextObj && BasicSettingsContextObj.isAuthenticated;
	const setIsAuthenticated = BasicSettingsContextObj && BasicSettingsContextObj.setIsAuthenticated;
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

	useEffect(() => {
		async function fetchUserData() {
			const token = localStorage.getItem("accessToken");
			if (!token){
				setIsAuthenticated(false);
			}else{
			let userId = null;
			try {
				const payload = JSON.parse(atob(token.split(".")[1]));
				userId = payload.user_id || payload.id || payload.sub;
			} catch {
				userId = null;
			}
			if (!userId) {
				setIsAuthenticated(false);
				console.error("user ID not found in token");
			}else{
							try {
				const response = await fetch(
					`${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}`
				);
				const data = await response.json();
				if (data && data.user_data) {
					setCurrentUserData(data.user_data);
				}
			} catch{
				setCurrentUserData(null);
			}
			}
		}
	}
		fetchUserData();
	}, []);



	return userAuthenticated && currentUserData ? (
		<div className="user-menu" ref={menuRef}>
			<img
				src={ currentUserData?.profilePicture || defaultUserIcon }
				alt="User"
				className="user-avatar"
				onClick={() => setOpen(!open)}
				onError={(e) => {
					e.target.onerror = null;
					e.target.src = defaultUserIcon;
				}} // Fallback if image fails
			/>
			{open && (
				<div className="dropdown">
					<div className="user-info">
						<img
							alt="User"
							src={ currentUserData?.profilePicture || defaultUserIcon }
							className="user-avatar-large"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = defaultUserIcon;
							}}
						/>
						<div>
							<p className="user-name">{currentUserData?.username}</p>
							{
								(currentUserData && currentUserData.username=='admin') 
								&&
							<p className="user-role">Admin</p>
							}
						</div>
					</div>
					<ul className="menu-links">
						<li>
							<Link to="/account">My Account</Link>
						</li>
						{
								(currentUserData && currentUserData.username=='admin') 
								&&
							<li>
							<Link to="/admin/dashboard">Admin Dashboard</Link>
						</li>
							}
						<li>
							<Link to="/logout">Logout</Link>
						</li>
					</ul>
				</div>
			)}
		</div>
	) : (
		<div className="user-menu" ref={menuRef}>
			<img
				src={defaultUserIcon}
				alt="User"
				className="user-avatar"
				onClick={() => setOpen(!open)}
				onError={(e) => {
					e.target.onerror = null;
					e.target.src = defaultUserIcon;
				}} // Fallback if image fails
			/>
			{open && (
				<div className="dropdown">
					<ul className="menu-links">
						<li>
							<Link to="/login">Login</Link>
						</li>
					</ul>
				</div>
			)}
			
		</div>
	);
};

export default UserAccountDropdown;
