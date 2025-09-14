// src/api/endpoints.js
/**
 * Centralized API endpoints configuration
 * All API endpoints are organized by feature modules
 */

export const API_ENDPOINTS = {
  // Authentication & User Management
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh',
  },

  // Student Management
  STUDENTS: {
    GET_FILTER_STUDENTS: '/api/GetStudents/GetFilterStudents',
    GET_MONTHLY_FEES_STUDENTS: '/api/GetStudents/GetFilterMonthlyFeesStudents',
    GET_DUES_FEES_STUDENTS: '/api/GetStudents/GetFilterDuesFeesStudents',
    GET_STUDENT_DETAILS: '/api/GetStudents/GetStudentDetails',
    ADD_STUDENT: '/api/Students/AddStudent',
    UPDATE_STUDENT: '/api/Students/UpdateStudent',
    DELETE_STUDENT: '/api/Students/DeleteStudent',
  },

  // Class & Section Management
  CLASSES: {
    GET_CLASSES: '/api/GetClass/GetClasses',
    GET_CLASS_SECTIONS: '/api/GetClass/GetClassSection',
    ADD_CLASS: '/api/Class/AddClass',
    UPDATE_CLASS: '/api/Class/UpdateClass',
    DELETE_CLASS: '/api/Class/DeleteClass',
  },

  // Fee Management
  FEES: {
    GET_MONTHLY_BILLING_FEES: '/api/MonthlyBillingFees/GetMonthlyBillingFees',
    GET_BILLING_RECEIPT_NUMBER:
      '/api/MonthlyBillingFees/GetBillingReceiptNumber',
    PROCESS_FEE_PAYMENT: '/api/Fees/ProcessPayment',
    GET_FEE_STRUCTURE: '/api/Fees/GetFeeStructure',
  },

  // Dues Management
  DUES: {
    GET_BILLING_RECEIPT_NUMBER: '/api/DuesBillingFees/GetBillingReceiptNumber',
    GET_STUDENT_DEMANDS: '/api/GetStudentDemands/GetStudentDemandsByIds',
    PROCESS_DUES_PAYMENT: '/api/Dues/ProcessPayment',
  },

  // Master Data
  MASTERS: {
    // Gender
    GET_GENDERS: '/api/GetGenders/GetGenders',

    // Religion
    GET_RELIGIONS: '/api/GetReligions/GetReligions',

    // Location
    GET_STATE_DISTRICT_LIST: '/api/GetStateDistrictList/GetStateDistrictList',

    // Categories
    GET_STUDENT_CATEGORIES: '/api/GetStudentCategory/GetStudentCategory',

    // Employee
    GET_EMPLOYEES: '/api/Employee/GetEmployees',
    GET_EMPLOYEE_DEPARTMENTS: '/api/EmployeeDepartment/GetEmployeeDepartments',

    // Session
    GET_SESSION_DETAILS: '/api/Session/GetSessionStartEndDetails',

    // Time
    GET_MONTHS: '/api/GetMonths/GetMonths',

    // Expense
    GET_EXPENSE_ITEMS: '/api/Expense/GetItemExpenseList',

    // School
    GET_SCHOOL_DETAILS: '/api/Schools/GetSchoolDetails',

    // Monthly Fees
    GET_MONTHLY_FEES: '/api/Fees/GetMonthlyFees',
  },

  // Expense Management
  EXPENSES: {
    GET_FILTER_EXPENSES: '/api/GetExpenses/GetFilterExpenses',
    GET_ITEM_EXPENSE_LIST: '/api/Expense/GetItemExpenseList',
    ADD_EXPENSE: '/api/Expense/AddExpense',
    UPDATE_EXPENSE: '/api/Expense/UpdateExpense',
    DELETE_EXPENSE: '/api/Expense/DeleteExpense',
  },

  // Reports
  REPORTS: {
    STUDENT_DETAIL_REPORT: '/api/Reports/StudentDetailReport',
    FEE_COLLECTION_REPORT: '/api/Reports/FeeCollectionReport',
    ATTENDANCE_REPORT: '/api/Reports/AttendanceReport',
    EXPENSE_REPORT: '/api/Reports/ExpenseReport',
  },

  // Attendance
  ATTENDANCE: {
    MARK_ATTENDANCE: '/api/Attendance/MarkAttendance',
    GET_ATTENDANCE: '/api/Attendance/GetAttendance',
    GET_MONTHLY_ATTENDANCE: '/api/Attendance/GetMonthlyAttendance',
  },

  // Exam Management
  EXAMS: {
    GET_EXAMS: '/api/Exams/GetExams',
    ADD_EXAM: '/api/Exams/AddExam',
    UPDATE_EXAM: '/api/Exams/UpdateExam',
    DELETE_EXAM: '/api/Exams/DeleteExam',
    GET_SUBJECTS: '/api/Subjects/GetSubjects',
    ADD_SUBJECT: '/api/Subjects/AddSubject',
  },

  // Configuration
  CONFIG: {
    GET_SCHOOL_CONFIG: '/api/Config/GetSchoolConfig',
    UPDATE_SCHOOL_CONFIG: '/api/Config/UpdateSchoolConfig',
    GET_THEME_CONFIG: '/api/Config/GetThemeConfig',
    UPDATE_THEME_CONFIG: '/api/Config/UpdateThemeConfig',
  },
};

// API Methods (for future use if different methods are needed)
export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

// Common API configurations
export const API_CONFIG = {
  BASE_URL: 'https://teo-vivekanadbihar.co.in/TEO-School-API',
  DEFAULT_METHOD: 'POST',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Standard request body structure
export const createRequestBody = (data = {}) => ({
  trackingID: 'string', // Standard tracking ID
  ...data,
});

// Response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};
