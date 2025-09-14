import React from 'react';
import { Box } from '@mui/material';
import { FaPlusCircle, FaFileInvoice } from 'react-icons/fa';
import CustomBreadcrumb from '../ui/navigation/CustomBreadcrumb';
import ModernDashboardCard from '../ui/cards/ModernDashboardCard';

const expenseFeatures = [
  {
    label: 'Add Expense',
    icon: <FaPlusCircle />,
    color: '#16a34a',
    path: '/expense/add',
    description: 'Record new expenses',
  },
  {
    label: 'Expense Report',
    icon: <FaFileInvoice />,
    color: '#dc2626',
    path: '/expense/report',
    description: 'View expense analytics',
  },
];

const ExpenseDashboard = () => {
  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title='Expense Dashboard'
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
      />

      {/* <Typography variant="h4" gutterBottom
                className='text-center md:text-left'
                sx={{
                    marginBottom: 2,
                    fontSize: { xs: '1.8rem', sm: '2.15rem' },
                    color: theme.formHeaderFontColor,
                    fontFamily: theme.formHeaderFontFamily,
                    fontWeight: 600
                }}>
                Expense Dashboard
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
        {expenseFeatures.map((feature, index) => (
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

export default ExpenseDashboard;
