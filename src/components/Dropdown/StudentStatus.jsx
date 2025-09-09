import React from 'react';
import { FormControl } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import { ArrowDropDown, Clear } from '@mui/icons-material';
import FilledAutocomplete from '../../utils/FilledAutocomplete';

const StudentType = ({ value, onChange, error, helperText }) => {
  const { fontColor } = useTheme();
  const types = ["Normal", "Left"];

  return (
    <FormControl fullWidth required>
      <FilledAutocomplete
        label="Student Status"
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
