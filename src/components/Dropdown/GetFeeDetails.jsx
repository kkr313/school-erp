import React, { useState, useEffect } from "react";
import { Box, Checkbox, Chip, FormControl } from "@mui/material";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
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
    <Box sx={{ mt: 0 }}>
      <FormControl fullWidth>
        <FilledAutocomplete
          multiple
          disableCloseOnSelect
          label="Select Month(s)"
          placeholder="Choose months"
          options={months}
          value={selectedMonths}
          onChange={(event, newValue, reason, details) => {
            if (details?.option) {
              handleMonthClick(details.option);
            }
          }}
          getOptionLabel={(option) => option?.label || ""}
          isOptionEqualToValue={(opt, val) => opt.value === val.value}
          popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
          clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          renderTags={(value, getTagProps) => {
            if (value.length <= 3) {
              return value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.value}
                  label={option.label}
                  size="small"
                  sx={
                    theme.paperBg === "#ffffff" // ✅ agar light theme hai (white bg)
                      ? {} // default style rakho
                      : {
                          backgroundColor: theme.paperBg,
                          color: fontColor.paper,
                          border: `1px solid ${fontColor.paper}`,
                          "& .MuiChip-deleteIcon": {
                            color: fontColor.paper,
                          },
                        }
                  }
                />
              ));
            } else {
              const first = value[0]?.label;
              const last = value[value.length - 1]?.label;
              return [
                <Chip
                  key="range"
                  label={`${first} to ${last}`}
                  sx={
                    theme.paperBg === "#ffffff"
                      ? {}
                      : {
                          backgroundColor: theme.paperBg,
                          color: fontColor.paper,
                          border: `1px solid ${fontColor.paper}`,
                        }
                  }
                />,
              ];
            }
          }}
          renderOption={(props, option, { selected }) => (
            <li
              {...props}
              key={option.value}
              onClick={() => handleMonthClick(option)}
            >
              <Checkbox
                checked={selectedMonths.some((m) => m.value === option.value)}
              />
              {option.label} ({option.amount})
            </li>
          )}
        />
      </FormControl>
    </Box>
  );
};

export default GetFeeDetails;
