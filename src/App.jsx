// src/App.jsx
import { useEffect, useState, createContext, useContext } from 'react';
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { customHistory } from './history'; // ✅ custom history
import { initializeSchoolConfiguration } from './utils/schoolBaseUrls'; // ✅ Dynamic school config
import DebugHelper from './utils/debugHelper'; // ✅ Debug helper
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboards/Dashboard';
import AdmissionForm from './components/student/admission/AdmissionForm';
import Login from './components/auth/Login';

// PWA Components
import PWAInstallPrompt from './components/features/pwa/PWAInstallPrompt';
import PWAUpdateNotifier from './components/features/pwa/PWAUpdateNotifier';
import OfflineNotification from './components/features/pwa/OfflineNotification';

import StudentEnquiry from './components/student/enquiry/StudentEnquiry';
import Expense from './components/financial/expense/ExpenseForm';
import ClassMaster from './components/master/ClassMaster';
import FeeHeadMaster from './components/master/FeeHeadMaster';
import TransportMaster from './components/master/TransportMaster';
import EmployeeMaster from './components/master/EmployeeMaster';
import ThemeConfig from './components/dashboards/MainConfig';
import { useTheme } from './context/ThemeContext';
import ConfigurationDashboard from './components/dashboards/ConfigurationDashboard';
import MainConfig from './components/dashboards/MainConfig';
import HeaderConfig from './components/dashboards/HeaderConfig';
import SchoolMaster from './components/master/SchoolMaster';
import PrintHeaderConfig from './components/ui/print/PrintHeaderConfig';
import StudentDetailReport from './components/reports/StudentDetailReport';
import ExpensesReport from './components/reports/ExpensesReport';
import ExpenseDashboard from './components/dashboards/ExpenseDashboard';
import ExpenseReport from './components/reports/ExpensesReport';
import CollectionDashboard from './components/dashboards/CollectionDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ReportDashboard from './components/dashboards/ReportDashboard';
import FeeCollectionDateWiseReport from './components/reports/FeeCollectionDateWiseReport';
import AttendanceDashboard from './components/dashboards/AttendanceDashboard';
import StudentAttendanceForm from './components/student/attendance/StudentAttendanceForm';
import StudentAttendanceReport from './components/student/attendance/StudentAttendanceReport';
import MonthlyAttendanceReport from './components/student/attendance/MonthlyAttendanceReport';
import DemandBill from './components/financial/billing/DemandBill';
import InitSchoolMaster from './utils/InitSchoolMaster.jsx';
import ExamDashboard from './components/dashboards/ExamDashboard';
import AdmitCardDeclaration from './components/academic/exam/AdmitCardDeclaration';
import PrintAdmitCard from './components/academic/exam/PrintAdmitCard';
import AddExam from './components/academic/exam/AddExam';
import AddSubject from './components/academic/exam/AddSubject';
import AddSubjectWiseMarks from './components/academic/exam/AddSubjectWiseMarks';
import FeeCollection from './components/financial/collection/FeeCollection';
import DuesCollection from './components/financial/collection/DuesCollection';
import PrintFeeConfig from './components/financial/collection/PrintFeeConfig';
import CancelFeeCollection from './components/financial/collection/CancelFeeCollection';

