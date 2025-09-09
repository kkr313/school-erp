import React, { useEffect, useState } from "react";
import { FormControl, Checkbox, Chip } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";

const GetStudentType = ({
  value = [],
  onChange,
  label = "Student Type",
  error = false,
  helperText = "",
  defaultSelectAll = false, // ✅ new prop
}) => {
  const { fontColor } = useTheme();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const opts = ["New", "Old"].map((o) => ({ label: o, value: o }));
    setOptions([{ label: "Select All", value: "ALL" }, ...opts]);

    // ✅ If prop is true and value empty, preselect New+Old
    if (defaultSelectAll && value.length === 0) {
      onChange(opts);
    }
  }, [defaultSelectAll]);

  const handleChange = (e, newValue) => {
    const allSelected = newValue.some((v) => v.value === "ALL");
    if (allSelected) {
      if (value.length === options.length - 1) {
        onChange([]); // deselect all
      } else {
        onChange(options.filter((o) => o.value !== "ALL")); // select all (New + Old)
      }
    } else {
      onChange(newValue);
    }
  };

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        multiple
        disableCloseOnSelect
        label={label}
        value={value}
        onChange={handleChange}
        options={options}
        error={error}
        helperText={helperText}
        getOptionLabel={(option) => option?.label || ""}
        isOptionEqualToValue={(o, v) => o?.value === v?.value}
        popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
        clearIcon={<Clear sx={{ color: fontColor.paper }} />}
        renderTags={(selected, getTagProps) =>
          selected.length === options.length - 1 ? (
            <Chip
              label="All Selected"
              color="primary"
              size="small"
              onDelete={() => onChange([])}
            />
          ) : (
            selected.map((option, i) => (
              <Chip
                key={option.value}
                label={option.label}
                {...getTagProps({ index: i })}
                size="small"
              />
            ))
          )
        }
        renderOption={(props, option, { selected }) => {
          const isAll = option.value === "ALL";
          const isChecked = isAll
            ? value.length === options.length - 1
            : selected;
          return (
            <li {...props}>
              <Checkbox
                style={{ marginRight: 8 }}
                checked={isChecked}
                indeterminate={
                  isAll && value.length > 0 && value.length < options.length - 1
                }
                color="primary"
              />
              {option.label}
            </li>
          );
        }}
      />
    </FormControl>
  );
};

export default GetStudentType;
