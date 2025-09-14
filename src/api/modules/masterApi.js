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
    return apiService.call(API_ENDPOINTS.CLASSES.GET_CLASS_SECTIONS, { classId });
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
   * Get state and district list
   */
  async getStateDistrictList() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_STATE_DISTRICT_LIST);
  },

  /**
   * Get student categories
   */
  async getStudentCategories() {
    return apiService.call(API_ENDPOINTS.MASTERS.GET_STUDENT_CATEGORIES);
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
};

export default masterApi;