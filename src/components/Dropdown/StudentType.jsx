import React from 'react';
import { FormControl } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import { ArrowDropDown, Clear } from '@mui/icons-material';
import FilledAutocomplete from '../../utils/FilledAutocomplete';

const StudentType = ({ value, onChange, error, helperText }) => {
  const { fontColor } = useTheme();
  const types = ["New", "Old"];

  return (
    <FormControl fullWidth required>
      <FilledAutocomplete
        label="Student Type"
        value={value}
        onChange={(_, v) => onChange(v)}
        options={types}
        error={error}
        helperText={helperText}
        popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
        clearIcon={<Clear sx={{ color: fontColor.paper }} />}
      />
    </FormControl>
  );
};

export default StudentType;
