import { create } from "zustand";
import axiosInstance from "../lib/axios"
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { Phone } from "lucide-react";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword, Phone }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}

		try {
			const res = await axiosInstance.post("/auth/signup", { name, email, password ,Phone });
			if (res?.data) {
				set({ user: res.data, loading: false });

				toast.success("Signup successful");
			  return true;
			}	
		} catch (error) {
			set({ loading: false });
			
		const message =
			error?.response?.data?.message ||
			error?.message ||
			"An error occurred during signup";
			toast.error(message);
			console.error("Signup error:", message);
		}
	},
	login: async (email, password) => {
		set({ loading: true });

		try {
			const res = await axiosInstance.post("/auth/login", { email, password });
     const user = res.data;
	    console.log("Login response user:", user); 
			set({ user: user, loading: false });
			console.log("User logged in:", get().user);
			return true;
			
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
			return false;
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ user: null });
		
		} catch (error) {
			toast.error(error?.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axiosInstance.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axiosInstance.post("/auth/refresh-token");
			// set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			  toast.error("Session expired. Please log in again.");
			throw error;
		}
		 finally {
    set({ checkingAuth: false }); // moved here to always run
  }
	},
}));

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null;

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axiosInstance(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				

				return axiosInstance(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
			 finally {
  refreshPromise = null; // always reset
}
		}
		return Promise.reject(error);
	}
);