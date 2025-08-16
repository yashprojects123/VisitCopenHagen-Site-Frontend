import axios from "axios";

export const fetchSiteSettings = async (siteKey = "VisitCopenhagen") => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getSettings?siteKey=${siteKey}`);
    console.log("Response from fetchSiteSettings:", response.data);
    if (response.data != null) {
      return {
        data: response.data.data,
        logoUrl: response.data.data.siteLogoUrl || null,
        error: null
      };
    } else {
      return { data: null, logoUrl: null, error: response.message || "No data" };
    }
  } catch (error) {
    return { data: null, logoUrl: null, error };
  }
};