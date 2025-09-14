import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Global Application Store using Zustand
 * Replaces scattered localStorage/sessionStorage usage and provides unified state management
 */

// Authentication Store
export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        user: null,
        token: null,
        schoolCode: null,
        isAuthenticated: false,
        loginTime: null,
        sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours in milliseconds

        // Actions
        login: userData => {
          const loginTime = Date.now();
          set({
            user: userData.user,
            token: userData.token,
            schoolCode: userData.schoolCode,
            isAuthenticated: true,
            loginTime,
          });

          // Set session storage for backward compatibility
          sessionStorage.setItem('token', userData.token);
          sessionStorage.setItem('schoolCode', userData.schoolCode);
          localStorage.setItem('schoolCode', userData.schoolCode);
        },

        logout: () => {
          set({
            user: null,
            token: null,
            schoolCode: null,
            isAuthenticated: false,
            loginTime: null,
          });

          // Clear session storage
          sessionStorage.clear();
          localStorage.removeItem('schoolCode');
        },

        updateUser: userData => {
          set({ user: { ...get().user, ...userData } });
        },

        // Check if session is expired
        isSessionExpired: () => {
          const { loginTime, sessionTimeout } = get();
          if (!loginTime) return true;
          return Date.now() - loginTime > sessionTimeout;
        },

        // Extend session
        extendSession: () => {
          set({ loginTime: Date.now() });
        },
      }),
      {
        name: 'auth-store',
        partialize: state => ({
          user: state.user,
          token: state.token,
          schoolCode: state.schoolCode,
          isAuthenticated: state.isAuthenticated,
          loginTime: state.loginTime,
        }),
      },
    ),
    { name: 'auth-store' },
  ),
);

// Application State Store
export const useAppStore = create(
  devtools(
    (set, get) => ({
      // Loading states
      globalLoading: false,
      loadingStates: {},

      // Error states
      globalError: null,
      errorHistory: [],

      // School configuration
      schoolConfig: null,
      academicSession: null,

      // Cache for master data
      masterDataCache: {
        genders: [],
        religions: [],
        categories: [],
        states: [],
        classes: [],
        employees: [],
        lastUpdated: {},
      },

      // Actions
      setGlobalLoading: loading => set({ globalLoading: loading }),

      setLoading: (key, loading) => {
        const loadingStates = { ...get().loadingStates };
        if (loading) {
          loadingStates[key] = true;
        } else {
          delete loadingStates[key];
        }
        set({ loadingStates });
      },

      setGlobalError: error => {
        const errorHistory = [...get().errorHistory];
        if (error) {
          errorHistory.push({
            error,
            timestamp: Date.now(),
            id: Math.random().toString(36).substring(7),
          });
          // Keep only last 10 errors
          if (errorHistory.length > 10) {
            errorHistory.shift();
          }
        }
        set({ globalError: error, errorHistory });
      },

      clearError: () => set({ globalError: null }),

      setSchoolConfig: config => set({ schoolConfig: config }),

      setAcademicSession: session => set({ academicSession: session }),

      // Master data cache management
      setCachedData: (type, data) => {
        const masterDataCache = { ...get().masterDataCache };
        masterDataCache[type] = data;
        masterDataCache.lastUpdated[type] = Date.now();
        set({ masterDataCache });
      },

      getCachedData: (type, maxAge = 5 * 60 * 1000) => {
        // 5 minutes default
        const { masterDataCache } = get();
        const lastUpdated = masterDataCache.lastUpdated[type];

        if (!lastUpdated || Date.now() - lastUpdated > maxAge) {
          return null; // Cache expired
        }

        return masterDataCache[type];
      },

      clearCache: type => {
        const masterDataCache = { ...get().masterDataCache };
        if (type) {
          masterDataCache[type] = [];
          delete masterDataCache.lastUpdated[type];
        } else {
          // Clear all cache
          Object.keys(masterDataCache).forEach(key => {
            if (key !== 'lastUpdated') {
              masterDataCache[key] = [];
            }
          });
          masterDataCache.lastUpdated = {};
        }
        set({ masterDataCache });
      },

      // Utility methods
      isLoading: key => {
        if (key) {
          return !!get().loadingStates[key];
        }
        return (
          get().globalLoading || Object.keys(get().loadingStates).length > 0
        );
      },
    }),
    { name: 'app-store' },
  ),
);

