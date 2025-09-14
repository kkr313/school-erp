import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TableContainer,
} from '@mui/material';
import Class from '../../ui/forms/dropdown/Class';
import { useTheme } from '../../../context/ThemeContext'; // ✅ Theme import
import FilledAutocomplete from '../../../utils/FilledAutocomplete';
import { ArrowDropDown, Clear } from '@mui/icons-material';
import CustomBreadcrumb from '../../ui/navigation/CustomBreadcrumb';

const AddSubjectWiseMarks = () => {
  const { theme, fontColor } = useTheme(); // ✅ Theme use

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: fontColor.paper },
      '&:hover fieldset': { borderColor: fontColor.paper },
      '&.Mui-focused fieldset': { borderColor: fontColor.paper },
      '&.Mui-disabled': {
        color: fontColor.paper,
        borderColor: fontColor.paper,
        WebkitTextFillColor: fontColor.paper,
      },
    },
    '& .MuiInputLabel-root': { color: fontColor.paper },
    input: { color: fontColor.paper },
  };

  const checkboxStyles = {
    color: fontColor.paper,
    '&.Mui-checked': {
      color: theme.primary || '#1976d2',
    },
  };

  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showSubjects, setShowSubjects] = useState(false);
  const [marksData, setMarksData] = useState({});

  // error states
  const [examError, setExamError] = useState(false);
  const [classError, setClassError] = useState(false);

  const [displayExam, setDisplayExam] = useState('');
  const [displayClass, setDisplayClass] = useState(null);

  useEffect(() => {
    const storedExams = JSON.parse(localStorage.getItem('examMaster')) || [];
    const storedSubjects =
      JSON.parse(localStorage.getItem('subjectMaster')) || [];
    setExams(storedExams);
    setSubjects(storedSubjects);
  }, []);

  const handleCheckboxChange = (subjectCode, checked) => {
    setMarksData(prev => {
      const updated = { ...prev };
      if (checked) {
        if (!updated[subjectCode]) {
          updated[subjectCode] = {
            fullMarks: '',
            passMarks: '',
            selected: true,
            error: '',
          };
        } else {
          updated[subjectCode].selected = true;
        }
      } else {
        if (updated[subjectCode]) {
          updated[subjectCode].selected = false;
        }
      }
      return updated;
    });
  };

  // ✅ Updated: Pass Marks validation
  const handleMarksChange = (subjectCode, field, value) => {
    setMarksData(prev => {
      const updated = { ...prev };

      if (!updated[subjectCode]) {
        updated[subjectCode] = {
          fullMarks: '',
          passMarks: '',
          selected: true,
          error: '',
        };
      }

      if (field === 'passMarks') {
        const full = Number(updated[subjectCode].fullMarks || 0);
        const pass = Number(value);

        if (pass > full) {
          // ❌ Reset and show error
          updated[subjectCode].passMarks = '';
          updated[subjectCode].error =
            'Pass Marks must be less than or equal to Full Marks';
          return updated;
        } else {
          updated[subjectCode].error = '';
        }
      }

      updated[subjectCode][field] = value;
      return updated;
    });
  };

  const handleSave = () => {
    if (!selectedExam || !selectedClass) {
      alert('Please select exam and class!');
      return;
    }

    const filteredData = [];
    Object.keys(marksData).forEach(code => {
      if (marksData[code].selected) {
        filteredData.push({
          examId: selectedExam,
          classId: selectedClass.value,
          className: selectedClass.label,
          subjectId: code,
          subjectName:
            subjects.find(s => s.subjectCode === code)?.subjectName || '',
          fullMarks: marksData[code].fullMarks,
          passMarks: marksData[code].passMarks,
        });
      }
    });

    const allMarks = JSON.parse(localStorage.getItem('marksData')) || [];
    const updatedMarks = allMarks.filter(
      d => !(d.examId === selectedExam && d.classId === selectedClass.value),
    );
    updatedMarks.push(...filteredData);

    localStorage.setItem('marksData', JSON.stringify(updatedMarks));

    alert('Marks saved successfully!');

    setMarksData({});
    setShowSubjects(false);
    setSelectedExam('');
    setSelectedClass(null);
  };

  const handleShow = () => {
    let valid = true;

    if (!selectedExam) {
      setExamError(true);
      valid = false;
    } else {
      setExamError(false);
    }

    if (!selectedClass) {
      setClassError(true);
      valid = false;
    } else {
      setClassError(false);
    }

    if (!valid) return;

    // ✅ Show ke time displayExam/Class set honge
    setDisplayExam(selectedExam);
    setDisplayClass(selectedClass);

    const allMarks = JSON.parse(localStorage.getItem('marksData')) || [];
    const savedData = allMarks.filter(
      d => d.examId === selectedExam && d.classId === selectedClass.value,
    );

    const prefilledData = {};
    subjects.forEach(subj => {
      const existing = savedData.find(d => d.subjectId === subj.subjectCode);
      if (existing) {
        prefilledData[subj.subjectCode] = {
          fullMarks: existing.fullMarks,
          passMarks: existing.passMarks,
          selected: true,
          error: '',
        };
      } else {
        prefilledData[subj.subjectCode] = {
          fullMarks: '',
          passMarks: '',
          selected: false,
          error: '',
        };
      }
    });

    setMarksData(prefilledData);
    setShowSubjects(true);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <CustomBreadcrumb title='Subject Wise Marks Entry' showHome={true} />

      <Paper elevation={3} sx={{ p: 3, backgroundColor: theme.paperBg }}>
        <Typography
          variant='h4'
          align='center'
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.8rem', sm: '2.15rem' },
            color: theme.formHeaderFontColor,
            fontFamily: theme.formHeaderFontFamily,
            mb: 3,
          }}
        >
          Add Subject Wise Marks
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          <FilledAutocomplete
            options={exams}
            getOptionLabel={option => option.examName || ''}
            value={exams.find(exam => exam.id === selectedExam) || null}
            onChange={(event, newValue) => {
              setSelectedExam(newValue ? newValue.id : '');
              setExamError(false);
            }}
            label='Select Exam'
            fullWidth
            error={examError}
            helperText={examError ? 'Exam is required' : ''}
            popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
            clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          />

          <Class
            value={selectedClass}
            onClassChange={val => {
              setSelectedClass(val);
              setClassError(false);
            }}
            error={classError}
            helperText={classError ? 'Class is required' : ''}
          />
        </Box>

        <Button
          variant='contained'
          color='primary'
          sx={{ mt: 2 }}
          onClick={handleShow}
        >
          Show
        </Button>
      </Paper>

      {showSubjects && (
        <Paper sx={{ mt: 3, p: 2, backgroundColor: theme.paperBg }}>
          <Typography
            variant='h6'
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.formHeaderFontColor,
              fontFamily: theme.formHeaderFontFamily,
            }}
          >
            Subjects for Exam :{' '}
            {exams.find(e => e.id === displayExam)?.examName || ''} - Class :{' '}
            {displayClass?.label}
          </Typography>

          <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      sx={checkboxStyles}
                      checked={
                        subjects.length > 0 &&
                        subjects.every(
                          subj => marksData[subj.subjectCode]?.selected,
                        )
                      }
                      indeterminate={
                        subjects.some(
                          subj => marksData[subj.subjectCode]?.selected,
                        ) &&
                        !subjects.every(
                          subj => marksData[subj.subjectCode]?.selected,
                        )
                      }
                      onChange={e => {
                        const checked = e.target.checked;
                        setMarksData(prev => {
                          const updated = { ...prev };
                          subjects.forEach(subj => {
                            if (!updated[subj.subjectCode]) {
                              updated[subj.subjectCode] = {
                                fullMarks: '',
                                passMarks: '',
                                selected: checked,
                                error: '',
                              };
                            } else {
                              updated[subj.subjectCode].selected = checked;
                            }
                          });
                          return updated;
                        });
                      }}
                    />
                    <strong>Select All</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Subject Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Full Marks</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Pass Marks</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {subjects.map(subj => (
                  <TableRow key={subj.subjectCode}>
                    <TableCell>
                      <Checkbox
                        sx={checkboxStyles}
                        checked={marksData[subj.subjectCode]?.selected || false}
                        onChange={e =>
                          handleCheckboxChange(
                            subj.subjectCode,
                            e.target.checked,
                          )
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {subj.subjectName}
                    </TableCell>
                    <TableCell>
                      <TextField
                        type='number'
                        value={marksData[subj.subjectCode]?.fullMarks || ''}
                        onChange={e =>
                          handleMarksChange(
                            subj.subjectCode,
                            'fullMarks',
                            e.target.value,
                          )
                        }
                        disabled={!marksData[subj.subjectCode]?.selected}
                        sx={textFieldStyles}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                          type='number'
                          value={marksData[subj.subjectCode]?.passMarks || ''}
                          onChange={e =>
                            handleMarksChange(
                              subj.subjectCode,
                              'passMarks',
                              e.target.value,
                            )
                          }
                          disabled={!marksData[subj.subjectCode]?.selected}
                          sx={{ ...textFieldStyles }}
                          error={Boolean(marksData[subj.subjectCode]?.error)}
                          fullWidth
                        />
                        {marksData[subj.subjectCode]?.error && (
                          <Typography
                            variant='caption'
                            sx={{ color: 'red', mt: '2px', ml: '2px' }}
                          >
                            {marksData[subj.subjectCode]?.error}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant='contained'
            color='success'
            sx={{ mt: 2 }}
            onClick={handleSave}
          >
            Save Marks
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default AddSubjectWiseMarks;
