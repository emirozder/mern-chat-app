import { create } from 'zustand';
import { AxiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true })
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