import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Box, Typography } from '@mui/material';
import { WifiOff, Wifi } from '@mui/icons-material';

const OfflineNotification = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show offline message if already offline
    if (!navigator.onLine) {
      setShowOfflineMessage(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Snackbar
      open={showOfflineMessage}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ 
        top: { xs: 120, sm: 70 },
        zIndex: 9999 
      }}
    >
      <Alert
        severity="warning"
        icon={<WifiOff />}
        sx={{
          backgroundColor: 'warning.main',
          color: 'warning.contrastText',
          '& .MuiAlert-icon': {
            color: 'warning.contrastText'
          }
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            You're offline
          </Typography>
          <Typography variant="caption">
            Some features may be limited. You can still view cached content.
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default OfflineNotification;
