import { User } from '@/types/user';
import axios from 'axios';
import { create } from 'zustand';

interface UserState {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: User) => void;
  fetchUser: () => Promise<boolean>;
  logout: () => void;
}

const useAuthStore = create<UserState>()((set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData: User) => set({ isAuthenticated: true, user: userData }),
  fetchUser: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }
    try {
      const profileResp = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const profile = profileResp.data as User;
      set({ isAuthenticated: true, user: profile });
      return true;
    } catch (error) {
      return false;
    }
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
    localStorage.removeItem('authToken');
  }
}));

export default useAuthStore;
