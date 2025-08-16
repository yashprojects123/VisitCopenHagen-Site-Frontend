import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./BasicSiteSettings.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { fetchSiteSettings } from "../../../Utils/fetchSiteSettings.js";
import { BasicSettingsContext } from "../../../App.jsx";
/**
 * BasicSiteSettings component allows admin to update basic site settings like site name, logo, email, and social media links.
 */

const BasicSiteSettings = () => {
	const { siteSettings, setSiteSettings } = useContext(BasicSettingsContext);

	const [logoPreview, setLogoPreview] = useState(null);
	const [savedSettings, setSavedSettings] = useState({
		siteName: "",
		siteLogo: null,
		primaryEmailId: "",
		facebookUrl: "",
		instagramUrl: "",
	});

	// Pass defaultValues to useForm
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: savedSettings,
	});
	// Handle file input change for preview
	const handleLogoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setLogoPreview(URL.createObjectURL(file));
		} else {
			setLogoPreview(null);
		}
	};

	useEffect(() => {
		// Fetch existing settings if needed
		const fetchSettings = async () => {
			const { data, logoUrl, error } = await fetchSiteSettings();
			if (error) {
				toast.error("Error fetching settings: " + error.message);
			} else {
				reset({
					siteName: data.siteName || "",
					siteLogo: logoUrl || null,
					primaryEmailId: data.primaryEmailId || "",
					facebookUrl: data.facebookUrl || "",
					instagramUrl: data.instagramUrl || "",
				});
				setLogoPreview(logoUrl || null);
				setSavedSettings({
					siteName: data.siteName || "",
					siteLogo: logoUrl || null,
					primaryEmailId: data.primaryEmailId || "",
					facebookUrl: data.facebookUrl || "",
					instagramUrl: data.instagramUrl || "",
				});
			}
		};

		fetchSettings();
	}, []);

	useEffect(() => {
		reset(savedSettings);
		if (savedSettings && savedSettings.siteLogo) {
			setLogoPreview(savedSettings.siteLogo);
		}
	}, [savedSettings, reset]);

	const onSubmit = async (data) => {
		const isUnchanged =
			data.siteName === savedSettings.siteName &&
			data.primaryEmailId === savedSettings.primaryEmailId &&
			data.facebookUrl === savedSettings.facebookUrl &&
			data.instagramUrl === savedSettings.instagramUrl &&
			data.youtubeUrl === savedSettings.youtubeUrl &&
			(!data.siteLogo || data.siteLogo.length === 0); // no new file selected

		if (isUnchanged) {
			toast("You still have these settings!", { icon: "ℹ️" });
			return;
		}
		try {
			const formData = new FormData();
			formData.append("siteName", data.siteName);
			formData.append("facebookUrl", data.facebookUrl || "");
			formData.append("instagramUrl", data.instagramUrl || "");
			formData.append("primaryEmailId", data.primaryEmailId || "");

			if (data.siteLogo) {
				// new file selected
				formData.append("siteLogoUrl", data.siteLogo[0]);
			} else {
				formData.append("siteLogoUrl", null);
			}

			formData.forEach((value, key) => {
				console.log(`${key}: ${value}`);
			});

			let settingsSaveResponse = await axios.put(
				`${import.meta.env.VITE_BACKEND_URL}/api/addSettings`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (settingsSaveResponse.data != null) {
				toast.success("Settings saved successfully!", { icon: "🎉" });
				let logoUrl = siteSettings.siteLogoUrl; // fallback to existing
				if (data.siteLogo && data.siteLogo.length > 0) {
					// create temporary preview
					logoUrl = URL.createObjectURL(data.siteLogo[0]);
				} else if (settingsSaveResponse.data.siteLogoUrl) {
					// use backend-provided URL
					logoUrl = settingsSaveResponse.data.siteLogoUrl;
				}
				setSiteSettings({
					siteName: data.siteName || "",
					siteLogoUrl: logoUrl || null,
					primaryEmailId: data.primaryEmailId || "",
					facebookUrl: data.facebookUrl || "",
					instagramUrl: data.instagramUrl || "",
					youtubeUrl: data.youtubeUrl || "",
				});
				console.log("Settings saved in context:", settingsSaveResponse.data);
			} else {
				toast.error("Failed to save settings.");
			}
		} catch (error) {
			toast.error("Error saving settings!");
		}
	};

	return (
		<section className="basic-site-settings">
			<Toaster position="top-right" />
			<h2>Basic Site Settings</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="input-group">
					<label>Site Name</label>
					<input
						type="text"
						{...register("siteName", { required: true })}
						placeholder="Enter site name"
					/>
					{errors.siteName && (
						<span className="error">Site name is required</span>
					)}
				</div>
				<div className="input-group">
					<label>Site Logo</label>
					<input
						type="file"
						accept="image/*"
						{...register("siteLogo")}
						onChange={handleLogoChange}
					/>
					{logoPreview && (
						<div className="image-preview">
							<img
								src={logoPreview}
								alt="Site Logo Preview"
								style={{
									maxWidth: "120px",
									marginTop: "10px",
									borderRadius: "8px",
									boxShadow: "0 2px 8px #0001",
								}}
							/>
						</div>
					)}
				</div>
				<div className="input-group">
					<label>Primary Email ID</label>
					<input
						type="email"
						{...register("primaryEmailId", { required: true })}
						placeholder="Enter primary email"
					/>
					{errors.primaryEmailId && (
						<span className="error">Primary email is required</span>
					)}
				</div>
				<div className="input-group">
					<label>Facebook URL</label>
					<input
						type="text"
						{...register("facebookUrl")}
						placeholder="Enter Facebook URL"
					/>
				</div>
				<div className="input-group">
					<label>Instagram URL</label>
					<input
						type="text"
						{...register("instagramUrl")}
						placeholder="Enter Instagram URL"
					/>
				</div>
				<button type="submit" className="btn">
					Save Settings
				</button>
			</form>
		</section>
	);
};

export default BasicSiteSettings;
