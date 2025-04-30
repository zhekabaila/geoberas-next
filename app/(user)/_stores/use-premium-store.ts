import { create } from 'zustand'
import { Data as Premium } from '../types'

interface PremiumState {
  premium: Premium[]
  loading: boolean
  fetching: boolean
  selectedDeleteData: string[]
  setPremium: (premium: Premium[]) => void
  setLoading: (loading: boolean) => void
  setFetching: (fetching: boolean) => void
  setPrediksi: (prediksi: Premium[]) => void
}

export const usePremiumStore = create<PremiumState>((set) => ({
  premium: [],
  loading: true,
  fetching: false,
  selectedDeleteData: [],
  setPremium: (premium) => set({ premium }),
  setLoading: (loading) => set({ loading }),
  setFetching: (fetching) => set({ fetching }),
  setPrediksi: (prediksi) =>
    set((state) => ({
      premium: [...state.premium, ...prediksi]
    }))
}))
