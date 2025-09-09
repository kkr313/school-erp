import React from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../utils/FilledAutocomplete';
import { useTheme } from '../../context/ThemeContext';

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const State = ({ value, onChange, error, helperText, sx = {} }) => {
  const { theme, fontColor } = useTheme(); // ✅ Hook used inside component

  return (
    <FormControl fullWidth required>
      <FilledAutocomplete
        label="State"
        options={states}
        value={value}
        onChange={(e, newValue) => onChange(newValue)}
        error={error}
        helperText={helperText}
        popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
        clearIcon={<Clear sx={{ color: fontColor.paper }} />}
        sx={sx}
      />
    </FormControl>
  );
};

export default State;
