// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.MODE === "development" ? "http://localhost:6000" : "/api",
//   withCredentials: true, // send cookies to the server
//    headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default axiosInstance;

import axios from "axios";

const MODE = process.env.REACT_APP_MODE;
const baseURL ="https://blog-mern-6ov2.onrender.com/api";
  // process.env.REACT_APP_MODE === "development"
  //   ? "http://localhost:6000/api"
  //   : "https://blog-mern-6ov2.onrender.com/api";
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});


export default axiosInstance;
