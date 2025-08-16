import axios from "axios";

export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
    console.log("Response from fetchAllUsers:", response.data);
    if (response.data != null) {
      return {
        users: response.data.user_data,
        error: null
      };
    } else {
      return { users: null, error: response.message || "No data" };
    }
  } catch (error) {
    return { users: null, error };
  }
};