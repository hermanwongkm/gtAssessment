import axios from "./index.js";
import { stringify } from "query-string";

export const getAllEmployees = async (params) => {
  const res = await axios.get(`/users?${stringify(params)}`);
  return res;
};

export const uploadFromLocal = async (data) => {
  const res = await axios.post("/upload", data, {});
  return res;
};
