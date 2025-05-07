import { create } from 'zustand'
import { Data } from '../types'

export interface Medium extends Data {
  type?: 'prediksi' | 'data'
}

interface MediumState {
  medium: Medium[]
  prediksiMedium: Medium[] | null
  loading: boolean
  fetching: boolean
  selectedDeleteData: string[]
  setMedium: (medium: Medium[]) => void
  setLoading: (loading: boolean) => void
  setFetching: (fetching: boolean) => void
  setPrediksi: (prediksi: Medium[]) => void
  setPrediksiNull: () => void
  removePrediksiFromData: () => void
}

export const useMediumStore = create<MediumState>((set) => ({
  medium: [],
  prediksiMedium: null,
  loading: true,
  fetching: false,
  selectedDeleteData: [],
  setMedium: (medium) => set({ medium }),
  setLoading: (loading) => set({ loading }),
  setFetching: (fetching) => set({ fetching }),
  setPrediksi: (prediksi) => {
    set((state) => ({
      medium: [...state.medium, ...prediksi]
    }))
    set({ prediksiMedium: prediksi })
  },
  setPrediksiNull: () => {
    set({ prediksiMedium: null })
  },
  removePrediksiFromData: () => {
    set((state) => ({
      medium: state.medium.filter((item) => item.type !== 'prediksi')
    }))
  }
}))
