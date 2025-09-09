import React, { useState, useEffect } from "react";
import { 
  Box, 
  Checkbox, 
  Chip, 
  FormControl, 
  Autocomplete, 
  TextField,
  Typography 
} from "@mui/material";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { useTheme } from "../../context/ThemeContext";
import { useApi } from "../../utils/useApi";

const GetFeeDetails = ({ admissionId, onMonthsChange, onPrevDues }) => {
  const { callApi } = useApi();
  const { fontColor, theme } = useTheme();

  const [months, setMonths] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);

  useEffect(() => {
    const fetchFeeData = async () => {
      const feeData = await callApi(
        "/api/MonthlyBillingFees/GetMonthlyBillingFees",
        { trackingId: "string", admissionId }
      );

      if (feeData) {
        const { prevDues, dues } = feeData;

        if (typeof onPrevDues === "function") {
          onPrevDues(prevDues || null);
        }

        const monthsArray = (dues || []).map((d) => {
          const totalAmount = d.fees.reduce((sum, f) => sum + f.amount, 0);
          return {
            id: d.monthId,
            label: d.monthName, // ✅ FilledAutocomplete ke liye
            value: d.monthName,
            amount: totalAmount,
            details: d.fees,
          };
        });

        setMonths(monthsArray);

        if (monthsArray.length > 0) {
          setSelectedMonths([monthsArray[0]]);
          if (typeof onMonthsChange === "function") {
            onMonthsChange(monthsArray.slice(0, 1));
          }
        } else {
          setSelectedMonths([]);
          if (typeof onMonthsChange === "function") onMonthsChange([]);
        }
      } else {
        if (typeof onPrevDues === "function") onPrevDues(null);
        setMonths([]);
        setSelectedMonths([]);
        if (typeof onMonthsChange === "function") onMonthsChange([]);
      }
    };
    fetchFeeData();
  }, [admissionId, callApi, onMonthsChange, onPrevDues]);

  // ✅ forward selection logic
  const handleMonthClick = (clickedMonth) => {
    const index = months.findIndex((m) => m.value === clickedMonth.value);
    if (index !== -1) {
      const uptoClicked = months.slice(0, index + 1);
      setSelectedMonths(uptoClicked);
      if (typeof onMonthsChange === "function") {
        onMonthsChange(uptoClicked);
      }
    }
  };
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        Select Fee Month(s)
      </Typography>
      <Autocomplete
        multiple
        size="small"
        options={months}
        value={selectedMonths}
        onChange={(event, newValue) => {
          if (newValue.length > 0) {
            // Auto-select consecutive months up to the last selected
            const lastSelected = newValue[newValue.length - 1];
            const index = months.findIndex((m) => m.value === lastSelected.value);
            if (index !== -1) {
              const consecutive = months.slice(0, index + 1);
              setSelectedMonths(consecutive);
              if (typeof onMonthsChange === "function") {
                onMonthsChange(consecutive);
              }
            }
          } else {
            setSelectedMonths([]);
            if (typeof onMonthsChange === "function") onMonthsChange([]);
          }
        }}
        getOptionLabel={(option) => `${option.label} (₹${option.amount})`}
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select months for fee collection"
            variant="outlined"
          />
        )}
        renderTags={(value, getTagProps) => {
          if (value.length <= 2) {
            return value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.value}
                label={`${option.label} (₹${option.amount})`}
                size="small"
                color="primary"
                variant="outlined"
              />
            ));
          } else {
            const first = value[0]?.label;
            const last = value[value.length - 1]?.label;
            const totalAmount = value.reduce((sum, month) => sum + month.amount, 0);
            return [
              <Chip
                key="range"
                label={`${first} to ${last} (₹${totalAmount})`}
                size="small"
                color="primary"
                variant="outlined"
              />,
            ];
          }
        }}
        renderOption={(props, option, { selected }) => (
          <Box component="li" {...props}>
            <Checkbox
              checked={selectedMonths.some((m) => m.value === option.value)}
              size="small"
            />
            <Box sx={{ ml: 1 }}>
              <Typography variant="body2">
                {option.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ₹{option.amount}
              </Typography>
            </Box>
          </Box>
        )}
      />
    </Box>
  );
};

export default GetFeeDetails;
