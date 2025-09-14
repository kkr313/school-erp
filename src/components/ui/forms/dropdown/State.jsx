import React from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';

const State = ({ value, onChange, error, helperText, sx = {} }) => {
  const stateOptions = [
    { label: 'Bihar', value: 'Bihar' },
    { label: 'Delhi', value: 'Delhi' },
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: 'Tamil Nadu', value: 'Tamil Nadu' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Rajasthan', value: 'Rajasthan' },
    { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
    { label: 'West Bengal', value: 'West Bengal' },
    { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
  ];

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={stateOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='State'
        name='state'
        error={error}
        helperText={helperText}
        sx={sx}
      />
    </FormControl>
  );
};

export default State;
