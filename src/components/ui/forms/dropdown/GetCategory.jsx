import React from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';

const GetCategory = ({ value, onChange, error, helperText, sx = {} }) => {
  const categoryOptions = [
    { label: 'General', value: 'General' },
    { label: 'OBC', value: 'OBC' },
    { label: 'SC', value: 'SC' },
    { label: 'ST', value: 'ST' },
    { label: 'EWS', value: 'EWS' },
  ];

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={categoryOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='Category'
        name='category'
        error={error}
        helperText={helperText}
        sx={sx}
      />
    </FormControl>
  );
};

export default GetCategory;
