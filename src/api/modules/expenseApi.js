// src/api/modules/expenseApi.js
/**
 * Expense management API calls
 */
import { apiService } from '../apiService.js';
import { API_ENDPOINTS } from '../endpoints.js';

export const expenseApi = {
  /**
   * Get filtered expenses based on criteria
   */
  async getFilterExpenses(filters = {}) {
    return apiService.call(API_ENDPOINTS.EXPENSES.GET_FILTER_EXPENSES, filters);
  },

  /**
   * Get expense items list
   */
  async getItemExpenseList() {
    return apiService.call(API_ENDPOINTS.EXPENSES.GET_ITEM_EXPENSE_LIST);
  },

  /**
   * Add a new expense
   */
  async addExpense(expenseData) {
    return apiService.call(API_ENDPOINTS.EXPENSES.ADD_EXPENSE, expenseData);
  },

  /**
   * Add a new expense (alternative endpoint)
   */
  async addExpenses(expenseData) {
    return apiService.call(API_ENDPOINTS.EXPENSES.ADD_EXPENSES, expenseData);
  },

  /**
   * Update an existing expense
   */
  async updateExpense(expenseData) {
    return apiService.call(API_ENDPOINTS.EXPENSES.UPDATE_EXPENSE, expenseData);
  },

  /**
   * Delete an expense
   */
  async deleteExpense(expenseId) {
    return apiService.call(API_ENDPOINTS.EXPENSES.DELETE_EXPENSE, {
      expenseId,
    });
  },
};

export default expenseApi;
