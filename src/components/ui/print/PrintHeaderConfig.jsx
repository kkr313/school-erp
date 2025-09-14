// src/components/config/PrintHeaderConfig.jsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { useTheme } from '../../../context/ThemeContext';
import HeaderPDF from './HeaderPDF'; // ✅ import your HeaderPDF component
import CustomBreadcrumb from '../navigation/CustomBreadcrumb';

const PrintHeaderConfig = () => {
  const { theme, setTheme, defaultTheme } = useTheme();

  const [localConfig, setLocalConfig] = useState({
    printHeaderFontColor: theme.printHeaderFontColor || '#000000',
    printHeaderFontFamily: theme.printHeaderFontFamily || 'Poppins',
    printSubHeaderFontColor: theme.printSubHeaderFontColor || '#000000',
    printSubHeaderFontFamily: theme.printSubHeaderFontFamily || 'Poppins',
    printHeaderStyle: theme.printHeaderStyle || 'style1',
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    message: '',
  });

  useEffect(() => {
    setLocalConfig({
      printHeaderFontColor: theme.printHeaderFontColor || '#000000',
      printHeaderFontFamily: theme.printHeaderFontFamily || 'Poppins',
      printSubHeaderFontColor: theme.printSubHeaderFontColor || '#000000',
      printSubHeaderFontFamily: theme.printSubHeaderFontFamily || 'Poppins',
      printHeaderStyle: theme.printHeaderStyle || 'style1',
    });
  }, [theme]);

  const handleChange = e => {
    const { name, value } = e.target;
    setLocalConfig(prev => ({ ...prev, [name]: value }));
  };

  const confirmAction = type => {
    setConfirmDialog({
      open: true,
      action: type,
      message:
        type === 'save'
          ? 'Do you want to apply this print header config?'
          : 'Do you want to reset the print header config to default?',
    });
  };

  const handleConfirmed = () => {
    if (confirmDialog.action === 'save') {
      setTheme({
        ...theme,
        ...localConfig,
      });
    } else if (confirmDialog.action === 'reset') {
      setTheme({
        ...theme,
        printHeaderFontColor: defaultTheme.printHeaderFontColor || '#000000',
        printHeaderFontFamily: defaultTheme.printHeaderFontFamily || 'Poppins',
        printSubHeaderFontColor:
          defaultTheme.printSubHeaderFontColor || '#000000',
        printSubHeaderFontFamily:
          defaultTheme.printSubHeaderFontFamily || 'Poppins',
        printHeaderStyle: defaultTheme.printHeaderStyle || 'style1',
      });
      setLocalConfig({
        printHeaderFontColor: defaultTheme.printHeaderFontColor || '#000000',
        printHeaderFontFamily: defaultTheme.printHeaderFontFamily || 'Poppins',
        printSubHeaderFontColor:
          defaultTheme.printSubHeaderFontColor || '#000000',
        printSubHeaderFontFamily:
          defaultTheme.printSubHeaderFontFamily || 'Poppins',
        printHeaderStyle: defaultTheme.printHeaderStyle || 'style1',
      });
    }
    setConfirmDialog({ open: false, action: null, message: '' });
  };

  const fontOptions = [
    'Poppins',
    'Arial',
    'Courier New',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Times New Roman',
    'Georgia',
    'Lucida Console',
    'Segoe UI',
    'Calibri',
    'Cambria',
    'Garamond',
    'Palatino Linotype',
    'Impact',
    'Comic Sans MS',
    'Franklin Gothic Medium',
    'Century Gothic',
    'Monaco',
    'Constantia',
  ];

  const headerStyleOptions = [
    { label: 'Classic', value: 'style1' },
    { label: 'Modern', value: 'style2' },
    { label: 'Compact', value: 'style3' },
    { label: 'Bold', value: 'style4' },
    { label: 'Custom', value: 'style5' },
  ];

  return (
    <>
      <CustomBreadcrumb
        title='Print Header Config'
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Configuration', href: '/configuration' },
        ]}
      />
      <Paper
        elevation={3}
        sx={{
          width: '95%',
          maxWidth: { sm: 480 },
          mx: 'auto',
          mt: 2,
          p: 3,
        }}
      >
        <Typography variant='h5' fontWeight={600} gutterBottom>
          🖨 Print Header Config
        </Typography>

        <Box display='flex' flexDirection='column' gap={2}>
          <label>School Name Font Color:</label>
          <input
            type='color'
            name='printHeaderFontColor'
            value={localConfig.printHeaderFontColor}
            onChange={handleChange}
            style={{
              width: '100%',
              height: '40px',
              border: 'none',
              cursor: 'pointer',
            }}
          />

          <TextField
            select
            fullWidth
            label='School Name Font Family'
            name='printHeaderFontFamily'
            value={localConfig.printHeaderFontFamily}
            onChange={handleChange}
          >
            {fontOptions.map(font => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </TextField>

          <label>Other Content Font Color:</label>
          <input
            type='color'
            name='printSubHeaderFontColor'
            value={localConfig.printSubHeaderFontColor}
            onChange={handleChange}
            style={{
              width: '100%',
              height: '40px',
              border: 'none',
              cursor: 'pointer',
            }}
          />

          <TextField
            select
            fullWidth
            label='Other Content Font Family'
            name='printSubHeaderFontFamily'
            value={localConfig.printSubHeaderFontFamily}
            onChange={handleChange}
          >
            {fontOptions.map(font => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label='Print Header Style'
            name='printHeaderStyle'
            value={localConfig.printHeaderStyle}
            onChange={handleChange}
          >
            {headerStyleOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Box display='flex' gap={2} mt={2}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={() => confirmAction('save')}
            >
              Save Config
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              fullWidth
              onClick={() => confirmAction('reset')}
            >
              Reset Default
            </Button>
          </Box>
        </Box>

        {/* ✅ Preview Section */}
        <Box mt={3} p={2} border='1px dashed grey' borderRadius={2}>
          <Typography variant='subtitle1' gutterBottom>
            🔎 Preview
          </Typography>
          <HeaderPDF overrideStyle={localConfig} />{' '}
          {/* Pass localConfig for live preview */}
        </Box>

        <Dialog
          open={confirmDialog.open}
          onClose={() =>
            setConfirmDialog({ open: false, action: null, message: '' })
          }
        >
          <DialogTitle>{confirmDialog.message}</DialogTitle>
          <DialogActions>
            <Button
              onClick={() =>
                setConfirmDialog({ open: false, action: null, message: '' })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmed} variant='contained' autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default PrintHeaderConfig;
