import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
import { useTheme } from '../../../context/ThemeContext';
import { usePrompt } from '../../../hooks/usePrompt';
import { useBeforeUnload } from '../../../hooks/useBeforeUnload';
import FilledTextField from '../../../utils/FilledTextField';
import CustomBreadcrumb from '../../ui/navigation/CustomBreadcrumb';

const AddSubject = () => {
  const { theme, fontColor } = useTheme();

  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');

  // ✅ Initial state from localStorage
  const [subjects, setSubjects] = useState(() => {
    return JSON.parse(localStorage.getItem('subjectMaster')) || [];
  });

  const [editIndex, setEditIndex] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Track if form is dirty
  const isDirty = !!subjectName || !!subjectCode;
  usePrompt(
    'You have unsaved changes. Are you sure you want to leave this page?',
    isDirty && editIndex === null,
  );
  useBeforeUnload(isDirty);

  // ✅ Save to localStorage whenever subjects change
  useEffect(() => {
    localStorage.setItem('subjectMaster', JSON.stringify(subjects));
  }, [subjects]);

  const resetForm = () => {
    setSubjectName('');
    setSubjectCode('');
    setEditIndex(null);
    setErrors({});
  };

  const handleSave = () => {
    const newErrors = {};

    if (!subjectName.trim()) {
      newErrors.subjectName = 'Subject Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(subjectName)) {
      newErrors.subjectName = 'Only alphabets allowed';
    } else if (subjectName.length > 30) {
      newErrors.subjectName = 'Max 30 characters allowed';
    }

    if (!subjectCode.trim()) {
      newErrors.subjectCode = 'Subject Code is required';
    } else if (!/^\d+$/.test(subjectCode)) {
      newErrors.subjectCode = 'Only numbers allowed';
    } else if (subjectCode.length > 4) {
      newErrors.subjectCode = 'Max 4 digits allowed';
    }

    const trimmedName = subjectName.trim().toLowerCase();
    const trimmedCode = subjectCode.trim().toLowerCase();

    const isDuplicateName = subjects.some(
      (subj, idx) =>
        subj.subjectName.trim().toLowerCase() === trimmedName &&
        idx !== editIndex,
    );
    const isDuplicateCode = subjects.some(
      (subj, idx) =>
        subj.subjectCode.trim().toLowerCase() === trimmedCode &&
        idx !== editIndex,
    );

    if (isDuplicateName) newErrors.subjectName = 'Subject Name already exists';
    if (isDuplicateCode) newErrors.subjectCode = 'Subject Code already exists';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ✅ id generate (always sequential increasing)
    let newId;
    if (editIndex !== null) {
      newId = subjects[editIndex].id; // edit case me same id rahega
    } else {
      const maxId = subjects.length
        ? Math.max(...subjects.map(s => parseInt(s.id, 10)))
        : 0;
      newId = String(maxId + 1).padStart(2, '0'); // 01, 02, 03...
    }

    const newSubject = {
      id: newId,
      subjectName,
      subjectCode,
    };

    if (editIndex !== null) {
      const updated = [...subjects];
      updated[editIndex] = newSubject;
      setSubjects(updated);
    } else {
      setSubjects([...subjects, newSubject]);
    }

    resetForm();
  };

  const handleDelete = () => {
    const updated = subjects.filter((_, i) => i !== editIndex);
    setSubjects(updated);
    resetForm();
    setDeleteConfirm(false);
  };

  const handleDoubleClick = subject => {
    setSubjectName(subject.subjectName);
    setSubjectCode(subject.subjectCode);

    // original subjects array me correct index dhoondhna (id ya subjectCode se)
    const originalIndex = subjects.findIndex(s => s.id === subject.id);

    setEditIndex(originalIndex);
    setErrors({});
  };

  return (
    <Box sx={{ p: 3, minHeight: '100%' }}>
      <CustomBreadcrumb title='Add Subject' showHome={true} />

      <Box
        component='form'
        autoComplete='off'
        sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}
      >
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
          }}
        >
          <Typography
            variant='h5'
            align='center'
            sx={{
              fontWeight: 600,
              color: theme.formHeaderFontColor,
              fontFamily: theme.formHeaderFontFamily,
            }}
          >
            Subject Master
          </Typography>

          <FilledTextField
            label='Subject Name'
            fullWidth
            margin='normal'
            value={subjectName}
            required
            inputProps={{ maxLength: 30 }}
            onChange={e => {
              const value = e.target.value;
              // Sirf alphabets aur spaces allow
              if (/^[A-Za-z\s]*$/.test(value)) {
                setSubjectName(value);
              }
            }}
            error={!!errors.subjectName}
            helperText={errors.subjectName}
          />

          <FilledTextField
            label='Subject Code'
            fullWidth
            margin='normal'
            value={subjectCode}
            required
            inputProps={{ maxLength: 4 }}
            onChange={e => setSubjectCode(e.target.value.replace(/\D/g, ''))} // allow only numbers
            error={!!errors.subjectCode}
            helperText={errors.subjectCode}
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
          }}
        >
          <Typography
            variant='h6'
            gutterBottom
            sx={{ fontWeight: 600, color: fontColor.paper }}
          >
            Saved Subjects
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ backgroundColor: theme.paperBg }}
          >
            <Table size='small'>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>
                    <strong>SlNo</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Subject Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Subject Code</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...subjects]
                  .sort(
                    (a, b) => parseInt(a.subjectCode) - parseInt(b.subjectCode),
                  )
                  .map((subj, idx) => (
                    <TableRow
                      key={subj.id}
                      hover
                      onDoubleClick={() => handleDoubleClick(subj)} // ✅ direct subject bhej rahe
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ color: fontColor.paper }}>
                        {idx + 1}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {subj.subjectName}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {subj.subjectCode}
                      </TableCell>
                    </TableRow>
                  ))}

                {subjects.length === 0 && (
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
        <DialogTitle>Do you want to delete this subject?</DialogTitle>
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

export default AddSubject;
