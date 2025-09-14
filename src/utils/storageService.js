/**
 * Unified Storage Service
 * Centralizes all localStorage and sessionStorage operations
 * Provides type safety, error handling, and consistent API
 */

// Storage types
const STORAGE_TYPES = {
  SESSION: 'session',
  LOCAL: 'local',
};

// Storage keys (centralized for consistency)
export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'token',
  SCHOOL_CODE: 'schoolCode',
  USER_DATA: 'userData',
  LOGIN_TIME: 'loginTime',

  // Application settings
  THEME_PREFERENCES: 'themePreferences',
  SIDEBAR_STATE: 'sidebarState',
  LANGUAGE: 'language',

  // Form data (temporary)
  FORM_DRAFTS: 'formDrafts',
  FORM_CACHE: 'formCache',

  // Master data cache
  MASTER_DATA_CACHE: 'masterDataCache',
  CACHE_TIMESTAMPS: 'cacheTimestamps',

  // Navigation
  LAST_VISITED_PAGE: 'lastVisitedPage',
  NAVIGATION_HISTORY: 'navigationHistory',

  // Feature flags
  FEATURE_FLAGS: 'featureFlags',

  // Performance
  API_CACHE: 'apiCache',
  OFFLINE_QUEUE: 'offlineQueue',
};

class StorageService {
  constructor() {
    this.isStorageAvailable = this.checkStorageAvailability();
  }

