// src/components/student/admission/BasicStudentInfo.jsx
import React, { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import Class from '../../ui/forms/dropdown/Class';
import FilledTextField from '../../../utils/FilledTextField';

const BasicStudentInfo = React.memo(
  ({
    admissionNo,
    dateOfAdmission,
    setDateOfAdmission,
    selectedClass,
    setSelectedClass,
    selectedSection,
    setSelectedSection,
    rollNo,
    setRollNo,
    studentName,
    setStudentName,
  }) => {
    const handleSectionChange = useCallback(
      e => {
        const raw = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
        const trimmed = raw.slice(0, 2); // Max 2 characters
        setSelectedSection(trimmed);
      },
      [setSelectedSection],
    );

    const handleRollNoChange = useCallback(
      e => {
        const value = e.target.value;
        if (/^\d{0,3}$/.test(value)) setRollNo(value);
      },
      [setRollNo],
    );

    const handleStudentNameChange = useCallback(
      e => {
        const value = e.target.value;
        if (/^[A-Za-z\s]{0,30}$/.test(value)) setStudentName(value);
      },
      [setStudentName],
    );

    return (
      <>
        <FilledTextField
          label='Admission No.'
          name='admissionNo'
          value={admissionNo}
          fullWidth
          InputProps={{ readOnly: true }}
          required
        />
        <FilledTextField
          label='Date of Admission'
          name='dateOfAdmission'
          type='date'
          value={dateOfAdmission}
          onChange={e => setDateOfAdmission(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: new Date().toISOString().split('T')[0] }}
          fullWidth
          required
        />
        <Class value={selectedClass} onClassChange={setSelectedClass} />
        <FilledTextField
          label='Section'
          name='section'
          value={selectedSection}
          onChange={handleSectionChange}
          fullWidth
        />
        <FilledTextField
          label='Roll No.'
          name='rollNo'
          value={rollNo}
          onChange={handleRollNoChange}
          error={rollNo !== '' && !/^\d{1,3}$/.test(rollNo)}
          helperText={
            rollNo !== '' && !/^\d{1,3}$/.test(rollNo)
              ? 'Enter up to 3 digits only'
              : ''
          }
          fullWidth
        />
        <FilledTextField
          label='Student Name'
          name='studentName'
          value={studentName}
          onChange={handleStudentNameChange}
          error={studentName !== '' && !/^[A-Za-z\s]{1,30}$/.test(studentName)}
          helperText={
            studentName !== '' && !/^[A-Za-z\s]{1,30}$/.test(studentName)
              ? 'Alphabets only, max 30 characters'
              : ''
          }
          fullWidth
          required
        />
      </>
    );
  },
);

BasicStudentInfo.displayName = 'BasicStudentInfo';

export default BasicStudentInfo;
