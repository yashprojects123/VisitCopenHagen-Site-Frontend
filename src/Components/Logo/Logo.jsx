import React, { useContext, useEffect } from "react";
import "./Logo.css";
import logoImg from "../../assets/images/logo.svg";
import { Link, useLocation } from "react-router-dom";

import logoImage from "../../assets/images/logo.svg";
import { BasicSettingsContext } from "../../App.jsx";
const Logo = () => {
	let location = useLocation();
	const BasicSettingsContextObj = useContext(BasicSettingsContext);
	let siteSettings =
		BasicSettingsContextObj && BasicSettingsContextObj.siteSettings;

	const logoSrc =
		siteSettings && siteSettings.siteLogoUrl
			? siteSettings.siteLogoUrl
			: logoImage;
			console.log(siteSettings);
	return (
		<Link
			to='/'
			className="site-logo"
		>
			<img src={logoSrc} alt="logo-img" />
		</Link>
	);
};

export default Logo;
