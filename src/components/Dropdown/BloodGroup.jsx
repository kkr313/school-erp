import React from 'react';
import { FormControl } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import FilledAutocomplete from '../../utils/FilledAutocomplete';
import { ArrowDropDown, Clear } from '@mui/icons-material';


const BloodGroup = ({ value, onChange }) => {
  const { fontColor } = useTheme();
  const bloodGroups = [
    "Unknown", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
  ];

  return (
    <FormControl fullWidth required>
      <FilledAutocomplete
        label="Blood Group"
        value={value}
        onChange={(_, v) => onChange(v)}
        options={bloodGroups}
        placeholder="Select blood group"
        popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
        clearIcon={<Clear sx={{ color: fontColor.paper }} />}
      />
    </FormControl>
  );
};

export default BloodGroup;
