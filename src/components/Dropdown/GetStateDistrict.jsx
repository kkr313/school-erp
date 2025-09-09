// GetStateDistrict.jsx
import React, { useEffect, useState } from "react";
import { Box, FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { useApi } from "../../utils/useApi"; // ✅ custom hook

const GetStateDistrict = ({
  stateValue,
  districtValue,
  onStateChange,
  onDistrictChange,
  stateLabel = "State",
  districtLabel = "District",
  error = false,
  helperText = "",
}) => {
  const { fontColor } = useTheme();
  const { callApi } = useApi();

  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);

  useEffect(() => {
    const fetchStateDistricts = async () => {
      const data = await callApi(
        "/api/GetStateDistrictList/GetStateDistrictList",
        {}
      );

      if (data) {
        const states = data.map((s) => ({
          label: s.stateName,
          value: s.stateName,
          districts: s.districtNameList || [],
        }));

        setStateOptions(states);
      }
    };

    fetchStateDistricts();
  }, []);

  const handleStateChange = (e, newValue) => {
    onStateChange && onStateChange(newValue || null);

    if (newValue && newValue.districts) {
      setDistrictOptions(
        newValue.districts.map((d) => ({ label: d, value: d }))
      );
    } else {
      setDistrictOptions([]);
      onDistrictChange && onDistrictChange(null);
    }
  };

  const handleDistrictChange = (e, newValue) => {
    onDistrictChange && onDistrictChange(newValue || null);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* State Dropdown */}
      <FormControl fullWidth>
        <FilledAutocomplete
          label={stateLabel}
          placeholder="Select state"
          value={
            stateOptions.find((opt) => opt.value === stateValue?.value) || null
          }
          onChange={handleStateChange}
          options={stateOptions}
          error={error}
          helperText={helperText}
          getOptionLabel={(option) => option?.label || ""}
          isOptionEqualToValue={(option, val) =>
            option?.value === val?.value
          }
          popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
          clearIcon={<Clear sx={{ color: fontColor.paper }} />}
        />
      </FormControl>

      {/* District Dropdown */}
      <FormControl fullWidth>
        <FilledAutocomplete
          label={districtLabel}
          placeholder="Select district"
          value={
            districtOptions.find(
              (opt) => opt.value === districtValue?.value
            ) || null
          }
          onChange={handleDistrictChange}
          options={districtOptions}
          error={error}
          helperText={helperText}
          getOptionLabel={(option) => option?.label || ""}
          isOptionEqualToValue={(option, val) =>
            option?.value === val?.value
          }
          popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
          clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          disabled={districtOptions.length === 0}
        />
      </FormControl>
    </Box>
  );
};

export default GetStateDistrict;
