import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import CustomBreadcrumb from '../../utils/CustomBreadcrumb';

const HeaderConfig = () => {
  const { theme, setTheme, defaultTheme } = useTheme();

  const [localTheme, setLocalTheme] = useState({
    formHeaderFontColor: theme.formHeaderFontColor,
    formHeaderFontFamily: theme.formHeaderFontFamily,
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    message: '',
  });

  useEffect(() => {
    setLocalTheme({
      formHeaderFontColor: theme.formHeaderFontColor,
      formHeaderFontFamily: theme.formHeaderFontFamily,
    });
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalTheme((prev) => ({ ...prev, [name]: value }));
  };

  const confirmAction = (actionType) => {
    setConfirmDialog({
      open: true,
      action: actionType,
      message:
        actionType === 'save'
          ? 'Do you want to apply this header config?'
          : 'Do you want to reset the header config to default?',
    });
  };

  const handleConfirmed = () => {
    if (confirmDialog.action === 'save') {
      setTheme((prev) => ({
        ...prev,
        formHeaderFontColor: localTheme.formHeaderFontColor,
        formHeaderFontFamily: localTheme.formHeaderFontFamily,
      }));
    } else if (confirmDialog.action === 'reset') {
      setTheme((prev) => ({
        ...prev,
        formHeaderFontColor: defaultTheme.formHeaderFontColor,
        formHeaderFontFamily: defaultTheme.formHeaderFontFamily,
      }));
      setLocalTheme({
        formHeaderFontColor: defaultTheme.formHeaderFontColor,
        formHeaderFontFamily: defaultTheme.formHeaderFontFamily,
      });
    }
    setConfirmDialog({ open: false, action: null, message: '' });
  };

  return (
    <>
      <CustomBreadcrumb
        title="Header Config"
        links={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Configuration", href: "/configuration" },
        ]}
      />
      <Paper
        elevation={3}
        sx={{
          width: '95%',
          maxWidth: { sm: 480 }, // sirf small screen ke upar maxWidth 480
          mx: 'auto',
          mt: 2,
          p: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          🖋 Header Config
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <label>
            Form Header Font Color:
            <input
              type="color"
              name="formHeaderFontColor"
              value={localTheme.formHeaderFontColor}
              onChange={handleChange}
              style={{ width: '100%', height: '40px', border: 'none', cursor: 'pointer' }}
            />
          </label>

          <TextField
            select
            fullWidth
            label="Form Header Font Family"
            name="formHeaderFontFamily"
            value={localTheme.formHeaderFontFamily}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            {[
              'Poppins', 'Arial', 'Courier New', 'Verdana', 'Tahoma',
              'Trebuchet MS', 'Times New Roman', 'Georgia', 'Lucida Console',
              'Segoe UI', 'Calibri', 'Cambria', 'Garamond', 'Palatino Linotype',
              'Impact', 'Comic Sans MS', 'Franklin Gothic Medium', 'Century Gothic',
              'Monaco', 'Constantia'
            ].map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </TextField>

          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={() => confirmAction('save')}
            >
              Save Header Config
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => confirmAction('reset')}
            >
              Reset to Default
            </Button>
          </Box>
        </Box>

        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ open: false, action: null, message: '' })}
        >
          <DialogTitle>{confirmDialog.message}</DialogTitle>
          <DialogActions>
            <Button onClick={() => setConfirmDialog({ open: false, action: null, message: '' })}>
              Cancel
            </Button>
            <Button onClick={handleConfirmed} variant="contained" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default HeaderConfig;
