import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

const PWAUpdateNotifier = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New update available
                setWaitingWorker(newWorker);
                setShowUpdatePrompt(true);
              }
            });
          }
        });
      });

      // Listen for controlling service worker changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdatePrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <Snackbar
      open={showUpdatePrompt}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ top: { xs: 80, sm: 24 } }}
    >
      <Alert
        severity='success'
        action={
          <>
            <Button
              size='small'
              variant='contained'
              startIcon={<Refresh />}
              onClick={handleUpdate}
              sx={{
                mr: 1,
                backgroundColor: 'success.main',
                '&:hover': {
                  backgroundColor: 'success.dark',
                },
              }}
            >
              Update
            </Button>
            <Button
              size='small'
              onClick={handleDismiss}
              sx={{ color: 'text.secondary' }}
            >
              Later
            </Button>
          </>
        }
      >
        A new version is available!
      </Alert>
    </Snackbar>
  );
};

export default PWAUpdateNotifier;
