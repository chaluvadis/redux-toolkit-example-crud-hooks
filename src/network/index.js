import axios from "axios";
axios.interceptors.response.use((response) => {
  if (response.status >= 200 || response.status < 400) {
    response.isSuccess = true;
  }
});
export default axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json"
  }
});