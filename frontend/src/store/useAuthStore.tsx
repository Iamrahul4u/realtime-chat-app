import { create } from "zustand";
import { axiosInstance } from "../utils/lib.tsx";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
interface AuthUser {
  fullName: string;
  email: string;
  password: string;
  profilePic?: string;
  _id?: string;
}
type LoginUser = Omit<AuthUser, "fullName" | "profilePic">;
interface AuthStore {
  socket: any | null;
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: AuthUser) => Promise<void>;
  login: (data: LoginUser) => Promise<void>;
  logout: () => Promise<void>;
  connectSocket: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,
  checkAuth: async () => {
    try {
      const user = await axiosInstance.get("/auth/check");
      set({ authUser: user.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in Checkauth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data: AuthUser) => {
    set({ isSigningUp: true });
    try {
      const user = await axiosInstance.post("/auth/signup", data);
      set({ authUser: user.data });
      toast.success("Signed Up Successfully");
    } catch (error) {
      set({ authUser: null });
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data: LoginUser) => {
    set({ isLoggingIn: true });
    try {
      const user = await axiosInstance.post("/auth/login", data);
      toast.success("Logged In Successfully");
      set({ authUser: user.data });
    } catch (error) {
      console.log("Error in Login", error);
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (error) {
      console.log("Error in Logout", error);
    }
  },

  updateProfile: async (data: Partial<AuthUser>) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
    } catch (error) {
      console.log("error in update profile:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();
    set({ socket: socket });
  },
  disconnectSocket: async () => {
    const { socket } = get();
    if (socket.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
