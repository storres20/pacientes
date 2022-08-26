import http from "../http-common";

const getAll = () => {
  return http.get("/products");
};

const getAll2 = () => {
  return http.get("/categories");
};

const get = id => {
  return http.get(`/products/${id}`);
};

// New.jsx
const create = data => {
  return http.post("/products", data);
};

// NewDate.jsx
const createDate = data => {
  return http.post("/products", data);
};

const login = data => {
  return http.post("/login", data);
};

const update = (id, data) => {
  return http.put(`/products/${id}`, data);
};

const remove = id => {
  return http.delete(`/products/${id}`);
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
  get,
  create,
  createDate,
  login,
  update,
  remove,
  removeAll,
  findByTitle
};

export default ProductDataService
