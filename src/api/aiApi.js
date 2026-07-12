import axiosInstance from './axiosInstance';

// These all hit the Spring Boot backend, which in turn calls the free
// Hugging Face Inference API server-side (keeps any HF token off the client).
export const aiApi = {
  suggestCategory: (payload) => axiosInstance.post('/ai/suggest-category', payload),
  predictPriority: (payload) => axiosInstance.post('/ai/predict-priority', payload),
  checkDuplicate: (payload) => axiosInstance.post('/ai/check-duplicate', payload),
  generateTitle: (payload) => axiosInstance.post('/ai/generate-title', payload),
  improveDescription: (payload) => axiosInstance.post('/ai/improve-description', payload),
};
