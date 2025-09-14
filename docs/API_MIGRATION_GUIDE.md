# API System Migration Guide

## Overview

This guide explains how to migrate from the old API system to the new centralized API system in the School ERP application.

## What's New

### 1. Centralized API Configuration
- All API endpoints are now defined in `src/api/endpoints.js`
- API calls are organized by feature modules
- Consistent error handling and retry mechanisms
- Better loading states and request cancellation

### 2. Enhanced API Service
- `src/api/apiService.js` - Core API service with improved error handling
- Automatic retry for failed requests
- Request timeout management
- Standardized response handling

### 3. Feature-Specific API Modules
- `src/api/modules/studentApi.js` - Student-related API calls
- `src/api/modules/masterApi.js` - Master data (dropdowns, lookups)
- `src/api/modules/feeApi.js` - Fee and billing operations
- Single entry point: `src/api/index.js`

### 4. Enhanced Hooks
- `src/utils/useApi.jsx` - Enhanced unified API hook with advanced features
- `src/utils/useApi.jsx` - Updated for backward compatibility
- Better state management and error handling

## Migration Strategies

### Option 1: Gradual Migration (Recommended)
The old `useApi` hook has been updated to use the new system internally, so existing components will continue to work without changes.

```jsx
// This still works without any changes
const { callApi, loading, error } = useApi();
const data = await callApi("/api/GetClass/GetClasses", { trackingID: "string" });
```

### Option 2: Use New API Modules Directly
For better type safety and organization:

```jsx
import { masterApi } from "../api/modules/masterApi.js";

const fetchClasses = async () => {
  const classes = await masterApi.getClasses();
  return classes;
};
```

### Option 3: Use Enhanced Hooks
For advanced features like automatic cancellation and better error handling:

```jsx
import { useApi } from "../utils/useApi.jsx";

const MyComponent = () => {
  const api = useApi();
  
  const fetchData = async () => {
    const result = await api.post("/api/endpoint", { data });
    return result;
  };
};
```

## Migration Examples

### Before (Old System)
```jsx
// src/components/Dropdown/Class.jsx
import { useApi } from "../../utils/useApi";

const Class = ({ onClassChange }) => {
  const { callApi } = useApi();
  
  useEffect(() => {
    const fetchClasses = async () => {
      const data = await callApi("/api/GetClass/GetClasses", {
        trackingID: "string",
      });
      // Process data...
    };
    fetchClasses();
  }, []);
};
```

### After (New System - Option 1: Minimal Changes)
```jsx
// No changes needed - backward compatible
import { useApi } from "../../utils/useApi";

const Class = ({ onClassChange }) => {
  const { callApi } = useApi(); // Now uses centralized system internally
  
  useEffect(() => {
    const fetchClasses = async () => {
      const data = await callApi("/api/GetClass/GetClasses", {
        trackingID: "string",
      });
      // Process data...
    };
    fetchClasses();
  }, []);
};
```

### After (New System - Option 2: API Modules)
```jsx
// src/components/Dropdown/ClassV2.jsx
import { masterApi } from "../../api/modules/masterApi.js";
import { useApiOperation } from "../../utils/useApi.jsx";

const ClassV2 = ({ onClassChange }) => {
  const {
    execute: fetchClasses,
    loading,
    error,
    data
  } = useApiOperation(masterApi.getClasses);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);
  
  // Handle loading and error states automatically
};
```

## Benefits of Migration

### 1. Better Error Handling
- Standardized error types with `ApiError` class
- Retry mechanism for transient failures
- Better error messages and debugging

### 2. Improved Performance
- Request cancellation to prevent memory leaks
- Automatic cleanup on component unmount
- Connection timeout management

### 3. Better Developer Experience
- IntelliSense support with proper typing
- Centralized endpoint management
- Consistent API patterns across the app

### 4. Maintainability
- Easy to update API endpoints in one place
- Feature-based organization
- Standardized request/response handling

## Best Practices

### 1. Use Feature-Specific API Modules
```jsx
// Good
import { api } from "../api/index.js";
const students = await api.students.getMonthlyFeesStudents();

// Also good for specific needs
import { masterApi } from "../api/modules/masterApi.js";
const classes = await masterApi.getClasses();
```

### 2. Handle Loading and Error States
```jsx
const { execute, loading, error, data } = useApiOperation(api.students.getFilteredStudents);

if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
return <StudentList students={data} />;
```

### 3. Use Centralized Endpoints
```jsx
// Good
import { API_ENDPOINTS } from "../api/endpoints.js";
await api.callApi(API_ENDPOINTS.STUDENTS.GET_MONTHLY_FEES_STUDENTS);

// Avoid hardcoded strings
await api.callApi("/api/GetStudents/GetFilterMonthlyFeesStudents");
```

## Configuration

### Environment-Specific Settings
Update `src/api/endpoints.js` for different environments:

```jsx
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://teo-vivekanadbihar.co.in/TEO-School-API',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};
```

### Custom Headers
Add custom headers in `src/api/apiService.js`:

```jsx
createHeaders(customHeaders = {}) {
  return {
    ...this.defaultHeaders,
    ...this.getAuthHeaders(),
    'Custom-Header': 'value',
    ...customHeaders,
  };
}
```

## Testing

### Unit Testing API Modules
```jsx
import { masterApi } from "../api/modules/masterApi.js";

// Mock the API service
jest.mock("../api/apiService.js");

test("should fetch classes", async () => {
  const mockClasses = [{ id: 1, className: "Class 1" }];
  apiService.call.mockResolvedValue(mockClasses);
  
  const result = await masterApi.getClasses();
  expect(result).toEqual(mockClasses);
});
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure to use `.js` extensions in import paths
2. **CORS Issues**: Check API_CONFIG.BASE_URL is correct
3. **Auth Errors**: Verify session storage has valid tokens
4. **Timeout Errors**: Adjust API_CONFIG.TIMEOUT if needed

### Debug Mode
Enable detailed logging:

```jsx
// In src/api/apiService.js
console.log('API Request:', endpoint, requestData);
console.log('API Response:', result);
```

## Next Steps

1. Start with existing components (no changes needed)
2. Gradually migrate to new API modules for new features
3. Use enhanced hooks for complex components
4. Add proper error boundaries and loading states
5. Consider adding API response caching for performance