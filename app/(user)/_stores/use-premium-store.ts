import { create } from 'zustand'
import { Data } from '../types'

interface Premium extends Data {
  type?: 'prediksi' | 'data'
}

interface PremiumState {
  premium: Premium[]
  prediksiPremium: Premium[] | null
  loading: boolean
  fetching: boolean
  selectedDeleteData: string[]
  setPremium: (premium: Premium[]) => void
  setLoading: (loading: boolean) => void
  setFetching: (fetching: boolean) => void
  setPrediksi: (prediksi: Premium[]) => void
  setPrediksiNull: () => void
  removePrediksiFromData: () => void
}

export const usePremiumStore = create<PremiumState>((set) => ({
  premium: [],
  prediksiPremium: null,
  loading: true,
  fetching: false,
  selectedDeleteData: [],
  setPremium: (premium) => set({ premium }),
  setLoading: (loading) => set({ loading }),
  setFetching: (fetching) => set({ fetching }),
  setPrediksi: (prediksi) => {
    set((state) => ({
      premium: [...state.premium, ...prediksi]
    }))
    set({ prediksiPremium: prediksi })
  },
  setPrediksiNull: () => {
    set({ prediksiPremium: null })
  },
  removePrediksiFromData: () => {
    set((state) => ({
      premium: state.premium.filter((item) => item.type !== 'prediksi')
    }))
  }
}))
