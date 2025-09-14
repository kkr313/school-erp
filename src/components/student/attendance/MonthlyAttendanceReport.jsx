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
  CircularProgress,
} from '@mui/material';
import Class from '../../ui/forms/dropdown/Class';
import { useTheme } from '../../../context/ThemeContext';
import { getBaseUrlBySchoolCode } from '../../../utils/schoolBaseUrls';
import { useMediaQuery } from '@mui/material';
import FilledAutocomplete from '../../../utils/FilledAutocomplete';
import { ArrowDropDown, Clear } from '@mui/icons-material';
import CustomBreadcrumb from '../../ui/navigation/CustomBreadcrumb';

const MonthlyAttendanceReport = () => {
  const { theme, fontColor } = useTheme();

  const columnWidths = { slNo: 50, roll: 120, name: 200 };
  const rollLeft = columnWidths.slNo;
  const nameLeft = columnWidths.slNo + columnWidths.roll;

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: fontColor.paper },
      '&:hover fieldset': { borderColor: fontColor.paper },
      '&.Mui-focused fieldset': { borderColor: fontColor.paper },
    },
    '& .MuiInputLabel-root': { color: fontColor.paper },
    input: { color: fontColor.paper },
  };

  const isMobile = useMediaQuery('(max-width:600px)');

  const stickyBase = {
    position: 'sticky',
    backgroundColor: theme.paperBg,
    boxShadow: 'inset 0px -2px 4px rgba(0,0,0,0.1)',
  };
  const stickyHeaderCell = {
    ...stickyBase,
    top: 0,
    zIndex: 4,
    position: isMobile ? 'static' : 'sticky',
  };
  const stickySubHeaderCell = {
    ...stickyBase,
    top: 40,
    zIndex: 4,
    position: isMobile ? 'static' : 'sticky',
    color: fontColor.paper,
  };
  const stickyBodyCell = {
    ...stickyBase,
    zIndex: 2,
    position: isMobile ? 'static' : 'sticky',
    color: fontColor.paper,
  };

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState('All');
  const [sectionOptions, setSectionOptions] = useState(['All']);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [attendanceMatrix, setAttendanceMatrix] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [noDataFound, setNoDataFound] = useState(false);

  const schoolCode = localStorage.getItem('schoolCode');
  const baseUrl = getBaseUrlBySchoolCode(schoolCode);
  if (!baseUrl) return console.error('Invalid or missing school code');

  const months = [
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
  ];

  const handleClassChange = async newClass => {
    setSelectedClass(newClass);
    setSelectedSection('All');
    setSectionOptions(['All']);
    setAttendanceMatrix([]);
    setNoDataFound(false);

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
    } catch (error) {
      console.error('Error loading section/student list.');
    }
  };

  const getDatesInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const dates = [];
    while (date.getMonth() === month) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const handleShowMonthlyReport = async () => {
    const newErrors = {};
    if (!selectedClass) newErrors.class = 'Class is required';
    if (!selectedMonth) newErrors.month = 'Month is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setAttendanceMatrix([]);
    setNoDataFound(false);

    const currentYear = new Date().getFullYear();
    const monthIndex = parseInt(selectedMonth) - 1;
    const monthDates = getDatesInMonth(currentYear, monthIndex);
    setDates(monthDates);

    try {
      const weekdayDates = monthDates.filter(
        date => new Date(date).getDay() !== 0,
      );
      const fetchPromises = weekdayDates.map(date =>
        fetch(`${baseUrl}/api/Attendance/GetStudentAttendanceList`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            className: selectedClass.label,
            section: selectedSection === 'All' ? 'Select All' : selectedSection,
            attendanceDate: date,
            operationType: 'GetAttendanceWebAPI',
            trackingID: '06a58d2f-d99f-471f-874c-88508a719aa7',
          }),
        }).then(res => res.json().then(data => ({ date, data }))),
      );

      const results = await Promise.all(fetchPromises);
      const studentMap = {};

      results.forEach(({ data }) => {
        if (Array.isArray(data)) {
          data.forEach(student => {
            const key = student.admRoll;
            if (!studentMap[key]) {
              studentMap[key] = {
                admRoll: student.admRoll,
                studentName: student.studentName,
                attendance: {},
              };
            }
          });
        }
      });

      monthDates.forEach(date => {
        const day = new Date(date).getDay();
        if (day === 0) {
          Object.values(studentMap).forEach(student => {
            student.attendance[date] = 'Sun';
          });
        } else {
          const dayData = results.find(r => r.date === date)?.data || [];
          Object.values(studentMap).forEach(student => {
            const record = dayData.find(d => d.admRoll === student.admRoll);
            student.attendance[date] = record
              ? record.markNew
                ? 'P'
                : 'A'
              : 'A';
          });
        }
      });

      const matrix = Object.values(studentMap);
      setAttendanceMatrix(matrix);
      if (matrix.length === 0) setNoDataFound(true);
    } catch (err) {
      console.error('Failed to fetch monthly attendance.', err);
      setNoDataFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getWeekdayName = date =>
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date).getDay()];

  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title='Monthly Attendance Report'
        showHome={true}
        variant='minimal'
        animated={false}
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
            mb: 3,
          }}
        >
          Monthly Attendance Report
        </Typography> */}

        {/* Filters */}
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
          <FilledAutocomplete
            options={months}
            getOptionLabel={option => option.label}
            value={months.find(m => m.value === selectedMonth) || null}
            onChange={(_, newValue) =>
              setSelectedMonth(newValue ? newValue.value : '')
            }
            label='Month'
            error={Boolean(errors.month)}
            helperText={errors.month}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            sx={{ minWidth: 180 }}
            popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
            clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
          <Button variant='contained' onClick={handleShowMonthlyReport}>
            Show
          </Button>
        </Box>
      </Paper>

      {loading && (
        <Box textAlign='center' sx={{ mt: 3 }}>
          <CircularProgress />
          <Typography sx={{ mt: 1 }}>Fetching monthly attendance...</Typography>
        </Box>
      )}

      {noDataFound && !loading && (
        <Paper
          elevation={3}
          sx={{ p: 3, backgroundColor: theme.paperBg, textAlign: 'center' }}
        >
          <Typography sx={{ color: fontColor.paper }}>
            No attendance data found for this month.
          </Typography>
        </Paper>
      )}

      {!loading && attendanceMatrix.length > 0 && (
        <Paper
          elevation={3}
          sx={{ p: 0, backgroundColor: theme.paperBg, overflow: 'auto' }}
        >
          <TableContainer sx={{ maxHeight: '90vh', overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      ...stickyHeaderCell,
                      left: 0,
                      minWidth: columnWidths.slNo,
                    }}
                  />
                  <TableCell
                    sx={{
                      ...stickyHeaderCell,
                      left: `${rollLeft}px`,
                      minWidth: columnWidths.roll,
                    }}
                  />
                  <TableCell
                    sx={{
                      ...stickyHeaderCell,
                      left: `${nameLeft}px`,
                      minWidth: columnWidths.name,
                    }}
                  />

                  {dates.map(date => {
                    const isSunday = new Date(date).getDay() === 0;
                    const allAbsent =
                      !isSunday &&
                      attendanceMatrix.every(s => s.attendance[date] === 'A');
                    return (
                      <TableCell
                        key={date}
                        sx={{
                          ...stickyHeaderCell,
                          zIndex: 3,
                          textAlign: 'center',
                          fontWeight: 'bold',
                          color: isSunday ? 'blue' : '#555',
                          backgroundColor: isSunday
                            ? '#f0f0f0'
                            : allAbsent
                              ? '#ffe6e6'
                              : theme.paperBg,
                        }}
                      >
                        {getWeekdayName(date)}
                      </TableCell>
                    );
                  })}
                </TableRow>

                {/* Date Row */}
                <TableRow>
                  <TableCell
                    sx={{
                      ...stickySubHeaderCell,
                      left: 0,
                      minWidth: columnWidths.slNo,
                    }}
                  >
                    <strong>SlNo.</strong>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...stickySubHeaderCell,
                      left: `${rollLeft}px`,
                      minWidth: columnWidths.roll,
                    }}
                  >
                    <strong>RollNo/Adm</strong>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...stickySubHeaderCell,
                      left: `${nameLeft}px`,
                      minWidth: columnWidths.name,
                    }}
                  >
                    <strong>Student Name</strong>
                  </TableCell>
                  {dates.map((date, idx) => {
                    const isSunday = new Date(date).getDay() === 0;
                    const allAbsent =
                      !isSunday &&
                      attendanceMatrix.length > 0 &&
                      attendanceMatrix.every(s => s.attendance[date] === 'A');

                    return (
                      <TableCell
                        key={date}
                        sx={{
                          ...stickySubHeaderCell,
                          zIndex: 3,
                          textAlign: 'center',
                          backgroundColor: isSunday
                            ? '#f0f0f0'
                            : allAbsent
                              ? '#ffe6e6'
                              : theme.paperBg,
                          color: isSunday
                            ? 'blue'
                            : allAbsent
                              ? 'black'
                              : fontColor.paper,
                        }}
                      >
                        <strong>D{idx + 1}</strong>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {attendanceMatrix.map((student, idx) => (
                  <TableRow key={idx}>
                    <TableCell
                      sx={{
                        ...stickyBodyCell,
                        left: 0,
                        minWidth: columnWidths.slNo,
                      }}
                    >
                      {idx + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...stickyBodyCell,
                        left: `${rollLeft}px`,
                        minWidth: columnWidths.roll,
                      }}
                    >
                      {student.admRoll}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...stickyBodyCell,
                        left: `${nameLeft}px`,
                        minWidth: columnWidths.name,
                      }}
                    >
                      {student.studentName}
                    </TableCell>

                    {dates.map(date => {
                      const value = student.attendance[date];
                      const isSunday = value === 'Sun';
                      const allAbsent = attendanceMatrix.every(
                        s => s.attendance[date] === 'A',
                      );
                      return (
                        <TableCell
                          key={date}
                          sx={{
                            textAlign: 'center',
                            backgroundColor: isSunday
                              ? '#f0f0f0'
                              : allAbsent
                                ? '#ffe6e6'
                                : 'inherit',
                          }}
                        >
                          {isSunday ? (
                            <span style={{ color: 'blue', fontWeight: 'bold' }}>
                              Sun
                            </span>
                          ) : value === 'P' ? (
                            <span
                              style={{ color: 'green', fontWeight: 'bold' }}
                            >
                              P
                            </span>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                              A
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}

                {/* Total Present Row */}
                {/* Total Present Row */}
                <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                  <TableCell
                    sx={{
                      ...stickyBodyCell,
                      left: 0,
                      minWidth: columnWidths.slNo,
                    }}
                  />
                  <TableCell
                    sx={{
                      ...stickyBodyCell,
                      left: `${rollLeft}px`,
                      minWidth: columnWidths.roll,
                    }}
                  />
                  <TableCell
                    sx={{
                      ...stickyBodyCell,
                      left: `${nameLeft}px`,
                      minWidth: columnWidths.name,
                      fontWeight: 'bold',
                      color: 'green',
                    }}
                  >
                    Total Present
                  </TableCell>
                  {dates.map(date => {
                    const isSunday = new Date(date).getDay() === 0;
                    const allAbsent =
                      !isSunday &&
                      attendanceMatrix.every(s => s.attendance[date] === 'A');

                    if (isSunday) {
                      return (
                        <TableCell
                          key={date}
                          sx={{
                            textAlign: 'center',
                            backgroundColor: '#f0f0f0',
                            color: 'blue',
                            fontWeight: 'bold',
                          }}
                        >
                          ---
                        </TableCell>
                      );
                    }

                    const presentCount = attendanceMatrix.filter(
                      s => s.attendance[date] === 'P',
                    ).length;
                    return (
                      <TableCell
                        key={date}
                        sx={{
                          textAlign: 'center',
                          color: 'green',
                          fontWeight: 'bold',
                          backgroundColor: allAbsent
                            ? '#ffe6e6'
                            : theme.paperBg,
                        }}
                      >
                        {presentCount}
                      </TableCell>
                    );
                  })}
                </TableRow>

                {/* Total Absent Row */}
                <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                  <TableCell
                    sx={{
                      ...stickyBodyCell,
                      left: 0,
                      minWidth: columnWidths.slNo,
                    }}
                  />
                  <TableCell
                    sx={{
                      ...stickyBodyCell,
                      left: `${rollLeft}px`,
                      minWidth: columnWidths.roll,
                    }}
                  />
                  <TableCell
                    sx={{
                      ...stickyBodyCell,
                      left: `${nameLeft}px`,
                      minWidth: columnWidths.name,
                      fontWeight: 'bold',
                      color: 'red',
                    }}
                  >
                    Total Absent
                  </TableCell>
                  {dates.map(date => {
                    const isSunday = new Date(date).getDay() === 0;
                    const allAbsent =
                      !isSunday &&
                      attendanceMatrix.every(s => s.attendance[date] === 'A');

                    if (isSunday) {
                      return (
                        <TableCell
                          key={date}
                          sx={{
                            textAlign: 'center',
                            backgroundColor: '#f0f0f0',
                            color: 'blue',
                            fontWeight: 'bold',
                          }}
                        >
                          ---
                        </TableCell>
                      );
                    }

                    const absentCount = attendanceMatrix.filter(
                      s => s.attendance[date] === 'A',
                    ).length;
                    return (
                      <TableCell
                        key={date}
                        sx={{
                          textAlign: 'center',
                          color: 'red',
                          fontWeight: 'bold',
                          backgroundColor: allAbsent
                            ? '#ffe6e6'
                            : theme.paperBg,
                        }}
                      >
                        {absentCount}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default MonthlyAttendanceReport;
