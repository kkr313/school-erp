import React from 'react';
import { Box } from '@mui/material';
import { FaRupeeSign, FaWallet } from 'react-icons/fa';
import CustomBreadcrumb from '../ui/navigation/CustomBreadcrumb';
import ModernDashboardCard from '../ui/cards/ModernDashboardCard';

const collectionFeatures = [
  {
    label: 'Fee Collection',
    icon: <FaRupeeSign />,
    color: '#059669',
    path: '/fee-collection',
    description: 'Collect student fees',
  },
  {
    label: 'Dues Collection',
    icon: <FaWallet />,
    color: '#dc2626',
    path: '/dues-collection',
    description: 'Outstanding payments',
  },
];

const CollectionDashboard = () => {
  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title='Collection Dashboard'
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
      />

      {/* <Typography
        variant="h4"
        gutterBottom
        className='text-center md:text-left'
        sx={{
          marginBottom: 2,
          fontSize: { xs: '1.8rem', sm: '2.15rem' },
          color: theme.formHeaderFontColor,
          fontFamily: theme.formHeaderFontFamily,
          fontWeight: 600,
        }}
      >
        Collection Dashboard
      </Typography> */}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 3, sm: 4 },
          mt: -1,
          justifyContent: { xs: 'space-around', md: 'flex-start' },
          alignItems: 'stretch',
          padding: { xs: 1, sm: 2 },
        }}
      >
        {collectionFeatures.map((feature, index) => (
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

export default CollectionDashboard;
