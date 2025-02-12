import toast from "react-hot-toast";
import { create } from 'zustand';
import { AxiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true, // it is true because we are checking auth on app load

  checkAuth: async () => {
    try {
      const res = await AxiosInstance.get("/auth/check-auth")
      set({ authUser: res.data.data })
    } catch (error) {
      console.log("An error occurred while checking auth: ", error);
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true })
    try {
      const res = await AxiosInstance.post("/auth/signup", formData)
      res.data.success === true ? toast.success("Account created successfully") : toast.error(res.data.message)
      return res.data.success
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true })
    try {
      const res = await AxiosInstance.post("/auth/login", formData)
      set({ authUser: res.data.data })
      res.data.success === true ? toast.success(`Welcome, ${res.data.data.fullName}!`) : toast.error(res.data.message)
      return res.data.success
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await AxiosInstance.post("/auth/logout")
      set({ authUser: null })
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await AxiosInstance.put("/auth/update-profile", data)
      set({ authUser: res.data.data })
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false })
    }
  }
}))