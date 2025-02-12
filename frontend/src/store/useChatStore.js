import toast from 'react-hot-toast';
import { create } from 'zustand';
import { AxiosInstance } from '../lib/axios';

export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await AxiosInstance.get("/messages/users")
      set({ users: res.data.data })
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const res = await AxiosInstance.get(`/messages/${userId}`)
      set({ messages: res.data.data })
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser })
  }
}))