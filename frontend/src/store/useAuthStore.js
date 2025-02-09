import toast from "react-hot-toast";
import { create } from 'zustand';
import { AxiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true })
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

  logout: async () => {
    try {
      await AxiosInstance.post("/auth/logout")
      set({ authUser: null })
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
}))