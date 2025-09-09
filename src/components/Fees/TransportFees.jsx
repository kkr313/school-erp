import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Autocomplete,
  TextField,
  Typography,
  Chip,
  FormControl,
  Checkbox,
  Popper,
} from '@mui/material';
import { IoMdArrowDropdown, IoMdCheckmarkCircle } from 'react-icons/io';
import { useTheme } from '../../context/ThemeContext';

const routesData = [
  {
    name: 'Route 1',
    stops: [
      { stop: 'Stop A', fee: 500 },
      { stop: 'Stop B', fee: 600 }
    ]
  },
  {
    name: 'Route 2',
    stops: [
      { stop: 'Stop C', fee: 700 },
      { stop: 'Stop D', fee: 800 }
    ]
  }
];

const monthOptions = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
].map(month => ({ label: month, value: month }));

const TransportFees = ({ classId, onFeeChange }) => {
  const { theme, fontColor } = useTheme();

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  const containerRef = useRef(null);
  const popperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current?.contains(event.target) ||
        popperRef.current?.contains(event.target)
      ) return;

      setOpenDropdown(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (onFeeChange && selectedRoute && selectedStop && selectedMonths.length) {
      const transportFees = selectedMonths.map(month => ({
        routeName: selectedRoute.name,
        stopName: selectedStop.stop,
        monthName: month.value,
        amount: selectedStop.fee
      }));
      onFeeChange(transportFees);
    } else if (onFeeChange) {
      onFeeChange([]);
    }
  }, [selectedRoute, selectedStop, selectedMonths]);

  const handleMonthChange = (newValue) => {
    setSelectedMonths(newValue);
  };

  const handleSelectAll = () => {
    setSelectedMonths(monthOptions);
  };

  const handleClearAll = () => {
    setSelectedMonths([]);
  };

  const toggleDropdown = () => {
    setOpenDropdown(prev => !prev);
  };

  const allSelected = selectedMonths.length === monthOptions.length;

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: fontColor.paper },
      '&:hover fieldset': { borderColor: fontColor.paper },
      '&.Mui-focused fieldset': { borderColor: fontColor.paper },
    },
    '& .MuiInputLabel-root': { color: fontColor.paper },
    '& .MuiFormHelperText-root': { color: fontColor.paper },
    input: { color: fontColor.paper },
  };

  const autocompleteSx = {
    width: '100%',
    '& .MuiAutocomplete-clearIndicator': {
      color: fontColor.paper,
    },
    '& .MuiAutocomplete-popupIndicator': {
      color: fontColor.paper,
    },
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
        backgroundColor: theme.paperBg,
        color: fontColor.paper,
        borderRadius: 2,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Autocomplete
        options={routesData}
        getOptionLabel={(option) => option.name}
        value={selectedRoute}
        onChange={(e, newValue) => {
          setSelectedRoute(newValue);
          setSelectedStop(null);
          setSelectedMonths([]);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Route Name"
            variant="outlined"
            sx={textFieldStyles}
            InputLabelProps={{ style: { color: fontColor.paper } }}
            InputProps={{ ...params.InputProps, style: { color: fontColor.paper } }}
          />
        )}
        sx={autocompleteSx}
      />

      {selectedRoute && (
        <Autocomplete
          options={selectedRoute.stops}
          getOptionLabel={(option) => `${option.stop} (₹${option.fee})`}
          value={selectedStop}
          onChange={(e, newValue) => {
            setSelectedStop(newValue);
            setSelectedMonths([]);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Route Stop"
              variant="outlined"
              sx={textFieldStyles}
              InputLabelProps={{ style: { color: fontColor.paper } }}
              InputProps={{ ...params.InputProps, style: { color: fontColor.paper } }}
            />
          )}
          sx={autocompleteSx}
        />
      )}

      {selectedStop && (
        <Box sx={{ width: '100%', position: 'relative' }} ref={containerRef}>
          <Chip
            icon={allSelected ? <IoMdCheckmarkCircle color="white" fontSize={20} /> : null}
            label={
              <Typography
                variant="body2"
                sx={{
                  mx: 'auto',
                  fontWeight: 500,
                  textAlign: 'center',
                  width: '100%',
                  color: selectedMonths.length > 0 ? 'white' : 'black',
                }}
              >
                {`Month ${selectedMonths.length ? `[${selectedMonths.length}]` : ''}`}
              </Typography>
            }
            onClick={() => allSelected ? handleClearAll() : handleSelectAll()}
            sx={{
              cursor: 'pointer',
              width: '100%',
              pr: 3,
              borderRadius: 10,
              backgroundColor: selectedMonths.length > 0 ? 'primary.main' : '#eee',
              '&:hover': {
                backgroundColor: selectedMonths.length > 0 ? 'primary.dark' : '#ddd',
              },
            }}
          />
          <Box
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
            sx={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              cursor: 'pointer',
            }}
          >
            <IoMdArrowDropdown
              fontSize={20}
              style={{ color: selectedMonths.length > 0 ? 'white' : 'black' }}
            />
          </Box>

          {openDropdown && (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <Autocomplete
                multiple
                options={monthOptions}
                value={selectedMonths}
                onChange={(_, value) => handleMonthChange(value)}
                disableCloseOnSelect
                open
                disableClearable
                PopperComponent={(props) => (
                  <Popper
                    {...props}
                    placement="bottom-start"
                    style={{ zIndex: 1300, width: containerRef.current?.offsetWidth || 'auto' }}
                    ref={(el) => (popperRef.current = el)}
                    modifiers={[
                      {
                        name: 'preventOverflow',
                        options: { boundary: 'viewport' },
                      },
                    ]}
                  />
                )}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} />
                    <Typography>{option.label}</Typography>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select months"
                    variant="outlined"
                    sx={textFieldStyles}
                    InputProps={{
                      ...params.InputProps,
                      style: { height: 40, color: fontColor.paper },
                    }}
                    InputLabelProps={{ style: { color: fontColor.paper } }}
                  />
                )}
                renderTags={() => null}
                ListboxProps={{ style: { maxHeight: 200 } }}
                sx={autocompleteSx}
              />
            </FormControl>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TransportFees;
