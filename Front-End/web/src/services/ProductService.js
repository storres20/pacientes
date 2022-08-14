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

const create = data => {
  return http.post("/products", data);
};

const create3 = data => {
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
  create3,
  update,
  remove,
  removeAll,
  findByTitle
};

export default ProductDataService
