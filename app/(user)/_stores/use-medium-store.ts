import { create } from "zustand";
import { Data as Medium } from "../types";

interface MediumState {
  medium: Medium[];
  loading: boolean;
  fetching: boolean;
  selectedDeleteData: string[];
  setMedium: (medium: Medium[]) => void;
  setLoading: (loading: boolean) => void;
  setFetching: (fetching: boolean) => void;
}

export const useMediumStore = create<MediumState>((set) => ({
  medium: [],
  loading: true,
  fetching: false,
  selectedDeleteData: [],
  setMedium: (medium) => set({ medium }),
  setLoading: (loading) => set({ loading }),
  setFetching: (fetching) => set({ fetching }),
}));
