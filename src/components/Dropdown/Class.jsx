// src/components/Dropdown/Class.jsx
import React, { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { useApi } from "../../utils/useApi"; // <-- import custom hook

const Class = ({
  onClassChange,
  value,
  label = "Class Name",
  error = false,
  helperText = "",
}) => {
  const { fontColor } = useTheme();
  const [classOptions, setClassOptions] = useState([]);
  const { callApi } = useApi();
  
  useEffect(() => {
    const fetchClasses = async () => {
      const data = await callApi("/api/GetClass/GetClasses", {
        trackingID: "string",
      });

      if (data) {
        const formatted = data.map((cls) => ({
          label: cls.className,
          value: cls.id,
        }));
        setClassOptions(formatted);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e, newValue) => {
    onClassChange && onClassChange(newValue);
  };

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        label={label}
        placeholder="Select class"
        value={value}
        onChange={handleChange}
        options={classOptions}
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

export default Class;
