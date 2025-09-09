// GetDistrict.jsx
import React, { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";

const GetDistrict = ({
  stateValue,
  value,
  onChange,
  label = "District",
  error = false,
  helperText = "",
}) => {
  const { fontColor } = useTheme();
  const [districtOptions, setDistrictOptions] = useState([]);

  useEffect(() => {
    if (stateValue?.districts) {
      setDistrictOptions(stateValue.districts.map((d) => ({ label: d, value: d })));
    } else {
      setDistrictOptions([]);
    }
  }, [stateValue]);

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        label={label}
        placeholder="Select district"
        value={districtOptions.find((opt) => opt.value === value?.value) || null}
        onChange={(e, newValue) => onChange && onChange(newValue || null)}
        options={districtOptions}
        error={error}
        helperText={helperText}
        getOptionLabel={(option) => option?.label || ""}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
        clearIcon={<Clear sx={{ color: fontColor.paper }} />}
        disabled={districtOptions.length === 0}
      />
    </FormControl>
  );
};

export default GetDistrict;
