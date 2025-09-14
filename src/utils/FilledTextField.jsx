import React from 'react';
import { TextField } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

const FilledTextField = ({
  value,
  onChange,
  label,
  error,
  helperText,
  required = false,
  multiline = false,
  InputLabelProps,
  inputProps,
  sx,
  ...rest
}) => {
  const { theme, fontColor } = useTheme();
  const isFilled = !!value;
  const isWhiteBackground = theme.paperBg === '#ffffff';

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: fontColor.paper },
      '&:hover fieldset': { borderColor: fontColor.paper },
      '&.Mui-focused fieldset': { borderColor: fontColor.paper },
    },
    '& .MuiInputLabel-root': { color: fontColor.paper },
    '& .MuiFormHelperText-root': { color: fontColor.paper },
    input: { color: fontColor.paper },
    textarea: { color: fontColor.paper },
    ...sx,
  };

  const defaultWhiteSx = {
    '& .MuiInputLabel-root': {
      color: isFilled ? 'blue' : 'black',
    },
    '& .MuiOutlinedInput-root': {
      color: isFilled ? 'blue' : 'inherit',
      '& fieldset': {
        borderColor: 'black',
      },
      '&:hover fieldset': {
        borderColor: isFilled ? 'blue' : 'black',
      },
      '&.Mui-focused fieldset': {
        borderColor: isFilled ? 'blue' : 'black',
      },
    },
    ...sx,
  };

  return (
    <TextField
      label={label}
      value={value || ''}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth
      required={required}
      multiline={multiline}
      InputLabelProps={InputLabelProps}
      inputProps={inputProps}
      sx={isWhiteBackground ? defaultWhiteSx : textFieldStyles}
      {...rest}
    />
  );
};

export default FilledTextField;
