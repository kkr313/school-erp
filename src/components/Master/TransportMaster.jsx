import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import { usePrompt } from '../../hooks/usePrompt';
import { useBeforeUnload } from '../../hooks/useBeforeUnload';
import FilledTextField from '../../utils/FilledTextField';
import CustomBreadcrumb from '../ui/navigation/CustomBreadcrumb';

const TransportMaster = () => {
  const { theme, fontColor } = useTheme();

  const [routeName, setRouteName] = useState('');
  const [routeStop, setRouteStop] = useState('');
  const [fee, setFee] = useState('');
  const [routes, setRoutes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Detect unsaved changes only when not editing
  const isDirty = !!routeName || !!routeStop || !!fee;
  usePrompt(
    'You have unsaved changes. Are you sure you want to leave this page?',
    isDirty && editIndex === null,
  );

  useBeforeUnload(isDirty);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('transportRoutes')) || [];
    setRoutes(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('transportRoutes', JSON.stringify(routes));
  }, [routes]);

  const resetForm = () => {
    setRouteName('');
    setRouteStop('');
    setFee('');
    setEditIndex(null);
    setErrors({});
  };

  const handleSave = () => {
    const newErrors = {};
    if (!routeName.trim()) newErrors.routeName = 'Route Name is required';
    if (!routeStop.trim()) newErrors.routeStop = 'Route Stop is required';
    if (!fee.trim()) newErrors.fee = 'Fee is required';
    else if (isNaN(fee)) newErrors.fee = 'Fee must be a number';

    const trimmedName = routeName.trim().toLowerCase();
    const trimmedStop = routeStop.trim().toLowerCase();

    const isDuplicate = routes.some(
      (r, idx) =>
        r.routeName.trim().toLowerCase() === trimmedName &&
        r.routeStop.trim().toLowerCase() === trimmedStop &&
        idx !== editIndex,
    );

    if (isDuplicate) {
      newErrors.routeName = 'Duplicate Route Name and Stop combination';
      newErrors.routeStop = 'Duplicate Route Name and Stop combination';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newRoute = { routeName, routeStop, fee };

    if (editIndex !== null) {
      const updated = [...routes];
      updated[editIndex] = newRoute;
      setRoutes(updated);
    } else {
      setRoutes([...routes, newRoute]);
    }

    resetForm();
  };

  const handleDelete = () => {
    const updated = routes.filter((_, i) => i !== editIndex);
    setRoutes(updated);
    resetForm();
    setDeleteConfirm(false);
  };

  const handleDoubleClick = index => {
    const selected = routes[index];
    setRouteName(selected.routeName);
    setRouteStop(selected.routeStop);
    setFee(selected.fee);
    setEditIndex(index);
    setErrors({});
  };

  const handleFeeChange = e => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFee(value);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap',
        flexDirection: 'column',
        backgroundColor: theme.bodyBg,
        px: { xs: 2, sm: 2 },
        py: { xs: 1, sm: 0 },
      }}
    >
      <CustomBreadcrumb
        title='Transport Master'
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Admin', href: '/admin' },
        ]}
      />

      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: { xs: '100%', md: 400 },
          height: 'fit-content',
          flexShrink: 0,
          backgroundColor: theme.paperBg,
          color: fontColor.paper,
          borderRadius: 2,
          mt: -4,
        }}
      >
        {/* <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.formHeaderFontColor,
            fontFamily: theme.formHeaderFontFamily,
          }}
        >
          Transport Detail Master
        </Typography> */}

        <FilledTextField
          label='Route Name'
          fullWidth
          margin='normal'
          value={routeName}
          required
          onChange={e => setRouteName(e.target.value)}
          error={!!errors.routeName}
          helperText={errors.routeName}
        />

        <FilledTextField
          label='Route Stop'
          fullWidth
          margin='normal'
          value={routeStop}
          required
          onChange={e => setRouteStop(e.target.value)}
          error={!!errors.routeStop}
          helperText={errors.routeStop}
        />

        <FilledTextField
          label='Fee'
          fullWidth
          margin='normal'
          value={fee}
          required
          onChange={handleFeeChange}
          error={!!errors.fee}
          helperText={errors.fee}
          inputProps={{ inputMode: 'numeric' }}
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          {editIndex === null ? (
            <Button variant='contained' fullWidth onClick={handleSave}>
              Save
            </Button>
          ) : (
            <>
              <Button variant='contained' fullWidth onClick={handleSave}>
                Update
              </Button>
              <Button
                variant='outlined'
                color='error'
                fullWidth
                onClick={() => setDeleteConfirm(true)}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          flex: 1,
          minWidth: 300,
          backgroundColor: theme.paperBg,
          color: fontColor.paper,
          borderRadius: 2,
        }}
      >
        <Typography
          variant='h6'
          gutterBottom
          sx={{ fontWeight: 600, color: fontColor.paper }}
        >
          Saved Routes
        </Typography>

        <TableContainer
          component={Paper}
          sx={{ backgroundColor: theme.paperBg }}
        >
          <Table size='small'>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ color: 'black' }}>
                  <strong>Route Name</strong>
                </TableCell>
                <TableCell sx={{ color: 'black' }}>
                  <strong>Stop</strong>
                </TableCell>
                <TableCell sx={{ color: 'black' }}>
                  <strong>Fee</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes.map((route, idx) => (
                <TableRow
                  key={idx}
                  hover
                  onDoubleClick={() => handleDoubleClick(idx)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ color: fontColor.paper }}>
                    {route.routeName}
                  </TableCell>
                  <TableCell sx={{ color: fontColor.paper }}>
                    {route.routeStop}
                  </TableCell>
                  <TableCell sx={{ color: fontColor.paper }}>
                    {route.fee}
                  </TableCell>
                </TableRow>
              ))}
              {routes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align='center'
                    sx={{ color: fontColor.paper }}
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme.paperBg,
            color: fontColor.paper,
          },
        }}
      >
        <DialogTitle>Do you want to delete this route?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransportMaster;
