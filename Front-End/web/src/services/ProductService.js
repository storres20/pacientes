import http from "../http-common";

const getAll = () => {
  return http.get("/products");
};

const getAll2 = () => {
  return http.get("/categories");
};

const getAll3 = () => {
  return http.get("/dates");
};

const get = id => {
  return http.get(`/products/${id}`);
};

// Dates.jsx
const getDate = id => {
  return http.get(`/dates/${id}`);
};

// Resumen.jsx
const getDateDNI = id => {
  return http.get(`/dates/dni/${id}`);
};

// New.jsx
const create = data => {
  return http.post("/products", data);
};

// NewDate.jsx
const createDate = data => {
  return http.post("/dates", data);
};

const login = data => {
  return http.post("/login", data);
};

const update = (id, data) => {
  return http.patch(`/products/${id}`, data);
};

const remove = id => {
  return http.delete(`/products/${id}`);
};

// Resumen.jsx
const removeDNI = id => {
  return http.delete(`/dates/dni/${id}`);
};

const removeAll = () => {
  return http.delete(`/products`);
};

const findByTitle = title => {
  return http.get(`/products?title=${title}`);
};

// 👇️ assign to variable
const ProductDataService = {
  getAll,
  getAll2,
  getAll3,
  get,
  getDate,
  getDateDNI,
  create,
  createDate,
  login,
  update,
  remove,
  removeDNI,
  removeAll,
  findByTitle
};

export default ProductDataService
