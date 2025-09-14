// FilledAutocomplete.jsx
import React from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

const FilledAutocomplete = ({
  value,
  onChange,
  label,
  name,
  error,
  helperText,
  required = false,
  options = [],
  getOptionLabel = option => option?.label || option,
  isOptionEqualToValue = (option, val) => option === val,
  popupIcon: passedPopupIcon,
  clearIcon: passedClearIcon,
  loading = false,
  sx: sxProp = {},
  ...rest
}) => {
  const { theme, fontColor } = useTheme();

  const isFilled = (() => {
    if (value == null) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return !isNaN(value);
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') {
      return Object.values(value).some(
        v => v !== null && v !== undefined && String(v).trim() !== '',
      );
    }
    return false;
  })();

  const isWhiteBackground =
    theme.paperBg?.trim().toLowerCase() === '#fff' ||
    theme.paperBg?.trim().toLowerCase() === '#ffffff';

  const iconColor =
    isWhiteBackground && isFilled ? 'blue' : (fontColor?.paper ?? 'inherit');

  const blueFilledSx = {
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
  };

  const darkModeSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: fontColor.paper },
      '&:hover fieldset': { borderColor: fontColor.paper },
      '&.Mui-focused fieldset': { borderColor: fontColor.paper },
    },
    '& .MuiInputLabel-root': { color: fontColor.paper },
    '& .MuiFormHelperText-root': { color: fontColor.paper },
    input: { color: fontColor.paper },
    textarea: { color: fontColor.paper },
  };

  const finalTextFieldSx = isWhiteBackground
    ? { ...blueFilledSx, ...sxProp }
    : { ...darkModeSx, ...sxProp };

  return (
    <Autocomplete
      value={value}
      onChange={onChange}
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      popupIcon={
        passedPopupIcon
          ? React.cloneElement(passedPopupIcon, {
              sx: { ...passedPopupIcon.props?.sx, color: iconColor },
            })
          : undefined
      }
      clearIcon={
        passedClearIcon
          ? React.cloneElement(passedClearIcon, {
              sx: { ...passedClearIcon.props?.sx, color: iconColor },
            })
          : undefined
      }
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          name={name}
          error={error}
          helperText={helperText}
          required={required}
          fullWidth
          sx={finalTextFieldSx}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color='inherit' size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...rest}
    />
  );
};

export default FilledAutocomplete;
