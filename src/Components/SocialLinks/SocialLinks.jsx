import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SocialLinks.css";
import { MdEmail } from "react-icons/md";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { BasicSettingsContext } from "../../App.jsx";

const SocialLinks = () => {
	const BasicSettingsContextObj = useContext(BasicSettingsContext);
	let siteSettings =
		BasicSettingsContextObj && BasicSettingsContextObj.siteSettings;

	let facebookUrl =
		siteSettings && siteSettings.facebookUrl ? siteSettings.facebookUrl : "/";
	let instagramUrl =
		siteSettings && siteSettings.instagramUrl ? siteSettings.instagramUrl : "/";
	let youtubeUrl =
		siteSettings && siteSettings.youtubeUrl ? siteSettings.youtubeUrl : "/";
	let primaryEmailId =
		siteSettings && siteSettings.primaryEmailId
			? siteSettings.primaryEmail
			: "/";
	return (
		<div className="social-links-wrapper">
			<div className="container">
				<div className="social-links">
					<p>
						<strong>Get Social:</strong>
					</p>
					<div className="d-flex">
						<Link to={primaryEmailId}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								version="1.1"
								width="20"
								x="0"
								y="0"
								viewBox="0 0 511.996 511.996"
							>
								<g>
									<path
										xmlns="http://www.w3.org/2000/svg"
										d="m230.9 253.371c13.369 8.913 36.827 8.914 50.199-.001.002-.001.005-.003.007-.004l227.865-151.911c-7.474-21.616-28.018-37.188-52.142-37.188h-401.663c-24.125 0-44.668 15.572-52.143 37.188l227.87 151.912c.003.002.005.002.007.004z"
										fill="#ffffff"
										data-original="#000000"
									></path>
									<path
										xmlns="http://www.w3.org/2000/svg"
										d="m297.746 278.328c-.003.002-.005.004-.007.005-11.702 7.801-26.724 11.702-41.741 11.702-15.02 0-30.036-3.9-41.739-11.703-.002-.001-.003-.002-.005-.003l-214.254-142.835v257.072c0 30.417 24.747 55.163 55.166 55.163h401.666c30.418 0 55.164-24.746 55.164-55.163v-257.072z"
										fill="#ffffff"
										data-original="#000000"
									></path>
								</g>
							</svg>
						</Link>
						<Link to={facebookUrl}>
							<FaFacebookF />
						</Link>
						<Link to={instagramUrl}>
							<FaInstagram />
						</Link>
						<Link to={youtubeUrl}>
							<FaYoutube />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SocialLinks;
