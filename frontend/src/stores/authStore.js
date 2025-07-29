import { create } from 'zustand'
import axiosInstance from '../services/axiosInstance'

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,
  setAuth: (user, token) => {
    set({ user, token, isLoading: false })
    localStorage.setItem('token', token)
  },
  clearAuth: () => {
    set({ user: null, token: null, isLoading: false })
    localStorage.removeItem('token')
  },
  initializeAuth: async () => {
    set({ isLoading: true })
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await axiosInstance.get('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        set({ token, user: response.data.user, isLoading: false })
      } catch (error) {
        set({ user: null, token: null, isLoading: false })
        localStorage.removeItem('token')
      }
    } else {
      set({ isLoading: false })
    }
  },
}))

export default useAuthStore