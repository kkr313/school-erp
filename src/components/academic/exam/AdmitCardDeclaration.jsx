import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  TableContainer,
} from '@mui/material';
import Class from '../../ui/forms/dropdown/Class';
import { useTheme } from '../../../context/ThemeContext';
import FilledAutocomplete from '../../../utils/FilledAutocomplete';
import { ArrowDropDown, Clear } from '@mui/icons-material';
import CustomBreadcrumb from '../../ui/navigation/CustomBreadcrumb';

export default function AdmitCardDeclaration() {
  const { theme, fontColor } = useTheme();

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

  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjectsData, setSubjectsData] = useState([]);
  const [showClicked, setShowClicked] = useState(false);

  // ✅ New states for confirmed values
  const [displayExam, setDisplayExam] = useState('');
  const [displayClass, setDisplayClass] = useState(null);

  // error states
  const [examError, setExamError] = useState(false);
  const [classError, setClassError] = useState(false);

  useEffect(() => {
    const storedExams = JSON.parse(localStorage.getItem('examMaster')) || [];
    setExams(storedExams);
  }, []);

  const handleShow = () => {
    let valid = true;
    if (!selectedExam) {
      setExamError(true);
      valid = false;
    } else setExamError(false);

    if (!selectedClass) {
      setClassError(true);
      valid = false;
    } else setClassError(false);

    if (!valid) return;

    setShowClicked(true);

    // ✅ Save confirmed values
    setDisplayExam(selectedExam);
    setDisplayClass(selectedClass);

    const allMarks = JSON.parse(localStorage.getItem('marksData')) || [];
    const filtered = allMarks.filter(
      d => d.examId === selectedExam && d.classId === selectedClass.value,
    );

    const allDeclarations =
      JSON.parse(localStorage.getItem('admitCardDeclarations')) || [];

    const existingDeclaration = allDeclarations.find(
      d => d.examId === selectedExam && d.classId === selectedClass.value,
    );

    let withDateTime = [];
    if (existingDeclaration) {
      withDateTime = filtered.map(subj => {
        const savedSubj = existingDeclaration.subjects.find(
          s => s.subjectName === subj.subjectName,
        );
        return {
          ...subj,
          date: savedSubj?.date || '',
          fromTime: savedSubj?.fromTime || '',
          toTime: savedSubj?.toTime || '',
        };
      });
    } else {
      withDateTime = filtered.map(subj => ({
        ...subj,
        date: '',
        fromTime: '',
        toTime: '',
      }));
    }
    setSubjectsData(withDateTime);
  };

  const handleChange = (index, field, value) => {
    const updated = [...subjectsData];
    updated[index][field] = value;
    setSubjectsData(updated);
  };

  const handleSaveDeclaration = () => {
    if (!selectedExam || !selectedClass) {
      alert('Please select exam and class!');
      return;
    }

    const declaration = {
      examId: selectedExam,
      classId: selectedClass.value,
      className: selectedClass.label,
      subjects: subjectsData.map(s => ({
        subjectName: s.subjectName,
        fullMarks: s.fullMarks,
        passMarks: s.passMarks,
        date: s.date,
        fromTime: s.fromTime,
        toTime: s.toTime,
      })),
    };

    const allDeclarations =
      JSON.parse(localStorage.getItem('admitCardDeclarations')) || [];

    const updated = allDeclarations.filter(
      d => !(d.examId === selectedExam && d.classId === selectedClass.value),
    );

    updated.push(declaration);
    localStorage.setItem('admitCardDeclarations', JSON.stringify(updated));

    alert('Admit Card Declaration Saved!');
    setSubjectsData([]);
    setSelectedExam('');
    setSelectedClass(null);
    setShowClicked(false);
    setDisplayExam('');
    setDisplayClass(null);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <CustomBreadcrumb
        title='Admit Card Declaration'
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Exam', href: '/exam' },
        ]}
      />

      <Paper elevation={3} sx={{ p: 3, backgroundColor: theme.paperBg }}>
        {/* ✅ Same Header Style */}
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
          Admit Card Declaration
        </Typography>

        {/* ✅ Exam + Class ek row me */}
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

        {/* ✅ Show button always enabled */}
        <Button variant='contained' sx={{ mt: 2 }} onClick={handleShow}>
          Show
        </Button>
      </Paper>

      {/* ✅ Show Result */}
      {showClicked &&
        (subjectsData.length > 0 ? (
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
                      <strong>Subject</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Full Marks</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Pass Marks</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Exam Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Exam Time</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjectsData.map((subj, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {subj.subjectName}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {subj.fullMarks}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {subj.passMarks}
                      </TableCell>
                      <TableCell>
                        <TextField
                          type='date'
                          value={subj.date}
                          sx={textFieldStyles}
                          fullWidth
                          onChange={e =>
                            handleChange(idx, 'date', e.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            type='time'
                            label='From'
                            value={subj.fromTime || ''}
                            sx={textFieldStyles}
                            fullWidth
                            onChange={e =>
                              handleChange(idx, 'fromTime', e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            type='time'
                            label='To'
                            value={subj.toTime || ''}
                            sx={textFieldStyles}
                            fullWidth
                            onChange={e =>
                              handleChange(idx, 'toTime', e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
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
              onClick={handleSaveDeclaration}
            >
              Save
            </Button>
          </Paper>
        ) : (
          <Paper
            sx={{
              mt: 3,
              p: 2,
              textAlign: 'center',
              backgroundColor: theme.paperBg,
            }}
          >
            <Typography variant='h6' sx={{ color: fontColor.paper }}>
              No Record Found
            </Typography>
          </Paper>
        ))}
    </Box>
  );
}
