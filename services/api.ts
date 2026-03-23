import axios from 'axios';
import { ApiResponse, Category, PaginatedData, SimulationSummary, SimulationDetail } from '../types';

// In development, we use the Express proxy to avoid CORS issues.
// In production, the same logic applies as the app is served from the same origin.
const API_BASE_URL = ''; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const categoryService = {
  list: async (params?: { page?: number; size?: number }) => {
    const response = await api.get<ApiResponse<PaginatedData<Category>>>('/v1/category/list', { params });
    return response.data;
  },
};

export const simulationService = {
  guestList: async (params?: { page?: number; size?: number; categoryId?: number }) => {
    const response = await api.get<ApiResponse<PaginatedData<SimulationSummary>>>('/v1/simulation/guest_list', { params });
    return response.data;
  },
  guestGet: async (id: number) => {
    const response = await api.get<ApiResponse<SimulationDetail>>(`/v1/simulation/guest_get/${id}`);
    return response.data;
  },
};

export default api;
