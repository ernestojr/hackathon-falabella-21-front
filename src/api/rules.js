
import API from './axios';

export const addRule = (data) => {
  return API.post('/rule/add', data);
}

export const getRules = () => {
  return API.get(`/rule/all`);
}

export const deleteRuleById = (id) => {
  return API.delete(`/rules/${id}`);
}
