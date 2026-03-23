// import axios from "axios";

// const api = axios.create({
//   baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
//   withCredentials: true,
// });

// console.log("API BASE URL:", process.env.NEXT_PUBLIC_API_URL);
// export default api;



import axios from "axios";

const api = axios.create({
  baseURL: "/api",               // ← now proxied by Next.js
  withCredentials: true,         // still good to have (harmless)
});

export default api;
