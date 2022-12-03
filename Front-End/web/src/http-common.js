import axios from "axios";

export default axios.create({
  //baseURL: "http://localhost:3001/api", //localhost
  baseURL: "https://pacientes20-back.vercel.app/api",
  
  headers: {
    "Content-type": "application/json"
  }
});