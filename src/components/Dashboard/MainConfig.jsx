import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Paper,
  Typography,
  TextField,
  Box,
} from '@mui/material';
import CustomBreadcrumb from '../../utils/CustomBreadcrumb';

const MainConfig = () => {
  const { theme, setTheme, defaultTheme } = useTheme();
  const [localTheme, setLocalTheme] = useState(theme);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    message: '',
  });

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalTheme((prev) => ({ ...prev, [name]: value }));
  };

  const confirmAction = (actionType) => {
    const message =
      actionType === 'save'
        ? 'Do you want to apply this theme?'
        : 'Do you want to reset the theme to default?';

    setConfirmDialog({ open: true, action: actionType, message });
  };

  const handleConfirmed = () => {
    if (confirmDialog.action === 'save') {
      setTheme(localTheme);
    } else if (confirmDialog.action === 'reset') {
      setLocalTheme(defaultTheme);
      setTheme(defaultTheme);
    }
    setConfirmDialog({ open: false, action: null, message: '' });
  };

  return (
    <>
      <CustomBreadcrumb
        title="Theme Config"
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
          🎨 Theme Config
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <label>
            Navbar Background:
            <input
              type="color"
              name="navbarBg"
              value={localTheme.navbarBg}
              onChange={handleChange}
              style={{ width: '100%', height: '40px', border: 'none', cursor: 'pointer' }}
            />
          </label>

          <label>
            Sidebar Background:
            <input
              type="color"
              name="sidebarBg"
              value={localTheme.sidebarBg}
              onChange={handleChange}
              style={{ width: '100%', height: '40px', border: 'none', cursor: 'pointer' }}
            />
          </label>

          <label>
            Form Background:
            <input
              type="color"
              name="formBg"
              value={localTheme.formBg}
              onChange={handleChange}
              style={{ width: '100%', height: '40px', border: 'none', cursor: 'pointer' }}
            />
          </label>

          <label>
            Paper/Form Box Background:
            <input
              type="color"
              name="paperBg"
              value={localTheme.paperBg}
              onChange={handleChange}
              style={{ width: '100%', height: '40px', border: 'none', cursor: 'pointer' }}
            />
          </label>

          <TextField
            select
            fullWidth
            label="Font Family"
            name="fontFamily"
            value={localTheme.fontFamily}
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
              <option key={font} value={font}>{font}</option>
            ))}
          </TextField>

          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => confirmAction('save')}
            >
              Save & Apply
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => confirmAction('reset')}
            >
              Reset
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

export default MainConfig;
