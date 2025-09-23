import axios from "axios";
import { create } from "zustand";

const useMilkDetails = create((set) => ({
  milk: [],             
  loading: false,
  error: null,

  setLoading: (isLoading) => set({ loading: isLoading }),
setError: (err) => set({ error: err }),


  fetchMilk: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("http://localhost:3000/milk-details");
      const milkData = response.data.milkdetails || [];
      set({ milk: milkData, loading: false });
    } catch (error) {
      set({ error: error.message || "Something went wrong", loading: false });
    }
  },
}));

export default useMilkDetails;

