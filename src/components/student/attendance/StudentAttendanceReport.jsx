import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  MenuItem,
} from '@mui/material';
import Class from '../../ui/forms/dropdown/Class';
import { useTheme } from '../../../context/ThemeContext';
import { getBaseUrlBySchoolCode } from '../../../utils/schoolBaseUrls';
import FilledAutocomplete from '../../../utils/FilledAutocomplete';
import { ArrowDropDown, Clear } from '@mui/icons-material';
import FilledTextField from '../../../utils/FilledTextField';
import CustomBreadcrumb from '../../ui/navigation/CustomBreadcrumb';

const StudentAttendanceReport = () => {
  const { theme, fontColor } = useTheme();

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: fontColor.paper },
      '&:hover fieldset': { borderColor: fontColor.paper },
      '&.Mui-focused fieldset': { borderColor: fontColor.paper },
    },
    '& .MuiInputLabel-root': { color: fontColor.paper },
    input: { color: fontColor.paper },
  };

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState('All');
  const [sectionOptions, setSectionOptions] = useState(['All']);
  const [attendanceDate, setAttendanceDate] = useState(
    () => new Date().toISOString().split('T')[0],
  );
  const [allStudents, setAllStudents] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [errors, setErrors] = useState({});
  const [noDataFound, setNoDataFound] = useState(false);
  const [attendanceNotMarked, setAttendanceNotMarked] = useState(false);

  const schoolCode = localStorage.getItem('schoolCode');
  const baseUrl = getBaseUrlBySchoolCode(schoolCode);
  if (!baseUrl) return console.error('Invalid or missing school code');

  // Handle Class Change → fetch students & sections
  const handleClassChange = async newClass => {
    setSelectedClass(newClass);
    setSelectedSection('All');
    setSectionOptions(['All']);
    setErrors({});
    setReportData([]);
    setNoDataFound(false);
    setAttendanceNotMarked(false);

    if (!newClass) return;

    try {
      const res = await fetch(`${baseUrl}/api/Students/GetAllStudentList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: newClass.value }),
      });
      const data = await res.json();
      const filteredByClass = data.filter(
        s => s.className?.toLowerCase() === newClass.label.toLowerCase(),
      );
      const uniqueSections = [
        ...new Set(filteredByClass.map(s => s.section?.trim()).filter(Boolean)),
      ];
      setSectionOptions(['All', ...uniqueSections]);
      setAllStudents(filteredByClass);
    } catch (error) {
      console.error('Error loading section/student list.');
    }
  };

  // Fetch Attendance Report
  const handleShowReport = async () => {
    const newErrors = {};
    if (!selectedClass) newErrors.class = 'Class is required';
    if (!attendanceDate) newErrors.date = 'Date is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedDay = new Date(attendanceDate).getDay();
    if (selectedDay === 0) {
      setErrors({ date: 'Attendance cannot be viewed for Sunday.' });
      setReportData([]);
      setNoDataFound(false);
      setAttendanceNotMarked(false);
      return;
    }

    setErrors({});
    setNoDataFound(false);
    setAttendanceNotMarked(false);

    try {
      const res = await fetch(
        `${baseUrl}/api/Attendance/GetStudentAttendanceList`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            className: selectedClass.label,
            section: selectedSection === 'All' ? 'Select All' : selectedSection,
            attendanceDate: attendanceDate,
            operationType: 'GetAttendanceWebAPI',
            trackingID: '06a58d2f-d99f-471f-874c-88508a719aa7',
          }),
        },
      );

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const allAbsent = data.every(item => item.markNew === false);

        if (allAbsent) {
          setReportData([]);
          setAttendanceNotMarked(true);
        } else {
          setReportData(data);
        }
      } else {
        setNoDataFound(true);
        setReportData([]);
      }
    } catch (err) {
      console.error('Failed to fetch attendance report.', err);
      setNoDataFound(true);
      setReportData([]);
    }
  };

  const handleClearFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedClass(null);
    setSelectedSection('All');
    setAttendanceDate(today);
    setSectionOptions(['All']);
    setReportData([]);
    setErrors({});
    setNoDataFound(false);
    setAttendanceNotMarked(false);
  };

  // ✅ Calculate Total, Present & Absent counts
  const totalCount = reportData.length;
  const presentCount = reportData.filter(s => s.markNew).length;
  const absentCount = totalCount - presentCount;

  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title='Attendance Report'
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Attendance', href: '/attendance' },
        ]}
      />

      <Paper
        elevation={3}
        sx={{ p: 2, mb: 3, backgroundColor: theme.paperBg, mt: -1 }}
      >
        {/* <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "1.8rem", sm: "2.15rem" },
            color: theme.formHeaderFontColor,
            fontFamily: theme.formHeaderFontFamily,
            mb: 3,
          }}
        >
          Attendance Report
        </Typography> */}

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          <Class
            onClassChange={handleClassChange}
            value={selectedClass}
            label='Class Name'
            error={Boolean(errors.class)}
            helperText={errors.class}
          />

          <FilledAutocomplete
            options={sectionOptions}
            value={selectedSection}
            onChange={(_, newValue) => {
              if (newValue.includes('All')) {
                // If "Select All" chosen, select all except "All"
                setSelectedSection(sectionOptions.filter(opt => opt !== 'All'));
              } else {
                setSelectedSection(newValue);
              }
            }}
            getOptionLabel={option =>
              option === 'All' ? 'Select All' : option
            }
            label='Section'
            fullWidth
            sx={{ minWidth: 120 }}
            popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
            clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          />

          <FilledTextField
            type='date'
            label='Attendance Date'
            value={attendanceDate}
            onChange={e => setAttendanceDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            error={Boolean(errors.date)}
            helperText={errors.date}
            inputProps={{
              max: new Date().toISOString().split('T')[0], // ✅ Prevent future dates
            }}
            sx={{ minWidth: 180 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
          <Button variant='contained' onClick={handleShowReport}>
            Show
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      {/* ✅ No Data Found Message */}
      {noDataFound && (
        <Paper
          elevation={3}
          sx={{ p: 3, backgroundColor: theme.paperBg, textAlign: 'center' }}
        >
          <Typography sx={{ color: fontColor.paper }}>
            No attendance data found for selected filters.
          </Typography>
        </Paper>
      )}

      {/* ✅ Attendance Not Marked Message */}
      {attendanceNotMarked && (
        <Paper
          elevation={3}
          sx={{ p: 3, backgroundColor: theme.paperBg, textAlign: 'center' }}
        >
          <Typography sx={{ color: fontColor.paper }}>
            Attendance not marked for this date.
          </Typography>
        </Paper>
      )}

      {reportData.length > 0 && (
        <Paper elevation={3} sx={{ p: 2, backgroundColor: theme.paperBg }}>
          {/* ✅ Show Counts */}
          <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
            <Typography color='primary'>
              <strong>Total:</strong> {totalCount}
            </Typography>
            <Typography sx={{ color: 'green' }}>
              <strong>Present:</strong> {presentCount}
            </Typography>
            <Typography sx={{ color: 'red' }}>
              <strong>Absent:</strong> {absentCount}
            </Typography>
          </Box>

          {/* ✅ Attendance Table */}
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>
                    <strong>Sl No.</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Roll / Adm</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Student Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((student, idx) => {
                  const isAbsent = !student.markNew;
                  const rowStyle = isAbsent
                    ? { backgroundColor: '#ffe6e6' }
                    : {};
                  const textStyle = {
                    color: isAbsent ? 'black' : fontColor.paper,
                  };

                  return (
                    <TableRow key={idx} sx={rowStyle}>
                      <TableCell sx={textStyle}>{idx + 1}</TableCell>
                      <TableCell sx={textStyle}>{student.admRoll}</TableCell>
                      <TableCell sx={textStyle}>
                        {student.studentName}
                      </TableCell>
                      <TableCell sx={textStyle}>
                        {student.markNew ? (
                          <Typography color='green'>✅ Present</Typography>
                        ) : (
                          <Typography color='red'>
                            <strong>❌ Absent</strong>
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default StudentAttendanceReport;
