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
  Autocomplete,
} from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import { usePrompt } from '../../hooks/usePrompt';
import { useBeforeUnload } from '../../hooks/useBeforeUnload';
import FilledTextField from '../../utils/FilledTextField';
import FilledAutocomplete from '../../utils/FilledAutocomplete';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import CustomBreadcrumb from '../ui/navigation/CustomBreadcrumb';

const classCategories = [
  'Pre-Primary',
  'Primary',
  'Secondary',
  'Senior Secondary',
];

const ClassMaster = () => {
  const { theme, fontColor } = useTheme();

  const [className, setClassName] = useState('');
  const [classCategory, setClassCategory] = useState('');
  const [classOrder, setClassOrder] = useState('');
  const [classes, setClasses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Track if form is dirty and no editing is going on
  const isDirty = !!className || !!classCategory || !!classOrder;
  usePrompt(
    'You have unsaved changes. Are you sure you want to leave this page?',
    isDirty && editIndex === null,
  );

  useBeforeUnload(isDirty);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('classMaster')) || [];
    setClasses(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('classMaster', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    if (editIndex === null) {
      const orders = classes
        .map(c => parseInt(c.classOrder))
        .filter(n => !isNaN(n));
      const nextOrder = orders.length ? Math.max(...orders) + 1 : 1;
      setClassOrder(nextOrder.toString());
    }
  }, [classes, editIndex]);

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: fontColor.paper },
      '&:hover fieldset': { borderColor: fontColor.paper },
      '&.Mui-focused fieldset': { borderColor: fontColor.paper },
    },
    '& .MuiInputLabel-root': { color: fontColor.paper },
    '& .MuiFormHelperText-root': { color: fontColor.paper },
    input: { color: fontColor.paper },
  };

  const resetForm = () => {
    setClassName('');
    setClassCategory('');
    setEditIndex(null);
    setErrors({});
    const orders = classes
      .map(c => parseInt(c.classOrder))
      .filter(n => !isNaN(n));
    const nextOrder = orders.length ? Math.max(...orders) + 1 : 1;
    setClassOrder(nextOrder.toString());
  };

  const handleSave = () => {
    const newErrors = {};
    if (!className.trim()) newErrors.className = 'Class Name is required';
    if (!classCategory) newErrors.classCategory = 'Class Category is required';
    if (!classOrder.trim())
      newErrors.classOrder = 'Class Order No. is required';

    const trimmedName = className.trim().toLowerCase();

    const isDuplicateName = classes.some(
      (cls, idx) =>
        cls.className.trim().toLowerCase() === trimmedName && idx !== editIndex,
    );

    const isDuplicateOrder = classes.some(
      (cls, idx) => cls.classOrder === classOrder && idx !== editIndex,
    );

    if (isDuplicateName) newErrors.className = 'Class Name already exists';
    if (isDuplicateOrder)
      newErrors.classOrder = 'Class Order No. already exists';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newClass = { className, classCategory, classOrder };

    if (editIndex !== null) {
      const updated = [...classes];
      updated[editIndex] = newClass;
      setClasses(updated);
    } else {
      setClasses([...classes, newClass]);
    }

    resetForm();
  };

  const handleDelete = () => {
    const updated = classes.filter((_, i) => i !== editIndex);
    setClasses(updated);
    resetForm();
    setDeleteConfirm(false);
  };

  const handleDoubleClick = index => {
    const selected = classes[index];
    setClassName(selected.className);
    setClassCategory(selected.classCategory);
    setClassOrder(selected.classOrder);
    setEditIndex(index);
    setErrors({});
  };

  const handleOrderChange = e => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setClassOrder(value);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100%',
        px: { xs: 2, sm: 2 },
        py: { xs: 1, sm: 0 },
      }}
    >
      <CustomBreadcrumb title='Class Master' showHome={true} />

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Left Form Box */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: 400,
            backgroundColor: theme.paperBg,
            color: fontColor.paper,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: 2,
            mt: -1,
          }}
        >
          {/* <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: 600,
              color: theme.formHeaderFontColor,
              fontFamily: theme.formHeaderFontFamily,
            }}
          >
            Class Detail Master
          </Typography> */}

          <FilledTextField
            label='Name of Class'
            fullWidth
            margin='normal'
            value={className}
            required
            onChange={e => setClassName(e.target.value)}
            error={!!errors.className}
            helperText={errors.className}
          />

          <FilledAutocomplete
            options={classCategories}
            value={classCategory}
            onChange={(_, value) => setClassCategory(value || '')}
            label='Class Category'
            required
            error={!!errors.classCategory}
            helperText={errors.classCategory}
            popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
            clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          />

          <FilledTextField
            label='Class Order No.'
            fullWidth
            margin='normal'
            value={classOrder}
            required
            onChange={handleOrderChange}
            inputProps={{ inputMode: 'numeric' }}
            error={!!errors.classOrder}
            helperText={errors.classOrder}
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

        {/* Right Table Box */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            flex: 1,
            minWidth: 300,
            backgroundColor: theme.paperBg,
            color: fontColor.paper,
            borderRadius: 2,
            mt: -1,
          }}
        >
          <Typography
            variant='h6'
            gutterBottom
            sx={{ fontWeight: 600, color: fontColor.paper }}
          >
            Saved Classes
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ backgroundColor: theme.paperBg }}
          >
            <Table size='small'>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>
                    <strong>Class Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Order</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...classes]
                  .sort((a, b) => Number(a.classOrder) - Number(b.classOrder))
                  .map((cls, idx) => (
                    <TableRow
                      key={idx}
                      hover
                      onDoubleClick={() => handleDoubleClick(idx)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ color: fontColor.paper }}>
                        {cls.className}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {cls.classCategory}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {cls.classOrder}
                      </TableCell>
                    </TableRow>
                  ))}
                {classes.length === 0 && (
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
      </Box>

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
        <DialogTitle>Do you want to delete the class?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleDelete} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassMaster;
