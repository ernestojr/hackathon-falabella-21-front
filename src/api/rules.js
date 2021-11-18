
import API from './axios';
import rules from './mock/rules';

export const addRule = (data) => {
  return API.post('/rule/add', data);
}

export const getRules = () => {
  // return API.get(`/rule/all`);
  return Promise.resolve(rules);
}

export const deleteRuleById = (id) => {
  return API.delete(`/rules/${id}`);
}
