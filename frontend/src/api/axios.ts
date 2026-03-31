// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL + "/api", 
//   withCredentials: true,
// });

// export default api;

import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // 1. Extract the custom warning header
    // Axios headers are lowercase by default
    const warning = response.headers["x-subscription-warning"];

    // 2. Trigger toast only if a warning exists and we are in the browser
    if (warning && typeof window !== "undefined") {
      toast(warning, {
        id: "sub-warning", // Use a unique ID to prevent toast spamming on multiple requests
        icon: '⚠️',
        duration: 6000,
        style: {
          borderRadius: '12px',
          background: '#FFFBEB', 
          color: '#92400E',
          fontWeight: 'bold',
          fontSize: '12px',
          border: '1px solid #FDE68A'
        },
      });
    }
    
    return response;
  },
  (error) => {
    // 3. Handle Hard Blocks (Expired)
    if (error.response?.status === 402 && typeof window !== "undefined") {
      toast.error("Subscription Expired. Access Restricted.", {
        id: "sub-expired"
      });
      // Optional: window.location.href = "/settings/billing";
    }

    // Handle generic errors (optional but helpful)
    if (error.response?.status === 401 && typeof window !== "undefined") {
       // Handle logout or session expired logic here
    }

    return Promise.reject(error);
  }
);

export default api;
