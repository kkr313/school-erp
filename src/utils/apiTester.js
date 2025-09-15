// src/utils/apiTester.js
/**
 * API Testing Utility for Dynamic School ERP System
 * This utility helps test and debug API calls across different school configurations
 */

import { apiService } from '../api/apiService.js';
import { API_ENDPOINTS, API_CONFIG } from '../api/endpoints.js';
import { getBaseUrlBySchoolCode, getAvailableSchoolCodes } from './schoolBaseUrls.jsx';

export class ApiTester {
  constructor() {
    this.testResults = [];
    this.currentSchoolCode = null;
  }

  /**
   * Test API endpoint with different school codes
   */
  async testEndpoint(endpoint, data = {}, schoolCodes = null) {
    const codesToTest = schoolCodes || getAvailableSchoolCodes();
    const results = [];

    for (const schoolCode of codesToTest) {
      console.log(`🧪 Testing ${endpoint} with school code: ${schoolCode}`);
      
      // Temporarily set school code for testing
      const originalSchoolCode = sessionStorage.getItem('schoolCode');
      sessionStorage.setItem('schoolCode', schoolCode);
      
      try {
        const startTime = Date.now();
        const result = await apiService.call(endpoint, data);
        const endTime = Date.now();
        
        results.push({
          schoolCode,
          endpoint,
          status: 'success',
          responseTime: endTime - startTime,
          dataSize: JSON.stringify(result).length,
          data: result,
          baseUrl: getBaseUrlBySchoolCode(schoolCode),
        });
        
        console.log(`✅ ${schoolCode}: Success (${endTime - startTime}ms)`);
      } catch (error) {
        results.push({
          schoolCode,
          endpoint,
          status: 'error',
          error: error.message,
          baseUrl: getBaseUrlBySchoolCode(schoolCode),
        });
        
        console.log(`❌ ${schoolCode}: ${error.message}`);
      }
      
      // Restore original school code
      if (originalSchoolCode) {
        sessionStorage.setItem('schoolCode', originalSchoolCode);
      } else {
        sessionStorage.removeItem('schoolCode');
      }
    }

    this.testResults.push({ endpoint, results, timestamp: new Date().toISOString() });
    return results;
  }

  /**
   * Test common endpoints across all schools
   */
  async testCommonEndpoints() {
    const commonEndpoints = [
      API_ENDPOINTS.CLASSES.GET_CLASSES,
      API_ENDPOINTS.MASTERS.GET_GENDERS,
      API_ENDPOINTS.MASTERS.GET_RELIGIONS,
      API_ENDPOINTS.MASTERS.GET_SCHOOL_DETAILS,
    ];

    console.log('🚀 Testing common endpoints across all schools...');
    
    for (const endpoint of commonEndpoints) {
      await this.testEndpoint(endpoint);
    }

    this.generateReport();
  }

  /**
   * Test specific school configuration
   */
  async testSchoolConfiguration(schoolCode) {
    console.log(`🏫 Testing configuration for school: ${schoolCode}`);
    
    const baseUrl = getBaseUrlBySchoolCode(schoolCode);
    if (!baseUrl) {
      console.error(`❌ No base URL configured for school code: ${schoolCode}`);
      return;
    }

    // Test basic connectivity
    try {
      const response = await fetch(`${baseUrl}/api/Schools/GetSchoolDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'BS-SchoolCode': schoolCode,
        },
        body: JSON.stringify({ trackingID: 'API_TEST' }),
      });

      if (response.ok) {
        const schoolDetails = await response.json();
        console.log(`✅ ${schoolCode} - School Details:`, schoolDetails.name || 'Unknown School');
        return schoolDetails;
      } else {
        console.log(`⚠️ ${schoolCode} - HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${schoolCode} - Connection Error: ${error.message}`);
    }
  }

  /**
   * Generate test report
   */
  generateReport() {
    console.log('\n📊 API Test Report');
    console.log('='.repeat(50));

    const summary = {
      totalTests: 0,
      successfulTests: 0,
      failedTests: 0,
      averageResponseTime: 0,
      schoolCoverage: new Set(),
    };

    let totalResponseTime = 0;
    let responseTimeCount = 0;

    this.testResults.forEach(({ endpoint, results }) => {
      console.log(`\n🔗 Endpoint: ${endpoint}`);
      
      results.forEach(result => {
        summary.totalTests++;
        summary.schoolCoverage.add(result.schoolCode);
        
        if (result.status === 'success') {
          summary.successfulTests++;
          totalResponseTime += result.responseTime;
          responseTimeCount++;
          console.log(`  ✅ ${result.schoolCode}: ${result.responseTime}ms`);
        } else {
          summary.failedTests++;
          console.log(`  ❌ ${result.schoolCode}: ${result.error}`);
        }
      });
    });

    summary.averageResponseTime = responseTimeCount > 0 ? 
      Math.round(totalResponseTime / responseTimeCount) : 0;

    console.log('\n📈 Summary:');
    console.log(`  Total Tests: ${summary.totalTests}`);
    console.log(`  Successful: ${summary.successfulTests}`);
    console.log(`  Failed: ${summary.failedTests}`);
    console.log(`  Success Rate: ${Math.round((summary.successfulTests / summary.totalTests) * 100)}%`);
    console.log(`  Average Response Time: ${summary.averageResponseTime}ms`);
    console.log(`  Schools Tested: ${summary.schoolCoverage.size}`);

    return summary;
  }

  /**
   * Debug API configuration
   */
  debugConfiguration() {
    console.log('\n🔧 API Configuration Debug');
    console.log('='.repeat(50));
      console.log('📋 Environment Variables:');
    const envVars = import.meta.env;
    Object.keys(envVars).filter(key => key.startsWith('VITE_')).forEach(key => {
      console.log(`  ${key}: ${envVars[key]}`);
    });

    console.log('\n🌐 API Config:');
    console.log('  Default Base URL:', API_CONFIG.DEFAULT_BASE_URL);
    console.log('  Debug Mode:', API_CONFIG.DEBUG_MODE);
    console.log('  Timeout:', API_CONFIG.TIMEOUT);
    console.log('  Retry Attempts:', API_CONFIG.RETRY_ATTEMPTS);

    console.log('\n🏫 Available School Codes:');
    getAvailableSchoolCodes().forEach(code => {
      console.log(`  ${code}: ${getBaseUrlBySchoolCode(code)}`);
    });

    console.log('\n🔐 Session Storage:');
    console.log('  School Code:', sessionStorage.getItem('schoolCode'));
    console.log('  Token:', sessionStorage.getItem('token') ? 'Present' : 'Missing');
    console.log('  User Token:', sessionStorage.getItem('userToken') || 'Using default');
  }
}

// Export singleton instance
export const apiTester = new ApiTester();

// Global debug function for browser console
if (typeof window !== 'undefined') {
  window.testApi = apiTester;
  window.debugApi = () => apiTester.debugConfiguration();
}
