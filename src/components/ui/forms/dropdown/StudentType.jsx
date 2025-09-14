import React from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';

const StudentType = ({ value, onChange, error, helperText, sx = {} }) => {
  const studentTypeOptions = [
    { label: 'New', value: 'New' },
    { label: 'Old', value: 'Old' },
  ];

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={studentTypeOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='Student Type'
        name='studentType'
        error={error}
        helperText={helperText}
        sx={sx}
      />
    </FormControl>
  );
};

export default StudentType;
