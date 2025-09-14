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
  Checkbox,
  CircularProgress,
  TextField,
  MenuItem,
} from '@mui/material';
import Class from '../../ui/forms/dropdown/Class';
import FilledAutocomplete from '../../../utils/FilledAutocomplete';
import { ArrowDropDown, Clear } from '@mui/icons-material';
import { getBaseUrlBySchoolCode } from '../../../utils/schoolBaseUrls';
import AdmitCardPrintView from './AdmitCardPrintView';
import { usePrint } from '../../../hooks/usePrint';
import CustomBreadcrumb from '../../ui/navigation/CustomBreadcrumb';

export default function PrintAdmitCard() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState('All');
  const [sectionOptions, setSectionOptions] = useState(['All']);

  const [declaration, setDeclaration] = useState(null);
  const [showAttempted, setShowAttempted] = useState(false);

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [displayExam, setDisplayExam] = useState('');
  const [displayClass, setDisplayClass] = useState(null);
  const [displaySection, setDisplaySection] = useState('All');

  const schoolCode = localStorage.getItem('schoolCode');
  const baseUrl = getBaseUrlBySchoolCode(schoolCode);

  const { printMode, printRef, handlePrint } = usePrint();

  // Load exams from localStorage
  useEffect(() => {
    const storedExams = JSON.parse(localStorage.getItem('examMaster')) || [];
    setExams(storedExams);
  }, []);

  // Load sections when class changes
  useEffect(() => {
    if (!selectedClass) {
      setSectionOptions(['All']);
      setSelectedSection('All');
      return;
    }

    const fetchSections = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/Students/GetAllStudentList`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ classId: selectedClass.value }),
        });
        const data = await res.json();

        const filteredByClass = data.filter(
          s => s.className?.toLowerCase() === selectedClass.label.toLowerCase(),
        );

        const uniqueSections = [
          'All',
          ...[
            ...new Set(
              filteredByClass.map(s => s.section?.trim()).filter(Boolean),
            ),
          ],
        ];

        setSectionOptions(uniqueSections);
        setSelectedSection('All');
      } catch (err) {
        console.error('Failed to fetch sections', err);
        setSectionOptions(['All']);
        setSelectedSection('All');
      }
    };

    fetchSections();
  }, [selectedClass, baseUrl]);

  const handleShow = async () => {
    setShowAttempted(true);

    if (!selectedExam || !selectedClass) {
      setDeclaration(null);
      setStudents([]);
      setSelectedStudents([]);
      return;
    }

    // Freeze displayed exam/class
    setDisplayExam(selectedExam);
    setDisplayClass(selectedClass);
    setDisplaySection(selectedSection);

    // Fetch declaration (Admit Card details remain unaffected by section)
    const allDeclarations =
      JSON.parse(localStorage.getItem('admitCardDeclarations')) || [];

    const found = allDeclarations.find(
      d => d.examId === selectedExam && d.classId === selectedClass.value,
    );
    setDeclaration(found || null);

    // Fetch students
    setLoadingStudents(true);
    try {
      const res = await fetch(`${baseUrl}/api/Students/GetAllStudentList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: selectedClass?.value }),
      });
      const data = await res.json();

      let filteredStudents = data.filter(
        s => s.className?.toLowerCase() === selectedClass?.label?.toLowerCase(),
      );

      // Filter by selected section
      if (selectedSection !== 'All') {
        filteredStudents = filteredStudents.filter(
          s => s.section === selectedSection,
        );
      }

      setStudents(filteredStudents || []);
      setSelectedStudents([]); // by default koi select na ho
    } catch (error) {
      console.error('Failed to fetch students', error);
      setStudents([]);
      setSelectedStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const toggleStudentSelection = admissionNo => {
    setSelectedStudents(prev =>
      prev.includes(admissionNo)
        ? prev.filter(sid => sid !== admissionNo)
        : [...prev, admissionNo],
    );
  };

  return (
    <Box p={3}>
      <CustomBreadcrumb
        title='Print Admit Card'
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Exam', href: '/exam' },
        ]}
      />

      <Typography variant='h5' gutterBottom>
        Print Admit Card
      </Typography>

      {/* Exam Select */}
      <TextField
        select
        label='Select Exam'
        fullWidth
        margin='normal'
        value={selectedExam}
        onChange={e => setSelectedExam(e.target.value)}
        error={showAttempted && !selectedExam}
        helperText={
          showAttempted && !selectedExam ? 'Please select an exam' : ''
        }
      >
        {exams.map(exam => (
          <MenuItem key={exam.id} value={exam.id}>
            {exam.examName}
          </MenuItem>
        ))}
      </TextField>

      {/* Class Select */}
      <Class
        value={selectedClass}
        onClassChange={setSelectedClass}
        error={showAttempted && !selectedClass}
        helperText={
          showAttempted && !selectedClass ? 'Please select a class' : ''
        }
      />

      {/* Section Select (Only affects Student List) */}
      <FilledAutocomplete
        options={sectionOptions}
        value={selectedSection}
        onChange={(_, newValue) => setSelectedSection(newValue || 'All')}
        getOptionLabel={option => (option === 'All' ? 'Select All' : option)}
        label='Section'
        fullWidth
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        sx={{ mt: 2 }}
      />

      {/* Show Button */}
      <Button variant='contained' sx={{ mt: 2 }} onClick={handleShow}>
        Show
      </Button>

      {/* Admit Card Details */}
      {showAttempted &&
        (declaration ? (
          <Paper sx={{ mt: 3, p: 2 }}>
            <Typography variant='h6' gutterBottom>
              Admit Card - Exam{' '}
              {exams.find(e => e.id === displayExam)?.examName}, Class{' '}
              {displayClass?.label}
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell>Full Marks</TableCell>
                  <TableCell>Pass Marks</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {declaration.subjects.map((subj, idx) => {
                  const formatTime = time => {
                    if (!time) return '';
                    const [hour, minute] = time.split(':');
                    let h = parseInt(hour, 10);
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    h = h % 12 || 12;
                    return `${h}:${minute} ${ampm}`;
                  };
                  return (
                    <TableRow key={idx}>
                      <TableCell>{subj.subjectName}</TableCell>
                      <TableCell>{subj.fullMarks}</TableCell>
                      <TableCell>{subj.passMarks}</TableCell>
                      <TableCell>{subj.date}</TableCell>
                      <TableCell>
                        {formatTime(subj.fromTime)} – {formatTime(subj.toTime)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <Paper sx={{ mt: 3, p: 2, textAlign: 'center' }}>
            <Typography>No Admit Card record found</Typography>
          </Paper>
        ))}

      {/* Students List */}
      {loadingStudents ? (
        <Box textAlign='center' mt={3}>
          <CircularProgress />
          <Typography mt={1}>Loading students...</Typography>
        </Box>
      ) : (
        students.length > 0 &&
        declaration && (
          <Paper sx={{ mt: 3, p: 2 }}>
            <Typography variant='h6' gutterBottom>
              Students List - Class {displayClass?.label}, Section{' '}
              {displaySection}
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SlNo</TableCell>
                  <TableCell>
                    <Checkbox
                      indeterminate={
                        selectedStudents.length > 0 &&
                        selectedStudents.length < students.length
                      }
                      checked={
                        students.length > 0 &&
                        selectedStudents.length === students.length
                      }
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedStudents(students.map(s => s.admissionNo));
                        } else {
                          setSelectedStudents([]);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>AdmNo</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>RollNo</TableCell>
                  <TableCell>Father Name</TableCell>
                  <TableCell>Mobile</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {students.map((student, idx) => (
                  <TableRow key={student.admissionNo}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.admissionNo)}
                        onChange={() =>
                          toggleStudentSelection(student.admissionNo)
                        }
                      />
                    </TableCell>
                    <TableCell>{student.admissionNo}</TableCell>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>{student.rollNo}</TableCell>
                    <TableCell>{student.fatherName}</TableCell>
                    <TableCell>{student.mobileNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )
      )}

      {declaration && students.length > 0 && (
        <Button
          variant='contained'
          color='success'
          sx={{ mt: 2 }}
          onClick={() => {
            if (selectedStudents.length === 0) {
              alert('Please select at least one student');
              return;
            }
            handlePrint();
          }}
        >
          Print Admit Card
        </Button>
      )}

      {/* Hidden Print Content */}
      {printMode && selectedStudents.length > 0 && (
        <div ref={printRef}>
          <AdmitCardPrintView
            students={students.filter(s =>
              selectedStudents.includes(s.admissionNo),
            )}
            declaration={declaration}
            exam={displayExam}
            className={displayClass?.label}
            section={displaySection}
          />
        </div>
      )}
    </Box>
  );
}
