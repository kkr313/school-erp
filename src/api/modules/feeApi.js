// src/api/modules/feeApi.js
/**
 * Fee and billing related API calls
 */
import { apiService } from '../apiService.js';
import { API_ENDPOINTS } from '../endpoints.js';

export const feeApi = {
  /**
   * Get monthly billing fees
   */
  async getMonthlyBillingFees(filters = {}) {
    return apiService.call(
      API_ENDPOINTS.FEES.GET_MONTHLY_BILLING_FEES,
      filters,
    );
  },

  /**
   * Get billing receipt number for monthly fees
   */
  async getBillingReceiptNumber(admissionId) {
    return apiService.call(API_ENDPOINTS.FEES.GET_BILLING_RECEIPT_NUMBER, {
      admissionId,
    });
  },

  /**
   * Process fee payment
   */
  async processFeePayment(paymentData) {
    return apiService.call(API_ENDPOINTS.FEES.PROCESS_FEE_PAYMENT, paymentData);
  },

  /**
   * Get fee structure
   */
  async getFeeStructure(classId, academicYear) {
    return apiService.call(API_ENDPOINTS.FEES.GET_FEE_STRUCTURE, {
      classId,
      academicYear,
    });
  },
};

export const duesApi = {
  /**
   * Get billing receipt number for dues
   */
  async getBillingReceiptNumber(admissionId) {
    return apiService.call(API_ENDPOINTS.DUES.GET_BILLING_RECEIPT_NUMBER, {
      admissionId,
    });
  },

  /**
   * Get student demands by IDs
   */
  async getStudentDemandsByIds(demandIds) {
    return apiService.call(API_ENDPOINTS.DUES.GET_STUDENT_DEMANDS, {
      demandIds,
    });
  },

  /**
   * Process dues payment
   */
  async processDuesPayment(paymentData) {
    return apiService.call(
      API_ENDPOINTS.DUES.PROCESS_DUES_PAYMENT,
      paymentData,
    );
  },
};

export default { feeApi, duesApi };
