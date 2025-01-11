import { create } from "zustand";
import { axiosInstance } from "../utils/lib.tsx";
import { toast } from "sonner";
import { useAuthStore } from "./useAuthStore.tsx";

interface ChatStore {
  selectedUser: any;
  messages: any[];
  users: any[];
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  setSelectedUser: (selectedUser: any) => void;
  getUsers: () => Promise<void>;
  unsubscribeFromMessages: () => void;
  subscribeToMessages: () => void;
  sendMessage: (
    message: string,
    image: ArrayBuffer | string | null
  ) => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  selectedUser: null,
  messages: [],
  users: [],
  isUsersLoading: false,
  isMessagesLoading: false,
  setSelectedUser: (selectedUser: string) => set({ selectedUser }),
  getUsers: async () => {
    try {
      const users = await axiosInstance.get("/messages/getSideUsers");
      set({ users: users.data });
    } catch (error) {
      toast.error("Error in fetching users");
      console.log(error);
    }
  },

  sendMessage: async (message, image) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        { message, image }
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error("Error in sending message");
      console.log(error);
    }
  },
  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error("Error in fetching messages");
      console.log(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("message");
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("message", (message) => {
      const isMessageSentFromSelectedUser =
        message.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set((state) => ({ messages: [...state.messages, message] }));
    });
  },
}));