// Authentication Context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Layout Wrapper
function LayoutWrapper({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default to collapsed
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const { theme, fontColor } = useTheme();

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const marginLeft = isLoginPage
    ? 0
    : isMobile
      ? 0
      : isSidebarCollapsed
        ? '4.5rem' // Updated for new sidebar design
        : '18.5rem'; // Updated for wider sidebar (72 * 0.25rem = 18rem + padding)

  return (
    <div>
      {!isLoginPage && (
        <Navbar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onVisibilityChange={setIsNavbarVisible}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      )}
      {!isLoginPage && (
        <Sidebar
          collapsed={isSidebarCollapsed}
          setCollapsed={setIsSidebarCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      )}
      <div
        className='transition-all duration-500'
        style={{
          marginLeft,
          backgroundColor: theme.formBg,
          color: fontColor.form,
          fontFamily: theme.fontFamily,
          minHeight: '100vh',
          width: isMobile ? '100%' : 'auto',
          paddingTop: isMobile ? (isNavbarVisible ? '0rem' : '1rem') : '0rem', // Dynamic padding based on navbar visibility
          paddingLeft: isMobile ? '0' : '1.25rem',
          paddingRight: isMobile ? '0' : '1.25rem',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#6b7280',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated)
    return <Navigate to='/login' state={{ from: location }} replace />;
  return element;
};

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auto-logout function
  const handleAutoLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    sessionStorage.clear();
  };

  // Set up auto-logout timer when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const expiry = sessionStorage.getItem('tokenExpiry');
      if (expiry) {
        const timeLeft = parseInt(expiry) - new Date().getTime();
        if (timeLeft > 0) {
          const timer = setTimeout(handleAutoLogout, timeLeft);
          return () => clearTimeout(timer);
        } else {
          handleAutoLogout();
        }
      }
    }
  }, [isAuthenticated]);

  // Periodic session check
  useEffect(() => {
    if (isAuthenticated) {
      const checkSession = () => {
        const expiry = sessionStorage.getItem('tokenExpiry');
        if (!expiry || new Date().getTime() >= parseInt(expiry)) {
          handleAutoLogout();
        }
      };

      // Check session every minute
      const interval = setInterval(checkSession, 60000);

      // Check session when window gains focus
      const handleFocus = () => checkSession();
      window.addEventListener('focus', handleFocus);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [isAuthenticated]);

  // Initial auth check on app mount (no clearing of valid sessions)
  useEffect(() => {
    const initializeApp = async () => {      // Initialize dynamic school configuration
      try {
        await initializeSchoolConfiguration();
        console.log('✅ School configuration initialized');
        
        // Log debug information in development
        if (import.meta.env.MODE === 'development') {
          setTimeout(() => {
            DebugHelper.logCurrentConfiguration();
            console.log('💡 Use window.debugERP() to see debug info anytime');
            console.log('💡 Use window.setSchoolCode("T36") to change school code');
          }, 1000);
        }
      } catch (error) {
        console.warn('⚠️ Failed to initialize school configuration:', error.message);
      }
    };

    initializeApp();

    const checkLogin = async () => {
      // First check if we have a valid session token
      const token = sessionStorage.getItem('token');
      const expiry = sessionStorage.getItem('tokenExpiry');
      const isAuthenticatedFromStorage =
        localStorage.getItem('isAuthenticated');

      if (token && expiry && new Date().getTime() < parseInt(expiry)) {
        // Valid session exists
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        setLoading(false);
        return;
      }

      // If localStorage says authenticated but no valid session, check saved credentials
      if (isAuthenticatedFromStorage === 'true') {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        const savedSchoolCode = localStorage.getItem('schoolCode');

        if (savedUsername && savedPassword && savedSchoolCode) {
          try {
            const response = await fetch(
              'https://teo-vivekanadbihar.co.in/api/Login/Login',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'BS-SchoolCode': savedSchoolCode,
                },
                body: JSON.stringify({
                  username: savedUsername,
                  password: savedPassword,
                  trackingID: 'WEB_APP',
                }),
              },
            );

            if (response.ok) {
              const result = await response.json();
              if (result.isValid) {
                // Store new session
                const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
                sessionStorage.setItem('token', result.userToken);
                const newExpiry = new Date().getTime() + SESSION_DURATION;
                sessionStorage.setItem('tokenExpiry', newExpiry);
                sessionStorage.setItem('schoolCode', savedSchoolCode);

                setIsAuthenticated(true);
                localStorage.setItem('isAuthenticated', 'true');
              } else {
                // Invalid credentials, clear them
                setIsAuthenticated(false);
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('username');
                localStorage.removeItem('password');
                sessionStorage.clear();
              }
            } else {
              // API error, clear credentials
              setIsAuthenticated(false);
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('username');
              localStorage.removeItem('password');
              sessionStorage.clear();
            }
          } catch (error) {
            console.error('Auto-login check failed:', error);
            setIsAuthenticated(false);
            localStorage.removeItem('isAuthenticated');
            sessionStorage.clear();
          }
        } else {
          // No saved credentials but isAuthenticated is true - clear it
          setIsAuthenticated(false);
          localStorage.removeItem('isAuthenticated');
          sessionStorage.clear();
        }
      } else {
        // Not authenticated
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        sessionStorage.clear();
      }

      setLoading(false);
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, loading }}
    >
      <HistoryRouter history={customHistory}>
        {isAuthenticated && <InitSchoolMaster />}

        {/* PWA Components */}
        <PWAInstallPrompt />
        <PWAUpdateNotifier />
        <OfflineNotification />

        <LayoutWrapper>
          <Routes>
            <Route path='/' element={<Navigate to='/dashboard' />} />
            <Route path='/login' element={<Login />} />
            <Route
              path='/dashboard'
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path='/admission'
              element={<ProtectedRoute element={<AdmissionForm />} />}
            />
            <Route
              path='/fee-collection'
              element={<ProtectedRoute element={<FeeCollection />} />}
            />
            <Route
              path='/dues-collection'
              element={<ProtectedRoute element={<DuesCollection />} />}
            />
            <Route
              path='/student-enquiry'
              element={<ProtectedRoute element={<StudentEnquiry />} />}
            />
            <Route
              path='/expense'
              element={<ProtectedRoute element={<ExpenseDashboard />} />}
            />
            <Route
              path='/expense/add'
              element={<ProtectedRoute element={<Expense />} />}
            />
            <Route
              path='/expense/report'
              element={<ProtectedRoute element={<ExpenseReport />} />}
            />
            <Route
              path='/master/class'
              element={<ProtectedRoute element={<ClassMaster />} />}
            />
            <Route
              path='/master/fee-head'
              element={<ProtectedRoute element={<FeeHeadMaster />} />}
            />
            <Route
              path='/master/transport'
              element={<ProtectedRoute element={<TransportMaster />} />}
            />
            <Route
              path='/master/employee'
              element={<ProtectedRoute element={<EmployeeMaster />} />}
            />
            <Route
              path='/master/school'
              element={<ProtectedRoute element={<SchoolMaster />} />}
            />
            <Route
              path='/settings'
              element={<ProtectedRoute element={<ConfigurationDashboard />} />}
            />
            <Route
              path='/configuration'
              element={<ProtectedRoute element={<ConfigurationDashboard />} />}
            />
            <Route
              path='/configuration/main'
              element={<ProtectedRoute element={<MainConfig />} />}
            />            <Route
              path='/configuration/header'
              element={<ProtectedRoute element={<HeaderConfig />} />}
            />
            <Route
              path='/configuration/print-header'
              element={<ProtectedRoute element={<PrintHeaderConfig />} />}
            />
            <Route
              path='/configuration/print-fee'
              element={<ProtectedRoute element={<PrintFeeConfig />} />}
            />
            <Route
              path='/cancel-fee-collection'
              element={<ProtectedRoute element={<CancelFeeCollection />} />}
            />
            <Route
              path='/configuration/print-header'
              element={<ProtectedRoute element={<PrintHeaderConfig />} />}
            />
            <Route
              path='/report/student-detail'
              element={<ProtectedRoute element={<StudentDetailReport />} />}
            />
            <Route
              path='/configuration/print-header'
              element={<ProtectedRoute element={<PrintHeaderConfig />} />}
            />
            <Route
              path='/configuration/print-header'
              element={<ProtectedRoute element={<PrintHeaderConfig />} />}
            />
            <Route
              path='/collection'
              element={<ProtectedRoute element={<CollectionDashboard />} />}
            />
            <Route
              path='/admin'
              element={<ProtectedRoute element={<AdminDashboard />} />}
            />
            <Route
              path='/report'
              element={<ProtectedRoute element={<ReportDashboard />} />}
            />
            <Route
              path='/report/fee-collection'
              element={
                <ProtectedRoute element={<FeeCollectionDateWiseReport />} />
              }
            />
            <Route
              path='/attendance'
              element={<ProtectedRoute element={<AttendanceDashboard />} />}
            />
            <Route
              path='/attendance/mark'
              element={<ProtectedRoute element={<StudentAttendanceForm />} />}
            />
            <Route
              path='/attendance/report'
              element={<ProtectedRoute element={<StudentAttendanceReport />} />}
            />
            <Route
              path='/attendance/report-monthly'
              element={<ProtectedRoute element={<MonthlyAttendanceReport />} />}
            />
            <Route
              path='/demand-bill'
              element={<ProtectedRoute element={<DemandBill />} />}
            />
            <Route
              path='/exam'
              element={<ProtectedRoute element={<ExamDashboard />} />}
            />
            <Route
              path='/exam/admit-card'
              element={<ProtectedRoute element={<AdmitCardDeclaration />} />}
            />
            <Route
              path='/exam/print-admit-card'
              element={<ProtectedRoute element={<PrintAdmitCard />} />}
            />
            <Route
              path='/exam/add-subject'
              element={<ProtectedRoute element={<AddSubject />} />}
            />
            <Route
              path='/exam/add-exam'
              element={<ProtectedRoute element={<AddExam />} />}
            />
            <Route
              path='/exam/add-subject-marks'
              element={<ProtectedRoute element={<AddSubjectWiseMarks />} />}
            />
          </Routes>
        </LayoutWrapper>
      </HistoryRouter>
    </AuthContext.Provider>
  );
}

export default App;
