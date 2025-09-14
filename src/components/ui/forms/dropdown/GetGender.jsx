import React from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';

const GetGender = ({ value, onChange, error, helperText, sx = {} }) => {
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={genderOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='Gender'
        name='gender'
        error={error}
        helperText={helperText}
        sx={sx}
      />
    </FormControl>
  );
};

export default GetGender;
