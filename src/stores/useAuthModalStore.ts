import { create } from 'zustand';

type AuthModalState = {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  openLogin: () => void;
  openRegister: () => void;
  closeLogin: () => void;
  closeRegister: () => void;
  switchToRegister: () => void;
  switchToLogin: () => void;
};

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isLoginOpen: false,
  isRegisterOpen: false,
  openLogin: () => set({ isLoginOpen: true, isRegisterOpen: false }),
  openRegister: () => set({ isRegisterOpen: true, isLoginOpen: false }),
  closeLogin: () => set({ isLoginOpen: false }),
  closeRegister: () => set({ isRegisterOpen: false }),
  switchToRegister: () => set({ isLoginOpen: false, isRegisterOpen: true }),
  switchToLogin: () => set({ isRegisterOpen: false, isLoginOpen: true }),
}));
