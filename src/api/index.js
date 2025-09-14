// src/api/index.js
/**
 * Main API exports - single entry point for all API calls
 */

// Core API service
export { apiService, ApiError } from './apiService.js';

// Configuration and endpoints
export { API_ENDPOINTS, API_METHODS, API_CONFIG, createRequestBody, HTTP_STATUS } from './endpoints.js';

// Feature-specific API modules
import { studentApi } from './modules/studentApi.js';
import { masterApi } from './modules/masterApi.js';
import { feeApi, duesApi } from './modules/feeApi.js';

// Re-export individual modules
export { studentApi, masterApi, feeApi, duesApi };

// Unified API object for convenience
export const api = {
  students: studentApi,
  masters: masterApi,
  fees: feeApi,
  dues: duesApi,
};

export default api;