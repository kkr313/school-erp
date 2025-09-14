// src/components/Dropdown/Class.jsx
import React, { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { masterApi } from "../../api/modules/masterApi.js";

const Class = ({
  onClassChange,
  value,
  label = "Class Name",
  error = false,
  helperText = "",
}) => {
  const { fontColor } = useTheme();
  const [classOptions, setClassOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const data = await masterApi.getClasses();
        if (data) {
          const formatted = data.map((cls) => ({
            label: cls.className,
            value: cls.id,
          }));
          setClassOptions(formatted);
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      } finally {
        setLoading(false);
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
        loading={loading}
        getOptionLabel={(option) => option?.label || ""}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
        clearIcon={<Clear sx={{ color: fontColor.paper }} />}
      />
    </FormControl>
  );
};

export default Class;
