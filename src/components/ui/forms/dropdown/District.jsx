import React from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';

const District = ({ value, onChange, error, helperText, stateId, sx = {} }) => {
  const districtOptions = [
    { label: 'Patna', value: 'Patna' },
    { label: 'Gaya', value: 'Gaya' },
    { label: 'Muzaffarpur', value: 'Muzaffarpur' },
    { label: 'Bhagalpur', value: 'Bhagalpur' },
    { label: 'Darbhanga', value: 'Darbhanga' },
    { label: 'Arrah', value: 'Arrah' },
    { label: 'Begusarai', value: 'Begusarai' },
    { label: 'Katihar', value: 'Katihar' },
  ];

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={districtOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='District'
        name='district'
        error={error}
        helperText={helperText}
        sx={sx}
      />
    </FormControl>
  );
};

export default District;
