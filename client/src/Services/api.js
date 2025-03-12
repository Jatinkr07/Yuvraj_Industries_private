import axios from "axios";

export const API_URL = "http://localhost:6600";
// export const API_URL = "https://yuvraj-industries-private.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Category API Calls
export const createCategory = (formData) =>
  api.post("/api/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCategory = (id, formData) =>
  api.put(`/api/categories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getCategories = async () => {
  const response = await api.get("/api/categories");
  return response.data;
};

export const removeCategoryImage = (id) =>
  api.delete(`/api/categories/${id}/remove-image`);

export const deleteCategory = (id) => api.delete(`/api/categories/${id}`);

// Product API Calls
export const createProduct = async (formData) => {
  const response = await api.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getProducts = async (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;
  const response = await api.get("/api/products", {
    params: { page, limit, search },
  });
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await api.put(`/api/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};

// Dealer API Calls
export const createDealer = (data) => api.post("/api/dealer/create", data);

export const dealerLogin = async (data) => {
  const response = await api.post("/api/dealer/login", data);
  return response.data;
};

export const getDealers = () => api.get("/api/dealer/list");

export const updateDealer = (id, data) => api.put(`/api/dealer/${id}`, data);

export const deleteDealer = (id) => api.delete(`/api/dealer/${id}`);

export const createSubDealer = (data) =>
  api.post("/api/dealer/subdealer/create", data);
export const updateSubDealer = (id, data) =>
  api.put(`/api/dealer/subdealer/${id}`, data);

// Dealer Product API Calls
export const assignProductToDealer = async (data) => {
  const response = await api.post("/api/products/assign", data);

  return response.data;
};

export const bulkAssignProductsToDealer = async (data) => {
  const response = await api.post("/api/products/bulk-assign-to-dealer", data);
  return response.data;
};

export const getDealersAll = async () => {
  const response = await api.get("/api/dealer/v1/list/dealer");
  console.log("getDealers response:", response.data);
  return response.data;
};

export const getDealerProducts = async (dealerId) => {
  const response = await api.get(
    dealerId ? `/api/dealer/products/${dealerId}` : "/api/dealer/products"
  );
  return response.data;
};
// Sale API Calls
// export const createSale = (data) => api.post("/api/sale/create", data);

// export const getSales = () => api.get("/api/sale/list");

export const replaceProduct = (saleId) =>
  api.put(`/api/sale/replace/${saleId}`, {});

// Error Handling Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export default api;

//sale

export const createSale = async (data) => {
  const response = await api.post("/api/sale/create", data);
  return response.data;
};

export const getSales = async () => {
  const response = await api.get("/api/sale/v1/sale/list");
  return response.data;
};

// export const requestPasswordChange = async (dealerId, newPassword) => {
//   const response = await api.post(`/api/dealer/${dealerId}/request-password`, {
//     newPassword,
//   });
//   return response.data;
// };

export const requestPasswordChange = async (data) => {
  const response = await api.post("/api/dealer/password/request", data);
  return response.data;
};

export const updateDealerPasswordByAdmin = async (id, data) => {
  const response = await api.put(`/api/dealer/password/${id}`, data);
  return response.data;
};
