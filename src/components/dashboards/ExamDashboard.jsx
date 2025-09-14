import React from 'react';
import { Box } from '@mui/material';
import {
  FaIdCard,
  FaPrint,
  FaBook,
  FaClipboardList,
  FaBookOpen,
} from 'react-icons/fa';
import CustomBreadcrumb from '../ui/navigation/CustomBreadcrumb';
import ModernDashboardCard from '../ui/cards/ModernDashboardCard';
const examFeatures = [
  {
    label: 'Declare Admit Card',
    icon: <FaIdCard size={40} />,
    color: '#16a34a',
    path: '/exam/admit-card',
    description: 'Generate admit cards',
  },
  {
    label: 'Print Admit Card',
    icon: <FaPrint size={40} />,
    color: '#2563eb',
    path: '/exam/print-admit-card',
    description: 'Print student cards',
  },
  {
    label: 'Add Subject',
    icon: <FaBook size={40} />,
    color: '#f59e0b',
    path: '/exam/add-subject',
    description: 'Manage subjects',
  },
  {
    label: 'Add Exam',
    icon: <FaClipboardList size={40} />,
    color: '#9333ea',
    path: '/exam/add-exam',
    description: 'Create examinations',
  },
  {
    label: 'Add Subject Marks',
    icon: <FaBookOpen size={40} />,
    color: '#dc2626',
    path: '/exam/add-subject-marks',
    description: 'Enter marks & grades',
  },
];

const ExamDashboard = () => {
  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title=' Exam Dashboard'
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
      />

      {/* <Typography
        variant="h4"
        gutterBottom
        className="text-center md:text-left"
        sx={{
          mb: 2,
          fontSize: { xs: "1.8rem", sm: "2.15rem" },
          color: theme.formHeaderFontColor,
          fontFamily: theme.formHeaderFontFamily,
          fontWeight: 600,
        }}
      >
        Exam Dashboard
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
        {examFeatures.map((feature, index) => (
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

export default ExamDashboard;