// Form State Store (for complex multi-step forms)
export const useFormStore = create(
  devtools(
    (set, get) => ({
      // Active forms state
      formStates: {},

      // Actions
      setFormState: (formId, state) => {
        const formStates = { ...get().formStates };
        formStates[formId] = { ...formStates[formId], ...state };
        set({ formStates });
      },

      getFormState: formId => {
        return get().formStates[formId] || {};
      },

      clearFormState: formId => {
        const formStates = { ...get().formStates };
        delete formStates[formId];
        set({ formStates });
      },

      clearAllForms: () => set({ formStates: {} }),
    }),
    { name: 'form-store' },
  ),
);

// Navigation Store
export const useNavigationStore = create(
  devtools(
    (set, get) => ({
      // Sidebar state
      sidebarOpen: true,
      sidebarCollapsed: false,

      // Active menu
      activeMenu: '',
      breadcrumbs: [],

      // Navigation history
      navigationHistory: [],

      // Actions
      setSidebarOpen: open => set({ sidebarOpen: open }),

      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

      setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),

      setActiveMenu: menu => {
        const navigationHistory = [...get().navigationHistory];
        navigationHistory.push({
          menu,
          timestamp: Date.now(),
        });

        // Keep only last 20 navigation items
        if (navigationHistory.length > 20) {
          navigationHistory.shift();
        }

        set({ activeMenu: menu, navigationHistory });
      },

      setBreadcrumbs: breadcrumbs => set({ breadcrumbs }),

      goBack: () => {
        const { navigationHistory } = get();
        if (navigationHistory.length > 1) {
          const newHistory = [...navigationHistory];
          newHistory.pop(); // Remove current
          const previous = newHistory[newHistory.length - 1];
          set({
            activeMenu: previous.menu,
            navigationHistory: newHistory,
          });
        }
      },
    }),
    { name: 'navigation-store' },
  ),
);

// Theme Store (if you want to move theme state to Zustand)
export const useThemeStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Theme state
        darkMode: false,
        primaryColor: '#1976d2',
        fontFamily: 'Roboto',
        fontSize: 14,

        // Actions
        setDarkMode: darkMode => set({ darkMode }),
        toggleDarkMode: () => set({ darkMode: !get().darkMode }),
        setPrimaryColor: color => set({ primaryColor: color }),
        setFontFamily: fontFamily => set({ fontFamily }),
        setFontSize: fontSize => set({ fontSize }),

        resetTheme: () =>
          set({
            darkMode: false,
            primaryColor: '#1976d2',
            fontFamily: 'Roboto',
            fontSize: 14,
          }),
      }),
      {
        name: 'theme-store',
      },
    ),
    { name: 'theme-store' },
  ),
);

// Utility function to get all stores
export const getAllStores = () => ({
  auth: useAuthStore.getState(),
  app: useAppStore.getState(),
  form: useFormStore.getState(),
  navigation: useNavigationStore.getState(),
  theme: useThemeStore.getState(),
});

// Utility function to reset all stores (useful for logout)
export const resetAllStores = () => {
  useAuthStore.getState().logout();
  useAppStore.setState({
    globalLoading: false,
    loadingStates: {},
    globalError: null,
    errorHistory: [],
    schoolConfig: null,
    academicSession: null,
    masterDataCache: {
      genders: [],
      religions: [],
      categories: [],
      states: [],
      classes: [],
      employees: [],
      lastUpdated: {},
    },
  });
  useFormStore.getState().clearAllForms();
  useNavigationStore.setState({
    activeMenu: '',
    breadcrumbs: [],
    navigationHistory: [],
  });
};

export default {
  useAuthStore,
  useAppStore,
  useFormStore,
  useNavigationStore,
  useThemeStore,
  getAllStores,
  resetAllStores,
};
