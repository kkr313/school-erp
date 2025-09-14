import React from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';

const SchoolPeriod = ({ value, onChange, error, helperText, sx = {} }) => {
  const periodOptions = [
    { label: 'Morning (8:00 AM - 12:00 PM)', value: 'Morning' },
    { label: 'Afternoon (12:00 PM - 4:00 PM)', value: 'Afternoon' },
    { label: 'Evening (4:00 PM - 8:00 PM)', value: 'Evening' },
    { label: 'Full Day (8:00 AM - 4:00 PM)', value: 'Full Day' },
  ];

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={periodOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='School Period'
        name='schoolPeriod'
        error={error}
        helperText={helperText}
        sx={sx}
      />
    </FormControl>
  );
};

export default SchoolPeriod;
