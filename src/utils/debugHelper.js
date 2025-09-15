// src/utils/debugHelper.js
/**
 * Debug Helper for School ERP API System
 * Provides utility functions to debug API calls and school configuration
 */

import { getBaseUrlBySchoolCode, getAvailableSchoolCodes } from './schoolBaseUrls.jsx';
import { API_CONFIG } from '../api/endpoints.js';

export class DebugHelper {
  static logCurrentConfiguration() {
    const schoolCode = sessionStorage.getItem('schoolCode');
    const baseUrl = getBaseUrlBySchoolCode(schoolCode);
    const token = sessionStorage.getItem('token');
    
    console.group('🔧 School ERP Debug Information');
    console.log('📋 Current Session:');
    console.log(`  School Code: ${schoolCode || 'Not Set'}`);
    console.log(`  Base URL: ${baseUrl || 'Not Found'}`);
    console.log(`  Auth Token: ${token ? 'Present' : 'Missing'}`);
    
    console.log('\n🌐 Available School Codes:');
    getAvailableSchoolCodes().forEach(code => {
      const url = getBaseUrlBySchoolCode(code);
      const isCurrent = code === schoolCode;
      console.log(`  ${isCurrent ? '👉' : '  '} ${code}: ${url}`);
    });
    
    console.log('\n⚙️ API Configuration:');
    console.log(`  Default Base URL: ${API_CONFIG.DEFAULT_BASE_URL}`);
    console.log(`  Debug Mode: ${API_CONFIG.DEBUG_MODE}`);
    console.log(`  Environment: ${API_CONFIG.ENVIRONMENT}`);
    
    console.groupEnd();
  }

  static testSchoolCodeUrl(schoolCode) {
    const baseUrl = getBaseUrlBySchoolCode(schoolCode);
    if (!baseUrl) {
      console.error(`❌ No base URL found for school code: ${schoolCode}`);
      return false;
    }
    
    console.log(`✅ School code ${schoolCode} maps to: ${baseUrl}`);
    return true;
  }

  static async testApiEndpoint(endpoint, schoolCode = null) {
    const testSchoolCode = schoolCode || sessionStorage.getItem('schoolCode');
    const baseUrl = getBaseUrlBySchoolCode(testSchoolCode);
    
    if (!baseUrl) {
      console.error(`❌ Cannot test endpoint: No base URL for school code ${testSchoolCode}`);
      return;
    }
    
    const fullUrl = `${baseUrl}${endpoint}`;
    console.log(`🧪 Testing endpoint: ${fullUrl}`);
    
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'BS-SchoolCode': testSchoolCode,
        },
        body: JSON.stringify({ trackingID: 'DEBUG_TEST' }),
      });
      
      console.log(`📊 Response: ${response.status} ${response.statusText}`);
      return response.ok;
    } catch (error) {
      console.error(`❌ Error testing endpoint: ${error.message}`);
      return false;
    }
  }

  static setDebugSchoolCode(schoolCode) {
    if (!getAvailableSchoolCodes().includes(schoolCode)) {
      console.error(`❌ Invalid school code: ${schoolCode}`);
      console.log('Available codes:', getAvailableSchoolCodes());
      return false;
    }
    
    sessionStorage.setItem('schoolCode', schoolCode);
    console.log(`✅ School code set to: ${schoolCode}`);
    console.log(`🌐 Base URL: ${getBaseUrlBySchoolCode(schoolCode)}`);
    return true;
  }

  static clearSession() {
    sessionStorage.removeItem('schoolCode');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userToken');
    console.log('✅ Session cleared');
  }

  static showApiCallExample() {
    const schoolCode = sessionStorage.getItem('schoolCode') || 'T36';
    console.log(`
📘 API Call Example for school code: ${schoolCode}

// Set school code first
sessionStorage.setItem('schoolCode', '${schoolCode}');

// Use callApi with relative endpoint
const { callApi } = useApi();
const data = await callApi('/TEO-School-API/api/GetStudents/GetFilterStudents', {
  trackingID: 'string'
});

// This will automatically resolve to:
// ${getBaseUrlBySchoolCode(schoolCode)}/TEO-School-API/api/GetStudents/GetFilterStudents
    `);
  }
}

// Export for global access in browser console
if (typeof window !== 'undefined') {
  window.DebugHelper = DebugHelper;
  window.debugERP = () => DebugHelper.logCurrentConfiguration();
  window.setSchoolCode = (code) => DebugHelper.setDebugSchoolCode(code);
  window.testEndpoint = (endpoint, schoolCode) => DebugHelper.testApiEndpoint(endpoint, schoolCode);
}

export default DebugHelper;
