import React from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';

const GetStudentStatus = ({ value, onChange, error, helperText, sx = {} }) => {
  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Graduated', value: 'Graduated' },
    { label: 'Transferred', value: 'Transferred' },
    { label: 'Dropped Out', value: 'Dropped Out' },
    { label: 'Suspended', value: 'Suspended' },
  ];

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={statusOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='Student Status'
        name='studentStatus'
        error={error}
        helperText={helperText}
        sx={sx}
      />
    </FormControl>
  );
};

export default GetStudentStatus;
