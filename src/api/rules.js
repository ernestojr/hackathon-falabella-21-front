
import API from './axios';
// import QueryString from 'query-string';
// import { PAGINATION_LIMIT } from '../constants/api';

import rulesMock from './mock/rules';

export const addRule = (data) => {
  return API.post('/rules', data);
}

export const getRules = (query) => {
  // return API.get(`/rules?${QueryString.stringify({limit: PAGINATION_LIMIT, ...query})}`);
  return Promise.resolve(rulesMock);
}

export const getRuleById = (id) => {
  return API.get(`/rules/${id}`);
}

export const updateRuleById = (id, data) => {
  return API.put(`/rules/${id}`, data);
}

export const deleteRuleById = (id) => {
  return API.delete(`/rules/${id}`);
}