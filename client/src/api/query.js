import axios from "./index.js";
import { stringify } from "query-string";

export const getAllEmployees = async (params) => {
  try {
    const res = await axios.get(`/users?${stringify(params)}`);
    return res.data.results;
  } catch (error) {
    return error.response;
  }
};

export const createEmployee = async (id, payload) => {
  try {
    const res = await axios.post(`/users/${id}`, payload);
    return res.data;
  } catch (error) {
    return error.response;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const res = await axios.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    return error.response;
  }
};

export const updateEmployee = async (id, payload) => {
  try {
    const res = await axios.patch(`/users/${id}`, payload);
    return res.data;
  } catch (error) {
    return error.response;
  }
};

export const deleteEmployeeById = async (id) => {
  try {
    const res = await axios.delete(`/users/${id}`);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const uploadCSV = async (data) => {
  try {
    const res = await axios.post("/users/upload", data, {});
    return res.data.message;
  } catch (error) {
    return error.response.data.message;
  }
};
