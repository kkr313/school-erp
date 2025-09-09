import React, { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { useApi } from "../../utils/useApi"; // custom hook

const GetGender = ({
  onGenderChange,
  value,
  label = "Gender",
  error = false,
  helperText = "",
  showSelectAll = false,   // ✅ new prop
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

        let options = formatted;
        if (showSelectAll) {
          options = [{ label: "Select All", value: "ALL" }, ...formatted];
          if (!value) {
            onGenderChange &&
              onGenderChange({ label: "Select All", value: "ALL", all: formatted });
          }
        }
        setGenderOptions(options);
      }
    };

    fetchGenders();
  }, [callApi, showSelectAll]);

  const handleChange = (e, newValue) => {
    if (showSelectAll && newValue?.value === "ALL") {
      // सारे genders return करो
      const allValues = genderOptions.filter((opt) => opt.value !== "ALL");
      onGenderChange &&
        onGenderChange({ label: "Select All", value: "ALL", all: allValues });
    } else {
      onGenderChange && onGenderChange(newValue || null);
    }
  };

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        label={label}
        placeholder="Select gender"
        value={genderOptions.find((opt) => opt.value === value?.value) || null}
        onChange={handleChange}
        options={genderOptions}
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

export default GetGender;
