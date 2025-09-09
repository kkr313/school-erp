import React from 'react';
import { FormControl } from '@mui/material';
import FilledAutocomplete from '../../utils/FilledAutocomplete';
import { useTheme } from '../../context/ThemeContext';
import { ArrowDropDown, Clear } from '@mui/icons-material';

const SchoolPeriod = ({ value, onChange }) => {
  const { fontColor } = useTheme();
  const periods = ["Day-Scholar", "Day-Boarding", "Boarding"];

  return (
    <FormControl fullWidth required>
      <FilledAutocomplete
        label="School Period"
        value={value}
        onChange={(_, v) => onChange(v)}
        options={periods}
        placeholder="Select school period"
        popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
        clearIcon={<Clear sx={{ color: fontColor.paper }} />}
      />
    </FormControl>
  );
};

export default SchoolPeriod;
