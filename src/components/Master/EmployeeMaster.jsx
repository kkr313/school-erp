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
} from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import { Clear, ArrowDropDown } from '@mui/icons-material';

import GetGender from '../ui/forms/dropdown/GetGender';
import GetEmployeeDepartment from '../ui/forms/dropdown/GetEmployeeDepartment';
import { usePrompt } from '../../hooks/usePrompt';
import { useBeforeUnload } from '../../hooks/useBeforeUnload';
import { getBaseUrlBySchoolCode } from '../../utils/schoolBaseUrls';
import FilledTextField from '../../utils/FilledTextField';
import FilledAutocomplete from '../../utils/FilledAutocomplete';
import CustomBreadcrumb from '../ui/navigation/CustomBreadcrumb';
import GetState from '../ui/forms/dropdown/GetState';
import GetDistrict from '../ui/forms/dropdown/GetDistrict';

const designations = ['Principal', 'Teacher', 'Clerk'];

const EmployeeMaster = () => {
  const { theme, fontColor } = useTheme();

  const [employee, setEmployee] = useState({
    id: 1,
    name: '',
    fatherName: '',
    gender: null, 
    dob: '',
    mobile: '',
    department: null,
    designation: '',
    dateOfJoining: '',
    email: '',
    village: '',
    state: '',
    district: '',
  });

  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);

  const isDirty = Object.entries(employee).some(([key, value]) => {
    if (key === 'id') return false;
    return value !== '' && value !== null && value !== undefined;
  });

  usePrompt(
    'You have unsaved changes. Are you sure you want to leave this page?',
    isDirty,
  );
  useBeforeUnload(isDirty);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const schoolCode = localStorage.getItem('schoolCode');
        const baseUrl = getBaseUrlBySchoolCode(schoolCode);

        if (!baseUrl) {
          console.error('Invalid or missing school code');
          return;
        }

        const response = await fetch(`${baseUrl}/api/Employee/GetEmployees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json();
        setEmployees(data);

        const maxId = Math.max(...data.map(emp => emp.id || 0));
        setEmployee(prev => ({ ...prev, id: maxId + 1 }));
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (field, value) => {
    let updatedValue = value;

    if (field === 'name' || field === 'fatherName') {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 30);
    } else if (field === 'mobile') {
      updatedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    } else if (field === 'village') {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
    }

    setEmployee({ ...employee, [field]: updatedValue });
  };

  const validateFields = () => {
    const newErrors = {};
    const {
      name,
      fatherName,
      gender,
      dob,
      mobile,
      department,
      designation,
      dateOfJoining,
      email,
      village,
      state,
      district,
    } = employee;

    if (!name) newErrors.name = 'Name is required';
    if (!fatherName) newErrors.fatherName = "Father's Name is required";
    if (!gender) newErrors.gender = 'Gender is required'; // ✅ अब object check
    if (!dob) newErrors.dob = 'DOB is required';
    if (!mobile || mobile.length !== 10)
      newErrors.mobile = 'Enter valid 10-digit Mobile No';
    if (!department) newErrors.department = 'Department is required';
    if (!designation) newErrors.designation = 'Designation is required';
    if (!dateOfJoining) newErrors.dateOfJoining = 'Date of Joining is required';
    if (!email || !email.includes('@') || !email.includes('.'))
      newErrors.email = 'Enter valid email';
    if (!village) newErrors.village = 'Village is required';
    if (!state) newErrors.state = 'State is required';
    if (!district) newErrors.district = 'District is required';

    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // No API to save, so we just reset form
    const nextId = (employee.id || 0) + 1;
    resetForm(nextId);
  };

  const resetForm = nextId => {
    setEmployee({
      id: nextId,
      name: '',
      fatherName: '',
      gender: null,
      dob: '',
      mobile: '',
      department: null,
      designation: '',
      dateOfJoining: '',
      email: '',
      village: '',
      state: '',
      district: '',
    });
    setErrors({});
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.bodyBg,
        minHeight: '100vh',
        px: { xs: 2, sm: 2 },
        py: { xs: 1, sm: 0 },
      }}
    >
      <CustomBreadcrumb
        title='Employee Master'
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Admin', href: '/admin' },
        ]}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexWrap: 'wrap',
          flexDirection: 'column',
          mt: -1,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: { xs: '100%', md: 'auto' },
            backgroundColor: theme.paperBg,
            color: fontColor.paper,
          }}
        >
          {/* <Typography
            variant="h4"
            align="center"
            mb={4}
            sx={{
              fontWeight: 600,
              color: theme.formHeaderFontColor,
              fontFamily: theme.formHeaderFontFamily,
            }}
          >
            Employee Master
          </Typography> */}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
            }}
          >
            <FilledTextField
              label='Employee ID'
              fullWidth
              value={employee.id}
              InputProps={{ readOnly: true }}
            />

            <FilledTextField
              label='Name'
              value={employee.name}
              required
              onChange={e => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <FilledTextField
              label="Father's Name"
              value={employee.fatherName}
              required
              onChange={e => handleChange('fatherName', e.target.value)}
              error={!!errors.fatherName}
              helperText={errors.fatherName}
              fullWidth
            />

            {/* ✅ नया Gender dropdown */}
            <GetGender
              value={employee.gender}
              onGenderChange={val => handleChange('gender', val)}
              error={!!errors.gender}
              helperText={errors.gender}
              showSelectAll={false}
            />

            <FilledTextField
              label='Date of Birth'
              type='date'
              value={employee.dob}
              required
              onChange={e => handleChange('dob', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dob}
              helperText={errors.dob}
              fullWidth
            />

            <FilledTextField
              label='Mobile No.'
              value={employee.mobile}
              required
              onChange={e => handleChange('mobile', e.target.value)}
              error={!!errors.mobile}
              helperText={errors.mobile}
              fullWidth
            />

            {/* ✅ Department dropdown */}
            <GetEmployeeDepartment
              value={employee.department}
              onDepartmentChange={val => handleChange('department', val)}
              error={!!errors.department}
              helperText={errors.department}
              showSelectAll={false}
            />

            <FilledAutocomplete
              options={designations}
              value={employee.designation}
              onChange={(_, value) => handleChange('designation', value || '')}
              label='Designation'
              error={!!errors.designation}
              helperText={errors.designation}
              fullWidth
              popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
              clearIcon={<Clear sx={{ color: fontColor.paper }} />}
            />

            <FilledTextField
              label='Date of Joining'
              type='date'
              value={employee.dateOfJoining}
              required
              onChange={e => handleChange('dateOfJoining', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dateOfJoining}
              helperText={errors.dateOfJoining}
              fullWidth
            />

            <FilledTextField
              label='Email'
              value={employee.email}
              required
              onChange={e => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />

            <FilledTextField
              label='Village'
              value={employee.village}
              required
              onChange={e => handleChange('village', e.target.value)}
              error={!!errors.village}
              helperText={errors.village}
              fullWidth
            />

            <GetState
              value={employee.state}
              onChange={val => handleChange('state', val)}
              error={!!errors.state}
              helperText={errors.state}
            />

            <GetDistrict
              stateValue={employee.state}
              value={employee.district}
              onChange={val => handleChange('district', val)}
              error={!!errors.district}
              helperText={errors.district}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button variant='contained' fullWidth onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Paper>

        {/* ✅ Saved employees table */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: { xs: '100%', md: 'auto' },
            backgroundColor: theme.paperBg,
            color: fontColor.paper,
          }}
        >
          <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>
            Saved Employees
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ backgroundColor: theme.paperBg }}
          >
            <Table size='small'>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>
                    <strong>Emp ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Father's Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Mobile</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Department</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Gender</strong>
                  </TableCell>{' '}
                  {/* ✅ नया कॉलम */}
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {emp.employeeID || emp.id}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {emp.name}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {emp.fatherName}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {emp.mobileNo || emp.mobile}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {emp.department?.label || emp.department}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {emp.gender?.label || emp.gender}
                    </TableCell>{' '}
                    {/* ✅ दिखाओ */}
                  </TableRow>
                ))}
                {employees.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align='center'
                      sx={{ color: fontColor.paper }}
                    >
                      No employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default EmployeeMaster;
