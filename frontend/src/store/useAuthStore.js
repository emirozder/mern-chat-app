import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from 'zustand';
import { AxiosInstance } from '../lib/axios';
import { useChatStore } from "./useChatStore";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true, // it is true because we are checking auth on app load
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await AxiosInstance.get("/auth/check-auth")
      set({ authUser: res.data.data })
      get().connectSocket();
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
      get().connectSocket();
      return res.data.success
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    const { setSelectedUser } = useChatStore.getState();
    try {
      await AxiosInstance.post("/auth/logout")
      set({ authUser: null })
      setSelectedUser(null);
      toast.success("Logged out successfully")
      get().disconnectSocket();
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
  },

  connectSocket: () => {
    const { authUser } = get();
    // if there is no authUser or socket is already connected, return
    if (!authUser || get().socket?.connected) return;

    // create a new socket connection and connect - passing the userId as query
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    });
    socket.connect();

    // set the socket in the store
    set({ socket });

    // listen for getOnlineUsers event and update the store
    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    // disconnect the socket if just in case it is connected
    if (get().socket?.connected) {
      get().socket.disconnect();
    }

    // set onlineUsers to empty array
    set({ onlineUsers: [] });
  }
}))