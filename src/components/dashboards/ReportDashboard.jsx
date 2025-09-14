import React from 'react';
import { Box } from '@mui/material';
import {
  FaFileAlt,
  FaFileInvoiceDollar,
  FaQuestionCircle,
  FaFileExport,
} from 'react-icons/fa';
import CustomBreadcrumb from '../ui/navigation/CustomBreadcrumb';
import ModernDashboardCard from '../ui/cards/ModernDashboardCard';

const reportFeatures = [
  {
    label: 'Student Detail Report',
    icon: <FaFileAlt />,
    color: '#3b82f6', // blue-500
    path: '/report/student-detail',
    description: 'Student information reports',
  },
  {
    label: 'Fee Collection Report',
    icon: <FaFileInvoiceDollar />,
    color: '#10b981', // green-500
    path: '/report/fee-collection',
    description: 'Financial collection data',
  },
  {
    label: 'Student Enquiry Report',
    icon: <FaQuestionCircle />,
    color: '#facc15', // yellow-400
    path: '/report/student-enquiry',
    description: 'Enquiry analytics',
  },
  {
    label: 'Expense Report',
    icon: <FaFileExport />,
    color: '#ef4444', // red-500
    path: '/expense/report',
    description: 'Expense tracking reports',
  },
];

const ReportDashboard = () => {
  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title='Report Dashboard'
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
      />

      {/* <Typography
        variant="h4"
        gutterBottom
        className="text-center md:text-left"
        sx={{
          marginBottom: 2,
          fontSize: { xs: "1.8rem", sm: "2.15rem" },
          color: theme.formHeaderFontColor,
          fontFamily: theme.formHeaderFontFamily,
          fontWeight: 600,
        }}
      >
        Report Dashboard
      </Typography> */}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 3 },
          justifyContent: { xs: 'space-around', md: 'flex-start' },
          mt: -1,
          alignItems: 'stretch',
        }}
      >
        {reportFeatures.map((feature, index) => (
          <ModernDashboardCard
            key={feature.label}
            label={feature.label}
            icon={feature.icon}
            color={feature.color}
            path={feature.path}
            description={feature.description}
            index={index}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ReportDashboard;
