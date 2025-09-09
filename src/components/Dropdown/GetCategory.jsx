// GetCategory.jsx
import React, { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { useApi } from "../../utils/useApi"; // custom hook

const GetCategory = ({
  onCategoryChange,
  value,
  label = "Student Category",
  error = false,
  helperText = "",
  showSelectAll = false, // ✅ allow Select All option
}) => {
  const { fontColor } = useTheme();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await callApi(
        "/api/GetStudentCategory/GetStudentCategory",
        { trackingID: "string" }
      );

      if (data) {
        const formatted = data.map((c) => ({
          label: c.name,
          value: c.id,
        }));

        // ✅ Add Select All only if enabled
        const options = showSelectAll
          ? [{ label: "Select All", value: "ALL" }, ...formatted]
          : formatted;

        setCategoryOptions(options);

        // ✅ default "ALL" select only if enabled & nothing is set
        if (showSelectAll && !value) {
          onCategoryChange &&
            onCategoryChange({
              label: "Select All",
              value: "ALL",
              allCategories: formatted.map((c) => c.value),
            });
        }
      }
    };

    fetchCategories();
  }, [showSelectAll]);

  const handleChange = (e, newValue) => {
    if (newValue?.value === "ALL") {
      onCategoryChange({
        ...newValue,
        allCategories: categoryOptions
          .filter((c) => c.value !== "ALL")
          .map((c) => c.value),
      });
    } else {
      onCategoryChange(newValue || null);
    }
  };

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        label={label}
        placeholder="Select category"
        value={
          categoryOptions.find((opt) => opt.value === value?.value) || null
        }
        onChange={handleChange}
        options={categoryOptions}
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

export default GetCategory;
