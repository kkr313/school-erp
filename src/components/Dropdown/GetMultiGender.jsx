import React, { useEffect, useState } from "react";
import { FormControl, Checkbox, ListItemText, Chip } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { useApi } from "../../utils/useApi"; // custom hook

const GetMultiGender = ({
  onGenderChange,
  value = [], // multiple values
  label = "Gender",
  error = false,
  helperText = "",
}) => {
  const { fontColor } = useTheme();
  const [genderOptions, setGenderOptions] = useState([]);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchGenders = async () => {
      const data = await callApi("/api/GetGenders/GetGenders", {});
      if (data && data.genderName) {
        const formatted = data.genderName.map((g) => ({
          label: g,
          value: g,
        }));

        // ✅ Upar "Select All" option add kar diya
        setGenderOptions([{ label: "Select All", value: "ALL" }, ...formatted]);
      }
    };

    fetchGenders();
  }, [callApi]);

  const handleChange = (e, newValue) => {
    const allOption = genderOptions.find((opt) => opt.value === "ALL");
    const allSelected = newValue.some((val) => val.value === "ALL");

    if (allSelected) {
      if (value.length === genderOptions.length - 1) {
        // ✅ Agar already all selected the, deselect karo
        onGenderChange([]);
      } else {
        // ✅ Sab select karo except "ALL"
        onGenderChange(genderOptions.filter((opt) => opt.value !== "ALL"));
      }
    } else {
      onGenderChange(newValue);
    }
  };

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
  multiple
  disableCloseOnSelect
  label={label}
  placeholder="Select gender(s)"
  value={value}
  onChange={handleChange}
  options={genderOptions}
  required
  error={error}
  helperText={helperText}
  getOptionLabel={(option) => option?.label || ""}
  isOptionEqualToValue={(option, val) => option?.value === val?.value}
  popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
  clearIcon={<Clear sx={{ color: fontColor.paper }} />}

  // ✅ Chips control
  renderTags={(selected, getTagProps) => {
  // ✅ All Selected case
  if (selected.length === genderOptions.length - 1) {
    return (
      <Chip
        label="All Selected"
        color="primary"
        size="small"
        // ❌ dabane pr saare unselect ho jaaye
        onDelete={() => onGenderChange([])}
      />
    );
  }

  // ✅ Normal case
  return selected.map((option, index) => (
    <Chip
      key={option.value}
      label={option.label}
      {...getTagProps({ index })}
      size="small"
    />
  ));
}}

  renderOption={(props, option, { selected }) => {
    const isAll = option.value === "ALL";
    const isChecked = isAll
      ? value.length === genderOptions.length - 1
      : selected;

    return (
      <li {...props}>
        <Checkbox
          style={{ marginRight: 8 }}
          checked={isChecked}
          indeterminate={
            isAll &&
            value.length > 0 &&
            value.length < genderOptions.length - 1
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

export default GetMultiGender;
