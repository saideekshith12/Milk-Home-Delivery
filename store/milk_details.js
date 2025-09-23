import axios from "axios";
import { create } from "zustand";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const useMilkDetails = create((set) => ({
  milk: [],             
  loading: false,
  error: null,

  setLoading: (isLoading) => set({ loading: isLoading }),
setError: (err) => set({ error: err }),


  fetchMilk: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${baseURL}/api/user-auth/milk-details`);
      const milkData = response.data.milkdetails || [];
      set({ milk: milkData, loading: false });
    } catch (error) {
      set({ error: error.message || "Something went wrong", loading: false });
    }
  },
}));

export default useMilkDetails;

