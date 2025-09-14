// src/utils/useApi.jsx
/**
 * Enhanced API hook with better error handling, loading states, and integration with centralized API system
 * This is now the single, unified API hook for the entire application
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { apiService, ApiError } from '../api/apiService.js';

/**
 * Main API hook - backward compatible with enhanced features
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const abortControllerRef = useRef(null);

  // Cleanup function to abort ongoing requests
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  /**
   * Backward compatible callApi function
   */
  const callApi = useCallback(
    async (endpoint, body = {}) => {
      // Abort any ongoing request
      cleanup();

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const result = await apiService.call(endpoint, body, {
          signal: abortControllerRef.current.signal,
        });

        setData(result);
        return result;
      } catch (err) {
        // Don't set error if request was aborted (component unmounted or new request started)
        if (err.name !== 'AbortError') {
          const errorMessage =
            err instanceof ApiError
              ? err.message
              : err.message || 'API request failed';
          setError(errorMessage);
          console.error('API Error:', err);
        }
        return null;
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [cleanup],
  );

  /**
   * Enhanced API methods
   */
  const get = useCallback(
    (endpoint, params = {}, options = {}) => {
      return callApi(endpoint, params, { ...options, method: 'GET' });
    },
    [callApi],
  );

  const post = useCallback(
    (endpoint, data = {}, options = {}) => {
      return callApi(endpoint, data, { ...options, method: 'POST' });
    },
    [callApi],
  );

  const put = useCallback(
    (endpoint, data = {}, options = {}) => {
      return callApi(endpoint, data, { ...options, method: 'PUT' });
    },
    [callApi],
  );

  const remove = useCallback(
    (endpoint, data = {}, options = {}) => {
      return callApi(endpoint, data, { ...options, method: 'DELETE' });
    },
    [callApi],
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear all state
   */
  const reset = useCallback(() => {
    cleanup();
    setLoading(false);
    setError(null);
    setData(null);
  }, [cleanup]);

  return {
    // Backward compatible
    callApi,
    loading,
    error,

    // Enhanced features
    data,
    get,
    post,
    put,
    delete: remove,

    // Utilities
    clearError,
    reset,
    cleanup,

    // Error helpers
    isClientError: error?.isClientError?.() || false,
    isServerError: error?.isServerError?.() || false,
    isNetworkError: error?.isNetworkError?.() || false,
  };
};

/**
 * Hook for specific API operations with built-in state management
 */
export const useApiOperation = (apiFunction, dependencies = []) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      setHasRun(true);
      return result;
    } catch (err) {
      const apiError =
        err instanceof ApiError ? err : new ApiError(err.message);
      setError(apiError);
      console.error('API Operation Error:', apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
    setHasRun(false);
  }, []);

  return {
    execute,
    loading,
    error,
    data,
    hasRun,
    reset,
    isClientError: error?.isClientError?.() || false,
    isServerError: error?.isServerError?.() || false,
    isNetworkError: error?.isNetworkError?.() || false,
  };
};

/**
 * Hook for automatic data fetching with dependency management
 */
export const useApiFetch = (apiFunction, dependencies = [], options = {}) => {
  const { immediate = true, ...operationOptions } = options;
  const operation = useApiOperation(apiFunction, dependencies);

  useEffect(() => {
    if (
      immediate &&
      dependencies.every(dep => dep !== null && dep !== undefined)
    ) {
      operation.execute(...dependencies);
    }
  }, [operation.execute, immediate, ...dependencies]);

  return operation;
};

// Export the main hook as default
export default useApi;
