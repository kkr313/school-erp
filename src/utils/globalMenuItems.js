// globalMenuItems.js
// Use objects for icons, not JSX elements, to avoid syntax errors in JS files
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import * as BsIcons from 'react-icons/bs';
import * as FiIcons from 'react-icons/fi';
import { IoStatsChartSharp } from 'react-icons/io5';

export const menuItems = [
  { title: 'Dashboard', icon: MdIcons.MdDashboard, path: '/dashboard' },
  { title: 'Admission', icon: FaIcons.FaUserGraduate, path: '/admission' },
  {
    title: 'Fee Collection',
    icon: FaIcons.FaRupeeSign,
    path: '/fee-collection',
  },
  {
    title: 'Student Enquiry',
    icon: BsIcons.BsPersonLinesFill,
    path: '/student-enquiry',
  },
  { title: 'Expenses', icon: FaIcons.FaWallet, path: '/expense' },
];

export const masterItems = [
  { title: 'School Master', icon: MdIcons.MdSchool, path: '/master/school' },
  { title: 'Class Master', icon: MdIcons.MdClass, path: '/master/class' },
  {
    title: 'Employee Master',
    icon: FaIcons.FaUserTie,
    path: '/master/employee',
  },
  {
    title: 'Fee Head Master',
    icon: FaIcons.FaRupeeSign,
    path: '/master/fee-head',
  },
];

export const attendanceItems = [
  {
    title: 'Mark Attendance',
    icon: BsIcons.BsCalendarCheck,
    path: '/attendance/mark',
  },
  {
    title: 'Attendance Report',
    icon: FaIcons.FaClipboardCheck,
    path: '/attendance/report',
  },
  {
    title: 'Monthly Report',
    icon: IoStatsChartSharp,
    path: '/attendance/report-monthly',
  },
];

export const examItems = [
  { title: 'Exam Dashboard', icon: FaIcons.FaGraduationCap, path: '/exam' },
  { title: 'Add Subject', icon: MdIcons.MdSchool, path: '/exam/add-subject' },
  { title: 'Create Exam', icon: MdIcons.MdEvent, path: '/exam/add-exam' },
  { title: 'Admit Card', icon: FiIcons.FiFileText, path: '/exam/admit-card' },
];

export const collectionItems = [
  { title: 'Fee Collection', icon: BsIcons.BsCollection, path: '/collection' },
  {
    title: 'Dues Management',
    icon: FiIcons.FiDollarSign,
    path: '/dues-collection',
  },
  { title: 'Demand Bill', icon: FiIcons.FiFileText, path: '/demand-bill' },
];

export const reportItems = [
  {
    title: 'Student Reports',
    icon: FaIcons.FaFileAlt,
    path: '/report/student-detail',
  },
  {
    title: 'Fee Reports',
    icon: FiIcons.FiDollarSign,
    path: '/report/fee-collection',
  },
  {
    title: 'Enquiry Reports',
    icon: FiIcons.FiUsers,
    path: '/report/student-enquiry',
  },
  { title: 'Analytics', icon: FiIcons.FiBarChart, path: '/report' },
];

export const configItems = [
  { title: 'System Config', icon: MdIcons.MdSettings, path: '/configuration' },
  { title: 'Theme Settings', icon: FaIcons.FaCog, path: '/configuration/main' },
  {
    title: 'Header Config',
    icon: FiIcons.FiFileText,
    path: '/configuration/header',
  },
];
