// src/api/modules/studentApi.js
/**
 * Student-specific API calls
 */
import { apiService } from '../apiService.js';
import { API_ENDPOINTS } from '../endpoints.js';

export const studentApi = {
  /**
   * Get filtered students for monthly fees
   */
  async getMonthlyFeesStudents(filters = {}) {
    return apiService.call(API_ENDPOINTS.STUDENTS.GET_MONTHLY_FEES_STUDENTS, filters);
  },

  /**
   * Get filtered students for dues fees
   */
  async getDuesFeesStudents(filters = {}) {
    return apiService.call(API_ENDPOINTS.STUDENTS.GET_DUES_FEES_STUDENTS, filters);
  },

  /**
   * Get filtered students (general)
   */
  async getFilteredStudents(filters = {}) {
    return apiService.call(API_ENDPOINTS.STUDENTS.GET_FILTER_STUDENTS, filters);
  },

  /**
   * Get specific student details
   */
  async getStudentDetails(studentId) {
    return apiService.call(API_ENDPOINTS.STUDENTS.GET_STUDENT_DETAILS, { studentId });
  },

  /**
   * Add new student
   */
  async addStudent(studentData) {
    return apiService.call(API_ENDPOINTS.STUDENTS.ADD_STUDENT, studentData);
  },

  /**
   * Update existing student
   */
  async updateStudent(studentId, studentData) {
    return apiService.call(API_ENDPOINTS.STUDENTS.UPDATE_STUDENT, { 
      studentId, 
      ...studentData 
    });
  },

  /**
   * Delete student
   */
  async deleteStudent(studentId) {
    return apiService.call(API_ENDPOINTS.STUDENTS.DELETE_STUDENT, { studentId });
  },
};

export default studentApi;