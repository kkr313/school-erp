// src/components/Dropdown/GetMonthList.jsx
import React, { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { masterApi } from "../../api/modules/masterApi.js";

const GetMonthList = ({
  onMonthChange,
  value,
  label = "Month",
  error = false,
  helperText = "",
}) => {
  const { fontColor } = useTheme();
  const [monthOptions, setMonthOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMonths = async () => {
      setLoading(true);
      try {
        const data = await masterApi.getMonths();

        if (data) {
          const formatted = data.map((m) => ({
            label: `${m.monthName} ${m.year}`,
            value: m.id,
          }));
          setMonthOptions(formatted);
        }
      } catch (error) {
        console.error('Failed to fetch months:', error);
      } finally {
        setLoading(false);
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
        loading={loading}
        getOptionLabel={(option) => option?.label || ""}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
        clearIcon={<Clear sx={{ color: fontColor.paper }} />}
      />
    </FormControl>
  );
};

export default GetMonthList;
