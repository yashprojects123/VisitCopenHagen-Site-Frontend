import { api } from "../Services/axiosInstance.js"; // Make sure to import the 'api' instance

export const fetchAllUsers = async () => {
  try {
    const response = await api.get("/api/users"); // Use the 'api' instance here
    console.log("Response from fetchAllUsers:", response.data);
    if (response.data != null) {
      return {
        users: response.data.user_data,
        error: null,
      };
    } else {
      return { users: null, error: response.message || "No data" };
    }
  } catch (error) {
    return { users: null, error };
  }
};