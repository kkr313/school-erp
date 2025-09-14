// src/components/Admission/FormActions.jsx
import React, { useMemo } from 'react';
import { Box, Button } from '@mui/material';

const FormActions = React.memo(({ onSubmit, onReset, theme, fontColor }) => {
  // Memoize container styles
  const containerSx = useMemo(
    () => ({
      display: 'flex',
      justifyContent: 'center',
      gap: 2,
      mt: 3,
    }),
    [],
  );

  // Memoize button styles
  const resetButtonSx = useMemo(
    () => ({
      color: fontColor.paper,
      borderColor: fontColor.paper,
      '&:hover': {
        borderColor: fontColor.paper,
        backgroundColor: 'rgba(0,0,0,0.04)',
      },
    }),
    [fontColor.paper],
  );

  const submitButtonSx = useMemo(
    () => ({
      backgroundColor: theme.buttonBg,
      color: theme.buttonFontColor,
      '&:hover': {
        backgroundColor: theme.buttonBg,
        opacity: 0.9,
      },
    }),
    [theme.buttonBg, theme.buttonFontColor],
  );

  return (
    <Box className='span-3' sx={containerSx}>
      <Button
        type='button'
        onClick={onReset}
        variant='outlined'
        sx={resetButtonSx}
      >
        Reset Form
      </Button>
      <Button type='submit' variant='contained' sx={submitButtonSx}>
        Submit Admission
      </Button>
    </Box>
  );
});

FormActions.displayName = 'FormActions';

export default FormActions;
