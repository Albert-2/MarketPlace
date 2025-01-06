// src/slices/productsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // Array to store all available products
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload; // Set the products list
    },
    addProduct: (state, action) => {
      state.products.push(action.payload); // Add a single product
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      ); // Remove a product by its ID
    },
  },
});

export const { setProducts, addProduct, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;
