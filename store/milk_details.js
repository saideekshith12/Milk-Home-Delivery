import axios from "axios";
import { create } from "zustand";

const url = process.env.PUBLIC;

const useMilkDetails = create((set) => ({
  milk: [],
  loading: false,
  error: null,

  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (err) => set({ error: err }),

  fetchMilk: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${url}/api/user-auth/milk-details`);
      const milkData = response.data.milkdetails || [];
      set({ milk: milkData, loading: false });
    } catch (error) {
      set({ error: error.message || "Something went wrong", loading: false });
    }
  },
}));

export default useMilkDetails;


