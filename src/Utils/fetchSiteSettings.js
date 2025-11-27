// api/fetchSiteSettings.js
import { publicApi } from "../Services/axiosInstance.js";

export const fetchSiteSettings = async (siteKey = "VisitCopenhagen") => {
  try {
    const response = await publicApi.get(`/api/getSettings?siteKey=${siteKey}`);

    if (response?.data?.data) {
      return {
        data: response.data.data,
        logoUrl: response.data.data.siteLogoUrl || null,
        error: null
      };
    } else {
      return {
        data: null,
        logoUrl: null,
        error: "No data returned from server"
      };
    }

  } catch (error) {
    return { data: null, logoUrl: null, error };
  }
};
