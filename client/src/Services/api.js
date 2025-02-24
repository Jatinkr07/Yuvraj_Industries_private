import axios from "axios";

export const API_URL = " https://yuvraj-industries-private.onrender.com";

export const createCategory = (formData) =>
  axios.post(`${API_URL}/api/categories`, formData);

export const updateCategory = (id, formData) =>
  axios.put(`${API_URL}/api/categories/${id}`, formData);

export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/api/categories`);
  return response.data;
};

export const removeCategoryImage = (id) =>
  axios.delete(`${API_URL}/api/categories/${id}/remove-image`);

export const deleteCategory = (id) =>
  axios.delete(`${API_URL}/api/categories/${id}`);

export const createProduct = async (formData) => {
  const response = await axios.post(`${API_URL}/api/products`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getProducts = async (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;
  const response = await axios.get(`${API_URL}/api/products`, {
    params: { page, limit, search },
  });
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await axios.put(`${API_URL}/api/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/api/products/${id}`);
  return response.data;
};

// Dealer API Calls - Fixed Routes & Consistency
export const createDealer = (data) =>
  axios.post(`${API_URL}/api/dealer/create`, data, {
    withCredentials: true,
  });

export const dealerLogin = (data) =>
  axios.post(`${API_URL}/api/dealer/login`, data, {
    withCredentials: true,
  });

export const getDealers = () =>
  axios.get(`${API_URL}/api/dealer/list`, {
    withCredentials: true,
  });

export const deleteDealer = (id) =>
  axios.delete(`${API_URL}/api/dealer/${id}`, { withCredentials: true });
