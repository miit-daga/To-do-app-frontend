import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      userName: "",
      userEmail: "",
      isAuth: false,

      addAuth: () =>
        set((state) => ({
          ...state,
          isAuth: true,
        })),
      removeAuth: () =>
        set((state) => ({
          ...state,
          isAuth: false,
        })),
      setUserName: (userName) =>
        set((state) => ({
          ...state,
          userName,
        })),
      setUserEmail: (userEmail) =>
        set((state) => ({
          ...state,
          userEmail,
        })),
    }),
    {
      name: "auth-storage",
      getStorage: () => sessionStorage,
    },
  ),
);
export default useAuthStore;
