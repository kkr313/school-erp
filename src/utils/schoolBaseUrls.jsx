// src/utils/schoolBaseUrls.jsx
/**
 * Dynamic school base URL management
 * This should fetch school configurations from API in production
 */

// Default school base URLs (can be overridden by API)
let schoolBaseUrls = {
  T36: 'https://teo-vivekanadbihar.co.in/TEO-School-API',
  T37: 'https://teo-vivekanadbihar.co.in/TEO-RISING-2025',
  T38: 'https://teo-vivekanadbihar.co.in/vivekanand',
  T39: 'https://teo-vivekanadbihar.co.in/TEO-MANAN-2025',
  T40: 'https://teo-vivekanadbihar.co.in/TEO-SECURE-2025',
  T41: 'https://teo-vivekanadbihar.co.in/TEO-RKMS-2025',
  T42: 'https://teo-vivekanadbihar.co.in/TEO-NUTAN-2025',
  T44: 'https://teo-vivekanadbihar.co.in/TEO-HOLYFAITH-2025',
  T45: 'https://teo-vivekanadbihar.co.in/TEO-ARYAMISSION-2025',
  T46: 'https://teo-vivekanadbihar.co.in/TEO-VIVEKANANDSENIOR-2025',
  T47: 'https://teo-vivekanadbihar.co.in/TEO-ADARSHVIDYA-2025',
};

/**
 * Get base URL for a specific school code
 */
export const getBaseUrlBySchoolCode = (code) => {
  if (!code) {
    console.warn('School code is required for API calls');
    return '';
  }
  
  const baseUrl = schoolBaseUrls[code];
  if (!baseUrl) {
    console.warn(`No base URL configured for school code: ${code}`);
    return '';
  }
  
  return baseUrl;
};

/**
 * Update school base URLs dynamically (for API-driven configuration)
 */
export const updateSchoolBaseUrls = (newUrls) => {
  schoolBaseUrls = { ...schoolBaseUrls, ...newUrls };
  
  // Cache updated URLs
  cacheSchoolBaseUrls(schoolBaseUrls);
  
  console.log('📡 School base URLs updated:', Object.keys(newUrls));
};

/**
 * Get all configured school codes
 */
export const getAvailableSchoolCodes = () => {
  return Object.keys(schoolBaseUrls);
};

/**
 * Validate if a school code is configured
 */
export const isSchoolCodeValid = (code) => {
  return code && schoolBaseUrls.hasOwnProperty(code);
};

/**
 * Fetch school configurations from API dynamically
 * This replaces hard-coded school base URLs with API-driven configuration
 */
export const fetchSchoolBaseUrls = async () => {
  try {
    const configApi = import.meta.env.VITE_SCHOOL_CONFIG_API;
    if (!configApi || !import.meta.env.VITE_ENABLE_DYNAMIC_SCHOOL_URLS) {
      console.log('Dynamic school URLs disabled, using static configuration');
      return;
    }    const response = await fetch(configApi, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const dynamicUrls = await response.json();
      updateSchoolBaseUrls(dynamicUrls);
      console.log('✅ School base URLs updated from API');
    } else {
      console.warn('Failed to fetch dynamic school URLs, using static configuration');
    }
  } catch (error) {
    console.warn('Error fetching dynamic school URLs:', error.message);
    console.log('Using static school base URL configuration');
  }
};

/**
 * Initialize school configuration on app startup
 */
export const initializeSchoolConfiguration = async () => {
  // Load any cached configuration from localStorage
  const cachedUrls = localStorage.getItem('schoolBaseUrls');
  if (cachedUrls) {
    try {
      const parsedUrls = JSON.parse(cachedUrls);
      updateSchoolBaseUrls(parsedUrls);
      console.log('✅ Loaded cached school base URLs');
    } catch (error) {
      console.warn('Failed to parse cached school URLs');
    }
  }
  // Fetch fresh configuration from API
  await fetchSchoolBaseUrls();
  
  // Set default school code for testing if none exists
  if (!sessionStorage.getItem('schoolCode') && import.meta.env.MODE === 'development') {
    const defaultSchoolCode = import.meta.env.VITE_DEFAULT_SCHOOL_CODE || 'T36';
    sessionStorage.setItem('schoolCode', defaultSchoolCode);
    console.log(`🔧 Set default school code for development: ${defaultSchoolCode}`);
  }
};

/**
 * Cache school base URLs to localStorage
 */
const cacheSchoolBaseUrls = (urls) => {
  try {
    localStorage.setItem('schoolBaseUrls', JSON.stringify(urls));
    localStorage.setItem('schoolUrlsLastUpdated', new Date().toISOString());
  } catch (error) {
    console.warn('Failed to cache school base URLs:', error.message);
  }
};
