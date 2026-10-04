import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  avatar?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (user?: UserProfile) => void;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

export const defaultUserProfile: UserProfile = {
  firstName: "JOHN",
  lastName: "doe",
  email: "EXAMPLE@GMAIL.COM",
  address: "4, Anthony Villa, Um...",
  avatar: "/images/profile-avatar.png",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,

      login: (user) => {
        const mergedUser = {
          ...defaultUserProfile,
          ...user,
        };
        if (typeof document !== "undefined") {
          document.cookie = "u2gas_logged_in=true; path=/; max-age=2592000";
        }
        set({ isLoggedIn: true, user: mergedUser });
      },

      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "u2gas_logged_in=; path=/; max-age=0";
        }
        if (typeof window !== "undefined") {
          localStorage.removeItem("u2gas_logged_in");
          localStorage.removeItem("u2gas_user");
        }
        set({ isLoggedIn: false, user: null });
      },

      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : { ...defaultUserProfile, ...data },
        }));
      },
    }),
    {
      name: "u2gas_auth_store",
    }
  )
);
