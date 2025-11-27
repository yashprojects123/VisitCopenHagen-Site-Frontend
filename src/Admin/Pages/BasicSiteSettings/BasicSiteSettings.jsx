import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./BasicSiteSettings.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { fetchSiteSettings } from "../../../Utils/fetchSiteSettings.js";
import { BasicSettingsContext } from "../../../App.jsx";

const BasicSiteSettings = () => {
  const { setSiteSettings } = useContext(BasicSettingsContext);
  const [logoPreview, setLogoPreview] = useState(null);
  const [savedSettings, setSavedSettings] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  /** Handle logo preview */
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  /** Fetch settings on mount */
  useEffect(() => {
    (async () => {
      const { data, logoUrl, error } = await fetchSiteSettings();

      if (error) {
        toast.error("Error fetching settings: " + error.message);
        return;
      }

      const formatted = {
        siteName: data.siteName || "",
        siteLogoUrl: logoUrl || "",
        primaryEmailId: data.primaryEmailId || "",
        facebookUrl: data.facebookUrl || "",
        instagramUrl: data.instagramUrl || ""
      };

      setSavedSettings(formatted);
      reset(formatted);
      setLogoPreview(formatted.siteLogoUrl);
    })();
  }, [reset]);

  /** Refill form when saved settings change */
  useEffect(() => {
    if (savedSettings) {
      reset(savedSettings);
      setLogoPreview(savedSettings.siteLogoUrl || null);
    }
  }, [savedSettings, reset]);

  /** Upload image to server */
  const uploadLogoToServer = async (file) => {
    if (!file) return null;

    try {
      const formData = new FormData();
      formData.append("images", file);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload-images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.success) {
        return response.data.data.images[0]?.url || null;
      }

      toast.error("Logo upload failed!");
      return null;

    } catch {
      toast.error("Error uploading logo!");
      return null;
    }
  };

  /** Save settings */
  const onSubmit = async (data) => {
    const newLogoFile = data.siteLogo?.[0];
    let newLogoUrl = savedSettings?.siteLogoUrl || null;

    // Upload new logo if provided
    if (newLogoFile) {
      newLogoUrl = await uploadLogoToServer(newLogoFile);
      if (!newLogoUrl) return; // stop if upload failed
    }

    // Check no changes
    const isUnchanged =
      data.siteName === savedSettings?.siteName &&
      data.primaryEmailId === savedSettings?.primaryEmailId &&
      data.facebookUrl === savedSettings?.facebookUrl &&
      data.instagramUrl === savedSettings?.instagramUrl &&
      !newLogoFile;

    if (isUnchanged) {
      toast("No changes detected", { icon: "ℹ️" });
      return;
    }

    const payload = {
      siteName: data.siteName,
      primaryEmailId: data.primaryEmailId || "",
      facebookUrl: data.facebookUrl || "",
      instagramUrl: data.instagramUrl || "",
      siteLogoUrl: newLogoUrl
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/addSettings`,
        payload
      );

      toast.success("Settings updated successfully! 🎉");

      setSiteSettings(payload);
      setSavedSettings(payload);

    } catch {
      toast.error("Error saving settings!");
    }
  };

  return (
    <section className="basic-site-settings">
      <Toaster position="top-right" />
      <h2>Basic Site Settings</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Site Name */}
        <div className="input-group">
          <label>Site Name</label>
          <input
            type="text"
            {...register("siteName", { required: true })}
            placeholder="Enter site name"
          />
          {errors.siteName && <span className="error">Site name is required</span>}
        </div>

        {/* Logo */}
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
                alt="Logo Preview"
                style={{
                  maxWidth: "120px",
                  marginTop: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px #0001"
                }}
              />
            </div>
          )}
        </div>

        {/* Email */}
        <div className="input-group">
          <label>Primary Email</label>
          <input
            type="email"
            {...register("primaryEmailId", { required: true })}
            placeholder="Enter email"
          />
          {errors.primaryEmailId && (
            <span className="error">Email is required</span>
          )}
        </div>

        {/* Facebook */}
        <div className="input-group">
          <label>Facebook URL</label>
          <input
            type="text"
            {...register("facebookUrl")}
            placeholder="Enter Facebook URL"
          />
        </div>

        {/* Instagram */}
        <div className="input-group">
          <label>Instagram URL</label>
          <input
            type="text"
            {...register("instagramUrl")}
            placeholder="Enter Instagram URL"
          />
        </div>

        <button type="submit" className="btn">Save Settings</button>
      </form>
    </section>
  );
};

export default BasicSiteSettings;
