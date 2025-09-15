// src/api/apiService.js
/**
 * Enhanced API service with centralized configuration and improved error handling
 */
import { API_CONFIG, createRequestBody, HTTP_STATUS } from './endpoints.js';
import { getBaseUrlBySchoolCode } from '../utils/schoolBaseUrls.jsx';

class ApiService {
  constructor() {
    this.defaultHeaders = {
      accept: 'text/plain',
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get dynamic base URL based on school code
   */
  getDynamicBaseUrl() {
    const schoolCode = sessionStorage.getItem('schoolCode');
    if (schoolCode) {
      const dynamicBaseUrl = getBaseUrlBySchoolCode(schoolCode);
      if (dynamicBaseUrl) {
        return dynamicBaseUrl;
      }
    }
    
    // Fallback to environment variable or default
    return API_CONFIG.DEFAULT_BASE_URL;
  }

  /**
   * Get authentication headers from session storage - Dynamic
   */
  getAuthHeaders() {
    const schoolCode = sessionStorage.getItem('schoolCode');
    const authToken = sessionStorage.getItem('token');
    const userToken = sessionStorage.getItem('userToken') || API_CONFIG.DEFAULT_USER_TOKEN;

    if (!schoolCode) {
      console.warn('School code is missing from session storage');
    }

    return {
      'BS-SchoolCode': schoolCode || '',
      'BS-UserToken': userToken,
      'BS-AuthorizationToken': authToken || '',
    };
  }

  /**
   * Create full headers object
   */
  createHeaders(customHeaders = {}) {
    return {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...customHeaders,
    };
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.text().catch(() => 'Unknown error');
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status,
        errorData,
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  }

  /**
   * Retry mechanism for failed requests
   */
  async withRetry(fn, attempts = API_CONFIG.RETRY_ATTEMPTS) {
    let lastError;

    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Don't retry on client errors (4xx)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Wait before retrying
        if (i < attempts - 1) {
          await new Promise(resolve =>
            setTimeout(resolve, API_CONFIG.RETRY_DELAY * (i + 1)),
          );
        }
      }
    }

    throw lastError;
  }

  /**
   * Main API call method
   */
  async call(endpoint, data = {}, options = {}) {
    const {
      method = API_CONFIG.DEFAULT_METHOD,
      headers: customHeaders = {},
      timeout = API_CONFIG.TIMEOUT,
      retry = true,
    } = options;

    const makeRequest = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {        const requestBody =
          method !== 'GET' ? createRequestBody(data) : undefined;
        
        // Handle both full URLs and relative endpoints - Fully Dynamic
        let baseUrl;
        let finalUrl;
        
        if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
          // Absolute URL - use as is
          finalUrl = endpoint;
        } else {
          // Relative URL - build dynamically
          baseUrl = this.getDynamicBaseUrl();
          
          if (!baseUrl) {
            throw new ApiError('Unable to determine base URL for API call', 500, 'Configuration Error');
          }
          
          finalUrl = `${baseUrl}${endpoint}`;
        }
        
        const url =
          method === 'GET' && Object.keys(data).length > 0
            ? `${finalUrl}?${new URLSearchParams(data)}`
            : finalUrl;

        if (API_CONFIG.DEBUG_MODE) {
          console.log('🔹 API Call:', {
            endpoint,
            baseUrl,
            finalUrl: url,
            method,
            data: requestBody,
            headers: this.createHeaders(customHeaders)
          });
        }        const response = await fetch(url, {
          method,
          headers: this.createHeaders(customHeaders),
          body: requestBody ? JSON.stringify(requestBody) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        
        if (API_CONFIG.DEBUG_MODE) {
          console.log('🔹 API Response:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url
          });
        }
        
        return await this.handleResponse(response);
      } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408, 'Request timed out');
        }

        throw error;
      }
    };

    if (retry) {
      return await this.withRetry(makeRequest);
    }

    return await makeRequest();
  }

  /**
   * Convenience methods for different HTTP methods
   */
  async get(endpoint, params = {}, options = {}) {
    return this.call(endpoint, params, { ...options, method: 'GET' });
  }

  async post(endpoint, data = {}, options = {}) {
    return this.call(endpoint, data, { ...options, method: 'POST' });
  }

  async put(endpoint, data = {}, options = {}) {
    return this.call(endpoint, data, { ...options, method: 'PUT' });
  }

  async delete(endpoint, data = {}, options = {}) {
    return this.call(endpoint, data, { ...options, method: 'DELETE' });
  }

  async patch(endpoint, data = {}, options = {}) {
    return this.call(endpoint, data, { ...options, method: 'PATCH' });
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }

  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  isServerError() {
    return this.status >= 500;
  }

  isNetworkError() {
    return !this.status;
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export for backward compatibility and testing
export default ApiService;
