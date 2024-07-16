import { create } from "zustand";

interface AuthTypeStore {
  state: "signin" | "signup";
  onSignin: () => void;
  onSignup: () => void;
}

export const useAuthType = create<AuthTypeStore>(set => ({
  state: "signin",
  onSignin: () => set({ state: "signin" }),
  onSignup: () => set({ state: "signup" }),
}));
