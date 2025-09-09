// GetReligion.jsx
import React, { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { useApi } from "../../utils/useApi"; // custom hook

const GetReligion = ({
  onReligionChange,
  value,
  label = "Religion",
  error = false,
  helperText = "",
  showSelectAll = false, // ✅ allow Select All option
}) => {
  const { fontColor } = useTheme();
  const [religionOptions, setReligionOptions] = useState([]);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchReligions = async () => {
      const data = await callApi("/api/GetReligions/GetReligions", {
        trackingID: "string",
      });

      if (data) {
        const formatted = data.map((r) => ({
          label: r.name,
          value: r.id,
          isMinority: r.minorityGroups,
        }));

        // ✅ Add Select All only if enabled
        const options = showSelectAll
          ? [{ label: "Select All", value: "ALL" }, ...formatted]
          : formatted;

        setReligionOptions(options);

        // ✅ default "ALL" select only if enabled & nothing is set
        if (showSelectAll && !value) {
          onReligionChange &&
            onReligionChange({
              label: "Select All",
              value: "ALL",
              allReligions: formatted.map((r) => r.value),
            });
        }
      }
    };

    fetchReligions();
  }, [showSelectAll]);

  const handleChange = (e, newValue) => {
    if (newValue?.value === "ALL") {
      onReligionChange({
        ...newValue,
        allReligions: religionOptions
          .filter((r) => r.value !== "ALL")
          .map((r) => r.value),
      });
    } else {
      onReligionChange(newValue || null);
    }
  };

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        label={label}
        placeholder="Select religion"
        value={
          religionOptions.find((opt) => opt.value === value?.value) || null
        }
        onChange={handleChange}
        options={religionOptions}
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

export default GetReligion;
