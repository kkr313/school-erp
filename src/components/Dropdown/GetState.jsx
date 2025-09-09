// GetState.jsx
import React, { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { useApi } from "../../utils/useApi";

const GetState = ({ value, onChange, label = "State", error = false, helperText = "" }) => {
  const { fontColor } = useTheme();
  const { callApi } = useApi();
  const [stateOptions, setStateOptions] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      const data = await callApi("/api/GetStateDistrictList/GetStateDistrictList", {});
      if (data) {
        const states = data.map((s) => ({
          label: s.stateName,
          value: s.stateName,
          districts: s.districtNameList || [],
        }));
        setStateOptions(states);
      }
    };
    fetchStates();
  }, []);

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        label={label}
        placeholder="Select state"
        value={stateOptions.find((opt) => opt.value === value?.value) || null}
        onChange={(e, newValue) => onChange && onChange(newValue || null)}
        options={stateOptions}
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

export default GetState;
