// src/components/Dropdown/GetMonthList.jsx
import React, { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { useApi } from "../../utils/useApi"; // <-- custom hook

const GetMonthList = ({
  onMonthChange,
  value,
  label = "Month",
  error = false,
  helperText = "",
}) => {
  const { fontColor } = useTheme();
  const [monthOptions, setMonthOptions] = useState([]);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchMonths = async () => {
      const data = await callApi("/api/GetMonths/GetMonths", {
        trackingID: "string",
      });

      if (data) {
        const formatted = data.map((m) => ({
          label: `${m.monthName} ${m.year}`,
          value: m.id,
        }));
        setMonthOptions(formatted);
      }
    };

    fetchMonths();
  }, []);

  const handleChange = (e, newValue) => {
    onMonthChange && onMonthChange(newValue);
  };

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        label={label}
        placeholder="Select month"
        value={value}
        onChange={handleChange}
        options={monthOptions}
        required
        error={error}
        helperText={helperText}
        getOptionLabel={(option) => option?.label || ""}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
        clearIcon={<Clear sx={{ color: fontColor.paper }} />}
      />
    </FormControl>
  );
};

export default GetMonthList;
