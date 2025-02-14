import toast from 'react-hot-toast';
import { create } from 'zustand';
import { AxiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
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

  sendMessage: async (messageData) => {
    const { messages, selectedUser } = get()
    try {
      const res = await AxiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
      set({ messages: [...messages, res.data.data] })
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get()
    if (!selectedUser) return

    // get the socket from useAuthStore
    const { socket } = useAuthStore.getState()

    // listen for message event and update messages in the store
    socket.on("message", (message) => {
      // if the message is not from the selected user, return
      if (message.senderId !== selectedUser._id) return

      const { messages } = get()
      set({ messages: [...messages, message] })
    })
  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState()
    socket.off("message")
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser })
  }
}))