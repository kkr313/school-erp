import React from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';

const GetEmployeeDepartment = ({
  value,
  onChange,
  error,
  helperText,
  sx = {},
}) => {
  const departmentOptions = [
    { label: 'Administration', value: 'Administration' },
    { label: 'Teaching', value: 'Teaching' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Maintenance', value: 'Maintenance' },
    { label: 'Transport', value: 'Transport' },
    { label: 'Library', value: 'Library' },
    { label: 'Laboratory', value: 'Laboratory' },
    { label: 'Sports', value: 'Sports' },
  ];

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={departmentOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='Department'
        name='department'
        error={error}
        helperText={helperText}
        sx={sx}
      />
    </FormControl>
  );
};

export default GetEmployeeDepartment;
