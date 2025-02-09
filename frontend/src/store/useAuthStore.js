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
  }
}))