// src/components/student/admission/PersonalInfo.jsx
import React, { memo, useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import Gender from '../../ui/forms/dropdown/Gender';
import FilledTextField from '../../../utils/FilledTextField';

const PersonalInfo = memo(
  ({ gender, setGender, dob, setDob, fatherName, setFatherName }) => {
    const handleFatherNameChange = useCallback(
      e => {
        const value = e.target.value;
        if (/^[A-Za-z\s]{0,30}$/.test(value)) setFatherName(value);
      },
      [setFatherName],
    );

    const maxDobDate = useMemo(() => {
      return new Date(new Date().setFullYear(new Date().getFullYear() - 3))
        .toISOString()
        .split('T')[0];
    }, []);

    const fatherNameError = useMemo(() => {
      return fatherName !== '' && !/^[A-Za-z\s]{1,30}$/.test(fatherName);
    }, [fatherName]);

    return (
      <>
        {/* Personal Information Section */}
        <Box
          className='span-3'
          sx={{
            borderTop: '1px solid #e2e8f0',
            pt: 1.5,
            mt: 1,
            mb: 0.5,
            position: 'relative',
          }}
        >
          <Typography
            variant='body2'
            sx={{
              position: 'absolute',
              top: -10,
              left: 12,
              bgcolor: 'white',
              px: 1,
              color: '#64748b',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            Personal Information
          </Typography>
        </Box>

        <Gender value={gender} onChange={setGender} />
        <FilledTextField
          label='Date of Birth'
          name='dateOfBirth'
          type='date'
          value={dob}
          onChange={e => setDob(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: maxDobDate }}
          fullWidth
          required
        />
        <FilledTextField
          label="Father's Name"
          name='fatherName'
          value={fatherName}
          onChange={handleFatherNameChange}
          error={fatherNameError}
          helperText={
            fatherNameError ? 'Alphabets only, max 30 characters' : ''
          }
          fullWidth
          required
        />
      </>
    );
  },
);

PersonalInfo.displayName = 'PersonalInfo';

export default PersonalInfo;