  /**
   * Check if storage is available
   */
  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('Storage not available:', e);
      return false;
    }
  }

  /**
   * Get storage instance based on type
   */
  getStorage(type) {
    if (type === STORAGE_TYPES.LOCAL) {
      return localStorage;
    }
    return sessionStorage;
  }

  /**
   * Set item in storage
   */
  set(key, value, type = STORAGE_TYPES.SESSION, options = {}) {
    if (!this.isStorageAvailable) {
      console.warn('Storage not available');
      return false;
    }

    try {
      const storage = this.getStorage(type);

      // Prepare data with metadata
      const data = {
        value,
        timestamp: Date.now(),
        expires: options.expires ? Date.now() + options.expires : null,
        version: options.version || '1.0',
      };

      storage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error setting storage item ${key}:`, error);
      return false;
    }
  }

  /**
   * Get item from storage
   */
  get(key, type = STORAGE_TYPES.SESSION, defaultValue = null) {
    if (!this.isStorageAvailable) {
      return defaultValue;
    }

    try {
      const storage = this.getStorage(type);
      const item = storage.getItem(key);

      if (!item) {
        return defaultValue;
      }

      const data = JSON.parse(item);

      // Check if item has expired
      if (data.expires && Date.now() > data.expires) {
        this.remove(key, type);
        return defaultValue;
      }

      return data.value;
    } catch (error) {
      console.error(`Error getting storage item ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key, type = STORAGE_TYPES.SESSION) {
    if (!this.isStorageAvailable) {
      return false;
    }

    try {
      const storage = this.getStorage(type);
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing storage item ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all items from storage
   */
  clear(type = STORAGE_TYPES.SESSION) {
    if (!this.isStorageAvailable) {
      return false;
    }

    try {
      const storage = this.getStorage(type);
      storage.clear();
      return true;
    } catch (error) {
      console.error(`Error clearing storage:`, error);
      return false;
    }
  }

  /**
   * Get all keys from storage
   */
  getAllKeys(type = STORAGE_TYPES.SESSION) {
    if (!this.isStorageAvailable) {
      return [];
    }

    try {
      const storage = this.getStorage(type);
      return Object.keys(storage);
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }

  /**
   * Get storage usage info
   */
  getStorageInfo(type = STORAGE_TYPES.SESSION) {
    if (!this.isStorageAvailable) {
      return { used: 0, available: 0, percentage: 0 };
    }

    try {
      const storage = this.getStorage(type);
      let used = 0;

      for (let key in storage) {
        if (storage.hasOwnProperty(key)) {
          used += storage[key].length + key.length;
        }
      }

      // Estimate available space (most browsers limit to ~5-10MB)
      const estimated = 5 * 1024 * 1024; // 5MB estimate
      const percentage = (used / estimated) * 100;

      return {
        used,
        available: estimated - used,
        percentage: Math.min(percentage, 100),
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  /**
   * Batch operations
   */
  setMultiple(items, type = STORAGE_TYPES.SESSION, options = {}) {
    const results = {};
    for (const [key, value] of Object.entries(items)) {
      results[key] = this.set(key, value, type, options);
    }
    return results;
  }

  getMultiple(keys, type = STORAGE_TYPES.SESSION, defaultValue = null) {
    const results = {};
    for (const key of keys) {
      results[key] = this.get(key, type, defaultValue);
    }
    return results;
  }

  removeMultiple(keys, type = STORAGE_TYPES.SESSION) {
    const results = {};
    for (const key of keys) {
      results[key] = this.remove(key, type);
    }
    return results;
  }

  // Convenience methods for common operations
  session = {
    get: (key, defaultValue) =>
      this.get(key, STORAGE_TYPES.SESSION, defaultValue),
    set: (key, value, options) =>
      this.set(key, value, STORAGE_TYPES.SESSION, options),
    remove: key => this.remove(key, STORAGE_TYPES.SESSION),
    clear: () => this.clear(STORAGE_TYPES.SESSION),
    getAllKeys: () => this.getAllKeys(STORAGE_TYPES.SESSION),
  };

  local = {
    get: (key, defaultValue) =>
      this.get(key, STORAGE_TYPES.LOCAL, defaultValue),
    set: (key, value, options) =>
      this.set(key, value, STORAGE_TYPES.LOCAL, options),
    remove: key => this.remove(key, STORAGE_TYPES.LOCAL),
    clear: () => this.clear(STORAGE_TYPES.LOCAL),
    getAllKeys: () => this.getAllKeys(STORAGE_TYPES.LOCAL),
  };

  /**
   * Cache management with TTL
   */
  cache = {
    set: (key, value, ttl = 5 * 60 * 1000) => {
      // 5 minutes default
      return this.set(key, value, STORAGE_TYPES.SESSION, { expires: ttl });
    },

    get: (key, defaultValue = null) => {
      return this.get(key, STORAGE_TYPES.SESSION, defaultValue);
    },

    has: key => {
      return this.get(key, STORAGE_TYPES.SESSION) !== null;
    },

    invalidate: key => {
      return this.remove(key, STORAGE_TYPES.SESSION);
    },

    clear: () => {
      // Remove only cache items (you might want to implement a prefix system)
      const keys = this.getAllKeys(STORAGE_TYPES.SESSION);
      const cacheKeys = keys.filter(
        key => key.includes('cache') || key.includes('Cache'),
      );
      return this.removeMultiple(cacheKeys, STORAGE_TYPES.SESSION);
    },
  };

  /**
   * Cleanup expired items
   */
  cleanup() {
    if (!this.isStorageAvailable) {
      return;
    }

    const types = [STORAGE_TYPES.SESSION, STORAGE_TYPES.LOCAL];

    types.forEach(type => {
      try {
        const storage = this.getStorage(type);
        const keys = Object.keys(storage);

        keys.forEach(key => {
          try {
            const item = storage.getItem(key);
            if (item) {
              const data = JSON.parse(item);
              if (data.expires && Date.now() > data.expires) {
                storage.removeItem(key);
              }
            }
          } catch (e) {
            // Invalid JSON or malformed data, remove it
            storage.removeItem(key);
          }
        });
      } catch (error) {
        console.error(`Error during cleanup of ${type} storage:`, error);
      }
    });
  }

  /**
   * Clear all application data (useful for logout)
   */
  clearAll() {
    this.clear(STORAGE_TYPES.SESSION);
    this.clear(STORAGE_TYPES.LOCAL);
  }

  /**
   * Migration helper for existing code
   */
  migrate() {
    // Migrate old storage patterns to new structure
    console.log('Running storage migration...');

    // Example: migrate old token storage
    const oldToken = localStorage.getItem('token');
    if (oldToken && !this.get(STORAGE_KEYS.AUTH_TOKEN, STORAGE_TYPES.SESSION)) {
      this.set(STORAGE_KEYS.AUTH_TOKEN, oldToken, STORAGE_TYPES.SESSION);
    }

    const oldSchoolCode = localStorage.getItem('schoolCode');
    if (
      oldSchoolCode &&
      !this.get(STORAGE_KEYS.SCHOOL_CODE, STORAGE_TYPES.LOCAL)
    ) {
      this.set(STORAGE_KEYS.SCHOOL_CODE, oldSchoolCode, STORAGE_TYPES.LOCAL);
    }

    console.log('Storage migration completed');
  }
}

// Create singleton instance
const storageService = new StorageService();

// Auto-cleanup on page load
if (typeof window !== 'undefined') {
  // Run cleanup on page load
  storageService.cleanup();

  // Run cleanup periodically (every 30 minutes)
  setInterval(
    () => {
      storageService.cleanup();
    },
    30 * 60 * 1000,
  );
}

export { STORAGE_TYPES };
export default storageService;
