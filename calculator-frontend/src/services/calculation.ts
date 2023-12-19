import axios from "axios";
const GATEWAY_URL = "http://localhost:3010/api";
type ArrayType = [string, string];

export const addition = (operands: ArrayType) => {
  return axios
    .post(GATEWAY_URL + "/addition-gateway", { operands: operands })
    .then((response) => {
      return response.data;
    });
};

export const subtraction = (operands: ArrayType) => {
  return axios
    .post(GATEWAY_URL + "/subtraction-gateway", { operands: operands })
    .then((response) => {
      return response.data;
    });
};

export const multiplication = (operands: ArrayType) => {
  return axios
    .post(GATEWAY_URL + "/multiplication-gateway", { operands: operands })
    .then((response) => {
      return response.data;
    });
};

export const division = (operands: ArrayType) => {
  return axios
    .post(GATEWAY_URL + "/division-gateway", { operands: operands })
    .then((response) => {
      return response.data;
    });
};
