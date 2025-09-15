// src/api/modules/masterApi.js
/**
 * Master data API calls (dropdowns, lookup data, etc.)
 */
import { apiService } from '../apiService.js';
import { API_ENDPOINTS } from '../endpoints.js';

export const masterApi = {
  /**
   * Get all classes
   */
  async getClasses() {
    return apiService.call(API_ENDPOINTS.CLASSES.GET_CLASSES);
  },

  /**
   * Get sections for a specific class
   */
  async getClassSections(classId) {
    return apiService.call(API_ENDPOINTS.CLASSES.GET_CLASS_SECTIONS, {
      classId,
    });
  },

  /**
   * Get all genders
   */
  async getGenders() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_GENDERS);
  },
  /**
   * Get all religions
   */
  async getReligions() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_RELIGIONS);
  },

  /**
   * Get all religions (alternative endpoint)
   */
  async getReligionsAlt() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_RELIGIONS_ALT);
  },

  /**
   * Get state and district list
   */
  async getStateDistrictList() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_STATE_DISTRICT_LIST);
  },

  /**
   * Get states only
   */
  async getStates() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_STATES);
  },

  /**
   * Get districts only
   */
  async getDistricts() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_DISTRICTS);
  },

  /**
   * Get student categories
   */
  async getStudentCategories() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_STUDENT_CATEGORIES);
  },

  /**
   * Get student categories (alternative endpoint)
   */
  async getStudentCategoriesAlt() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_STUDENT_CATEGORIES_ALT);
  },

  /**
   * Get employee departments
   */
  async getEmployeeDepartments() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_EMPLOYEE_DEPARTMENTS);
  },

  /**
   * Get months list
   */
  async getMonths() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_MONTHS);
  },

  /**
   * Get all employees
   */
  async getEmployees() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_EMPLOYEES);
  },

  /**
   * Get session start/end details
   */
  async getSessionDetails() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_SESSION_DETAILS);
  },

  /**
   * Get expense items
   */
  async getExpenseItems() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_EXPENSE_ITEMS);
  },

  /**
   * Get school details
   */
  async getSchoolDetails() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_SCHOOL_DETAILS);
  },

  /**
   * Get monthly fees
   */
  async getMonthlyFees() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_MONTHLY_FEES);
  },

  /**
   * Get fee details
   */
  async getFeeDetails() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_FEE_DETAILS);
  },
};

export default masterApi;
