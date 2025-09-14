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

const AddExam = () => {
  const { theme, fontColor } = useTheme();

  const [examName, setExamName] = useState('');

  // ✅ Initial state from localStorage
  const [exams, setExams] = useState(() => {
    return JSON.parse(localStorage.getItem('examMaster')) || [];
  });

  const [editIndex, setEditIndex] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Track if form is dirty
  const isDirty = !!examName;
  usePrompt(
    'You have unsaved changes. Are you sure you want to leave this page?',
    isDirty && editIndex === null,
  );
  useBeforeUnload(isDirty);

  // ✅ Save to localStorage whenever exams change
  useEffect(() => {
    localStorage.setItem('examMaster', JSON.stringify(exams));
  }, [exams]);

  const resetForm = () => {
    setExamName('');
    setEditIndex(null);
    setErrors({});
  };

  const handleSave = () => {
    const newErrors = {};

    if (!examName.trim()) {
      newErrors.examName = 'Exam Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(examName)) {
      newErrors.examName = 'Only alphabets allowed';
    } else if (examName.length > 50) {
      newErrors.examName = 'Max 50 characters allowed';
    }

    const trimmedName = examName.trim().toLowerCase();
    const isDuplicateName = exams.some(
      (ex, idx) =>
        ex.examName.trim().toLowerCase() === trimmedName && idx !== editIndex,
    );

    if (isDuplicateName) newErrors.examName = 'Exam Name already exists';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ✅ id generate (always sequential increasing)
    let newId;
    if (editIndex !== null) {
      newId = exams[editIndex].id; // edit case me same id rahega
    } else {
      const maxId = exams.length
        ? Math.max(...exams.map(e => parseInt(e.id, 10)))
        : 0;
      newId = String(maxId + 1).padStart(2, '0'); // 01, 02, 03...
    }

    const newExam = {
      id: newId,
      examName,
    };

    if (editIndex !== null) {
      const updated = [...exams];
      updated[editIndex] = newExam;
      setExams(updated);
    } else {
      setExams([...exams, newExam]);
    }

    resetForm();
  };

  const handleDelete = () => {
    const updated = exams.filter((_, i) => i !== editIndex);
    setExams(updated);
    resetForm();
    setDeleteConfirm(false);
  };

  const handleDoubleClick = exam => {
    setExamName(exam.examName);

    // original exams array me correct index dhoondhna
    const originalIndex = exams.findIndex(e => e.id === exam.id);

    setEditIndex(originalIndex);
    setErrors({});
  };

  return (
    <Box sx={{ p: 3, minHeight: '100%' }}>
      <CustomBreadcrumb title='Create Exam' showHome={true} />

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
            Exam Master
          </Typography>

          <FilledTextField
            label='Exam Name'
            fullWidth
            margin='normal'
            value={examName}
            required
            inputProps={{ maxLength: 20 }}
            onChange={e => {
              const value = e.target.value;
              setExamName(value);
            }}
            error={!!errors.examName}
            helperText={errors.examName}
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
            Saved Exams
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
                    <strong>Exam Name</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...exams]
                  .sort((a, b) => a.examName.localeCompare(b.examName))
                  .map((exam, idx) => (
                    <TableRow
                      key={exam.id}
                      hover
                      onDoubleClick={() => handleDoubleClick(exam)} // ✅ direct exam bhej rahe
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ color: fontColor.paper }}>
                        {idx + 1}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {exam.examName}
                      </TableCell>
                    </TableRow>
                  ))}

                {exams.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
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
        <DialogTitle>Do you want to delete this exam?</DialogTitle>
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

export default AddExam;
