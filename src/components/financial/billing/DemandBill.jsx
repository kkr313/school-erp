import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  CircularProgress,
  Pagination,
} from '@mui/material';

import Class from '../../ui/forms/dropdown/Class';
import Section from '../../ui/forms/dropdown/Section';
import GetMonthList from '../../ui/forms/dropdown/GetMonthList';
import { ArrowDropDown, Clear } from '@mui/icons-material';
import { usePrint } from '../../../hooks/usePrint';
import DemandBillPrintView from '../../ui/print/DemandBillPrintView';
import { useTheme } from '../../../context/ThemeContext';
import FilledAutocomplete from '../../../utils/FilledAutocomplete';
import { getBaseUrlBySchoolCode } from '../../../utils/schoolBaseUrls';
import { api } from '../../../api/index.js';
import GetStudentType from '../../ui/forms/dropdown/GetStudentType';
import GetStudentStatus from '../../ui/forms/dropdown/GetStudentStatus';
import GetSchoolPeriod from '../../ui/forms/dropdown/GetSchoolPeriod';
import CustomBreadcrumb from '../../ui/navigation/CustomBreadcrumb';

const DemandBill = () => {
  const { theme, fontColor } = useTheme();
  const [students, setStudents] = useState([]);
  const [classObj, setClassObj] = useState(null);
  const [section, setSection] = useState(null);
  const [month, setMonth] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [demandData, setDemandData] = useState([]);
  const [originalDemandData, setOriginalDemandData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [billsPerPage, setBillsPerPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isBookBilling, setIsBookBilling] = useState(false);
  const [isDressBilling, setIsDressBilling] = useState(false);
  const { printMode, printRef, handlePrint } = usePrint();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [studentType, setStudentType] = useState([]);
  const [studentStatus, setStudentStatus] = useState([
    { label: 'Normal', value: 'Normal' },
  ]);
  const [schoolPeriod, setSchoolPeriod] = useState([]);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);

  const schoolCode = localStorage.getItem('schoolCode');
  const baseUrl = getBaseUrlBySchoolCode(schoolCode);
  if (!baseUrl) return console.error('Invalid or missing school code');

  const [errors, setErrors] = useState({
    class: false,
    section: false,
    month: false,
    billsPerPage: false,
    studentType: false,
    studentStatus: false,
    schoolPeriod: false,
  });

  const showStudentList = async () => {
    // ✅ Validation check
    let newErrors = {
      class: !classObj,
      section: !section,
      month: !month,
      billsPerPage: !billsPerPage,
      studentType: studentType.length === 0,
      studentStatus: studentStatus.length === 0,
      schoolPeriod: schoolPeriod.length === 0,
    };

    setErrors(newErrors);

    // agar koi error hai to return
    if (Object.values(newErrors).includes(true)) return;

    try {
      let sectionArray = [];
      if (section?.value === 'ALL' && section?.allSections) {
        sectionArray = section.allSections;
      } else if (section?.value) {
        sectionArray = [section.value];
      }

      const filterBody = {
        trackingID: 'string',
        classId: classObj.value,
        section: sectionArray,
        gender: ['Male', 'Female', 'Transgender'], // ye hardcoded rahega
        studentType: studentType.map(s => s.value),
        studentStatus: studentStatus.map(s => s.value),
        schoolPeriod: schoolPeriod.map(s => s.value),
      };

      console.log('➡️ Sending filter body:', filterBody);

      const data = await api.students.getFilteredStudents(filterBody);

      if (data && data.length > 0) {
        setFilteredStudents(data);
        setSelectedStudents([]); // ✅ Show pe sab unchecked
        setCurrentPage(1); // ✅ reset to page 1
        setStudentsPerPage(10); // ✅ reset rows per page to 10
      } else {
        setFilteredStudents([]);
        alert('No students found for selected filters');
      }
    } catch (error) {
      console.error('❌ Error fetching student list:', error);
      alert('Failed to fetch student list');
    }
  };

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  const toggleStudentSelect = admissionNo => {
    setSelectedStudents(prev =>
      prev.includes(admissionNo)
        ? prev.filter(no => no !== admissionNo)
        : [...prev, admissionNo],
    );
  };

  const generateDemandBills = async () => {
    if (!selectedStudents.length) {
      alert('Please select students');
      return;
    }

    setModalOpen(true);
    setModalLoading(true);
    setDemandData([]);
    setOriginalDemandData([]);

    try {
      const data = await api.dues.getStudentDemandsByIds({
        admIds: selectedStudents,
        uptoMonthId: month.value,
        isBookBilling,
        isDressBilling,
      });

      if (data) {
        console.log('Result size:', data.length);
        setOriginalDemandData(data);
        setDemandData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    if (!originalDemandData.length) return;

    const updatedData = originalDemandData.map(student => {
      const originalFees = student.studentFees || [];

      let totalFee = 0;
      const fees = [];

      for (let fee of originalFees) {
        const isBook = fee.headName.includes('Book Dues');
        const isDress = fee.headName.includes('Dress Dues');

        if (
          (!isBook && !isDress) ||
          (isBook && isBookBilling) ||
          (isDress && isDressBilling)
        ) {
          fees.push(fee);
          totalFee += fee.feeAmount || 0;
        }
      }

      return { ...student, studentFees: fees, totalFeeAmount: totalFee };
    });

    setDemandData(updatedData);
  }, [isBookBilling, isDressBilling, originalDemandData]);

  const clearFilters = () => {
    setClassObj(null);
    setSection(null);
    setMonth(null);
    // setSchoolPeriod([]);
    // setStudentType([]);
    setStudentType([
      { label: 'New', value: 'New' },
      { label: 'Old', value: 'Old' },
    ]);
    setStudentStatus([{ label: 'Normal', value: 'Normal' }]);
    setSchoolPeriod([
      { label: 'Day-Scholar', value: 'Day-Scholar' },
      { label: 'Day-Boarding', value: 'Day-Boarding' },
      { label: 'Boarding', value: 'Boarding' },
    ]);
    setFilteredStudents([]);
    setSelectedStudents([]);
    setDemandData([]);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb title='Demand Bill Generation' showHome={true} />

      {/* ---- Filters ---- */}
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
            mb: 3
          }}
        >
          Demand Bill
        </Typography> */}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            '& > *': {
              flex: { xs: '1 1 100%', sm: '1 1 calc(33.33% - 16px)' },
              minWidth: { xs: '100%', sm: '200px' },
            },
          }}
        >
          <Class
            value={classObj}
            onClassChange={newValue => {
              setClassObj(newValue);
              setSection(null);
              setErrors(prev => ({ ...prev, class: false }));
            }}
            error={errors.class}
            helperText={errors.class ? 'Please select class' : ''}
          />

          <Section
            classId={classObj?.value}
            value={section}
            onSectionChange={newValue => {
              setSection(newValue);
              setErrors(prev => ({ ...prev, section: false }));
            }}
            label='Section'
            error={errors.section}
            helperText={errors.section ? 'Please select section' : ''}
          />

          <GetMonthList
            value={month}
            onMonthChange={newValue => {
              setMonth(newValue);
              setErrors(prev => ({ ...prev, month: false }));
            }}
            label='Upto Month'
            error={errors.month}
            helperText={errors.month ? 'Please select month' : ''}
          />

          <GetStudentType
            value={studentType}
            onChange={newValue => {
              setStudentType(newValue);
              setErrors(prev => ({ ...prev, studentType: false }));
            }}
            error={errors.studentType}
            helperText={errors.studentType ? 'Please select student type' : ''}
            defaultSelectAll={true}
          />

          <GetStudentStatus
            value={studentStatus}
            onChange={newValue => {
              setStudentStatus(newValue);
              setErrors(prev => ({ ...prev, studentStatus: false }));
            }}
            error={errors.studentStatus}
            helperText={
              errors.studentStatus ? 'Please select student status' : ''
            }
          />

          <GetSchoolPeriod
            value={schoolPeriod}
            onChange={newValue => {
              setSchoolPeriod(newValue);
              setErrors(prev => ({ ...prev, schoolPeriod: false }));
            }}
            error={errors.schoolPeriod}
            helperText={
              errors.schoolPeriod ? 'Please select school period' : ''
            }
            defaultSelectAll={true}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant='contained' onClick={showStudentList}>
            Show
          </Button>
          <Button variant='outlined' onClick={clearFilters}>
            Clear
          </Button>
        </Box>
      </Paper>

      {/* ---- Students Table ---- */}
      {filteredStudents.length > 0 && (
        <Paper sx={{ p: 0, mb: 2, backgroundColor: theme.paperBg }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      indeterminate={
                        selectedStudents.length > 0 &&
                        selectedStudents.length < currentStudents.length
                      }
                      checked={
                        currentStudents.length > 0 &&
                        selectedStudents.filter(id =>
                          currentStudents.map(s => s.admissionNo).includes(id),
                        ).length === currentStudents.length
                      }
                      onChange={e => {
                        if (e.target.checked) {
                          const allAdmissionNos = currentStudents.map(
                            s => s.admissionNo,
                          );
                          setSelectedStudents(prev => [
                            ...prev.filter(
                              id =>
                                !currentStudents
                                  .map(s => s.admissionNo)
                                  .includes(id),
                            ),
                            ...allAdmissionNos,
                          ]);
                        } else {
                          setSelectedStudents(prev =>
                            prev.filter(
                              id =>
                                !currentStudents
                                  .map(s => s.admissionNo)
                                  .includes(id),
                            ),
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Roll No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Admission No
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Student Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Father Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Mobile No.</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {currentStudents.map(s => (
                  <TableRow
                    key={s.admissionNo}
                    sx={{ height: '28px' }} // ✅ Row height control
                  >
                    <TableCell
                      padding='checkbox'
                      sx={{ py: 0 }} // ✅ kam vertical padding
                    >
                      <Checkbox
                        checked={selectedStudents.includes(s.admissionNo)}
                        onChange={() => toggleStudentSelect(s.admissionNo)}
                        sx={{
                          color:
                            theme.paperBg === '#ffffff'
                              ? undefined
                              : fontColor.paper,
                          '&.Mui-checked': {
                            color:
                              theme.paperBg === '#ffffff'
                                ? undefined
                                : fontColor.paper,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper, py: 0 }}>
                      {s.rollNo}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper, py: 0 }}>
                      {s.admissionNo}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper, py: 0 }}>
                      {s.studentName}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper, py: 0 }}>
                      {s.fatherName}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper, py: 0 }}>
                      {s.mobileNo}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ✅ Pagination + Rows per page */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              my: 2,
              px: 2,
            }}
          >
            <Pagination
              count={Math.ceil(filteredStudents.length / studentsPerPage)}
              page={currentPage}
              onChange={(_, page) => {
                setCurrentPage(page);
                setSelectedStudents([]); // reset selection on page change
              }}
              color='primary'
              sx={{
                '& .MuiPaginationItem-root': {
                  color: fontColor.paper, // normal text color
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: theme.paperBg, // selected bg
                  color: fontColor.paper, // selected text
                  border: `1px solid ${fontColor.paper}`,
                },
                '& .MuiPaginationItem-root:hover': {
                  // backgroundColor: theme.hoverBg || theme.paperBg, // optional hover
                  color: fontColor.paper,
                },
              }}
            />

            {/* Rows per page selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant='body2' sx={{ color: fontColor.paper }}>
                Rows per page:
              </Typography>
              <select
                value={studentsPerPage}
                onChange={e => {
                  setCurrentPage(1); // reset to first page
                  setSelectedStudents([]); // clear selection
                  // convert to number
                  setStudentsPerPage(Number(e.target.value));
                }}
                style={{
                  padding: '6px 10px',
                  border: `1px solid ${fontColor.paper}`,
                  borderRadius: '6px',
                  backgroundColor: theme.paperBg,
                  color: fontColor.paper,
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // ✅ xs = column, sm+ = row
              justifyContent: 'flex-end',
              px: 2,
              pb: 2,
              mt: 2,
              gap: 1.5, // ✅ thoda gap rakha buttons/checkboxes ke beech
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isBookBilling}
                  onChange={e => setIsBookBilling(e.target.checked)}
                  sx={{
                    color:
                      theme.paperBg === '#ffffff' ? undefined : fontColor.paper,
                    '&.Mui-checked': {
                      color:
                        theme.paperBg === '#ffffff'
                          ? undefined
                          : fontColor.paper,
                    },
                  }}
                />
              }
              label='Include Book Billing Dues'
              sx={{ color: fontColor.paper }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDressBilling}
                  onChange={e => setIsDressBilling(e.target.checked)}
                  sx={{
                    color:
                      theme.paperBg === '#ffffff' ? undefined : fontColor.paper,
                    '&.Mui-checked': {
                      color:
                        theme.paperBg === '#ffffff'
                          ? undefined
                          : fontColor.paper,
                    },
                  }}
                />
              }
              label='Include Dress Billing Dues'
              sx={{ color: fontColor.paper }}
            />
            <Button
              variant='contained'
              color='primary'
              onClick={generateDemandBills}
            >
              Generate
            </Button>
          </Box>
        </Paper>
      )}

      {/* ---- Demand Bills Modal ---- */}
      {modalOpen && (
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth='lg'
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: theme.paperBg,
              color: fontColor.paper,
              fontFamily: theme.fontFamily,
            },
          }}
        >
          {!printMode && <DialogTitle>Demand Bills</DialogTitle>}

          <DialogContent
            dividers
            sx={{
              borderTop: `1px solid ${fontColor.paper}`,
              borderBottom: `1px solid ${fontColor.paper}`,
            }}
          >
            {modalLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 200,
                }}
              >
                <CircularProgress />
              </Box>
            ) : demandData.length > 0 ? (
              <>
                {/* ✅ Screen view (normal table) */}
                <div className='screen-area'>
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>
                            Roll / AdmNo
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>
                            Class
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>
                            Student Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>
                            Fee Head
                          </TableCell>
                          <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                            Fees
                          </TableCell>
                          <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                            Total Fee
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {demandData.map((student, idx) => (
                          <React.Fragment key={idx}>
                            {student.studentFees.map((fh, i) => {
                              const isLastRow =
                                i === student.studentFees.length - 1; // ✅ last row check
                              return (
                                <TableRow
                                  key={`${idx}-${i}`}
                                  sx={{
                                    height: '26px',
                                    borderBottom: isLastRow
                                      ? '2px solid blue'
                                      : undefined, // ✅ poore row pe blue line
                                  }}
                                >
                                  {i === 0 && (
                                    <>
                                      <TableCell
                                        rowSpan={student.studentFees.length}
                                        sx={{
                                          color: fontColor.paper,
                                          py: 0.2,
                                          fontSize: '0.8rem',
                                        }}
                                      >
                                        {student.rollNo} / {student.admissionNo}
                                      </TableCell>
                                      <TableCell
                                        rowSpan={student.studentFees.length}
                                        sx={{
                                          color: fontColor.paper,
                                          py: 0.2,
                                          fontSize: '0.8rem',
                                        }}
                                      >
                                        {student.className} - {student.section}
                                      </TableCell>
                                      <TableCell
                                        rowSpan={student.studentFees.length}
                                        sx={{
                                          color: fontColor.paper,
                                          py: 0.2,
                                          fontSize: '0.8rem',
                                        }}
                                      >
                                        {student.studentName}
                                      </TableCell>
                                    </>
                                  )}

                                  <TableCell
                                    sx={{
                                      color: fontColor.paper,
                                      py: 0.2,
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    {fh.headName}
                                  </TableCell>
                                  <TableCell
                                    align='right'
                                    sx={{
                                      color: fontColor.paper,
                                      py: 0.2,
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    {fh.feeAmount}
                                  </TableCell>

                                  {i === 0 && (
                                    <TableCell
                                      rowSpan={student.studentFees.length}
                                      align='center'
                                      sx={{
                                        color:
                                          theme.paperBg === '#ffffff'
                                            ? 'red'
                                            : fontColor.paper,
                                        fontWeight: 'bold',
                                        py: 0.2,
                                        fontSize: '0.8rem',
                                      }}
                                    >
                                      {student.totalFeeAmount}
                                    </TableCell>
                                  )}
                                </TableRow>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>

                {/* ✅ Print view (DemandBillPrintView only for print) */}
                <div className='print-area hidden' ref={printRef}>
                  <DemandBillPrintView
                    demandData={demandData}
                    billsPerPage={billsPerPage}
                    selectedMonth={month?.label}
                  />
                </div>
              </>
            ) : (
              <Typography align='center' sx={{ my: 3, fontWeight: 500 }}>
                No Demand Found
              </Typography>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: 'end',
              alignItems: 'center',
              px: 2,
              gap: 1.5,
            }}
          >
            {/* Bills per page selector - like pagination dropdown */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant='body2' sx={{ color: fontColor.paper }}>
                Bills per page:
              </Typography>
              <select
                value={billsPerPage}
                onChange={e => setBillsPerPage(Number(e.target.value))}
                style={{
                  padding: '6px 10px',
                  border: `1px solid ${fontColor.paper}`,
                  borderRadius: '6px',
                  backgroundColor: theme.paperBg,
                  color: fontColor.paper,
                }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
              </select>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                onClick={handlePrint}
                variant='outlined'
                disabled={demandData.length === 0}
              >
                Print
              </Button>
              <Button onClick={() => setModalOpen(false)} variant='contained'>
                Close
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default DemandBill;
