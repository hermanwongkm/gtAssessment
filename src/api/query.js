import axios from "./index.js";
import { stringify } from "query-string";

export const getAllEmployees = async (params) => {
  const res = await axios.get(`/users?${stringify(params)}`);
  return res;
};

export const createEmployee = async (id, payload) => {
  const res = await axios.post(`/users/${id}`, payload);
  console.log(res);
  return res;
};

export const getEmployeeById = async (id) => {
  const res = await axios.get(`/users/${id}`);
  console.log(res);
  return res;
};
export const updateEmployee = async (id, payload) => {
  const res = await axios.patch(`/users/${id}`, payload);
  console.log(res);
  return res;
};
export const deleteEmployeeById = async (id) => {
  const res = await axios.delete(`/users/${id}`);
  console.log(res);
  return res;
};
