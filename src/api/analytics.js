import API from './axios';

export const analyticsFile = (file) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/csv/upload', formData, headers);
}
