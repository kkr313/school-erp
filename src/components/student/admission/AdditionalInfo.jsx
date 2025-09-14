// src/components/Admission/AdditionalInfo.jsx
import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import BloodGroup from '../../ui/forms/dropdown/BloodGroup';
import SchoolPeriod from '../../ui/forms/dropdown/SchoolPeriod';
import StudentType from '../../ui/forms/dropdown/StudentType';
import StudentStatus from '../../ui/forms/dropdown/StudentStatus';
import GetReligion from '../../ui/forms/dropdown/GetReligion';
import GetCategory from '../../ui/forms/dropdown/GetCategory';

const AdditionalInfo = React.memo(
  ({
    bloodGroup,
    setBloodGroup,
    schoolPeriod,
    setSchoolPeriod,
    studentType,
    setStudentType,
    studentStatus,
    setStudentStatus,
    religion,
    setReligion,
    category,
    setCategory,
  }) => {
    // Memoize section styles
    const sectionBoxSx = useMemo(
      () => ({
        borderTop: '1px solid #e2e8f0',
        pt: 1.5,
        mt: 1.5,
        mb: 0.5,
        position: 'relative',
      }),
      [],
    );

    const sectionTitleSx = useMemo(
      () => ({
        position: 'absolute',
        top: -10,
        left: 12,
        bgcolor: 'white',
        px: 1,
        color: '#64748b',
        fontSize: '0.85rem',
        fontWeight: 500,
      }),
      [],
    );

    return (
      <>
        {/* Additional Information Section */}
        <Box className='span-3' sx={sectionBoxSx}>
          <Typography variant='body2' sx={sectionTitleSx}>
            Additional Information
          </Typography>
        </Box>

        <BloodGroup value={bloodGroup} onChange={setBloodGroup} />
        <SchoolPeriod value={schoolPeriod} onChange={setSchoolPeriod} />
        <StudentType value={studentType} onChange={setStudentType} />
        <StudentStatus value={studentStatus} onChange={setStudentStatus} />
        <GetReligion value={religion} onReligionChange={setReligion} />
        <GetCategory value={category} onCategoryChange={setCategory} />
      </>
    );
  },
);

AdditionalInfo.displayName = 'AdditionalInfo';

export default AdditionalInfo;
