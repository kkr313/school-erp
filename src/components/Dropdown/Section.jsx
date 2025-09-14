import React, { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { masterApi } from "../../api/modules/masterApi.js";

const Section = ({
  classId,
  onSectionChange,
  value,
  label = "Section",
  error = false,
  helperText = "",
  showSelectAll = false, // ✅ prop added
}) => {
  const { fontColor } = useTheme();
  const [sectionOptions, setSectionOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classId) {
      setSectionOptions([]);
      return;
    }

    const fetchSections = async () => {
      setLoading(true);
      try {
        const data = await masterApi.getClassSections(classId);

        if (data) {
          const selectedClass = data.find((cls) => cls.classId === classId);
          if (selectedClass) {
            // ✅ format with N/A handling
            const formatted = selectedClass.sections.map((sec) => ({
              label: sec === "N/A" ? "N/A" : sec,
              value: sec === "N/A" ? "N/A" : sec,
            }));

            // ✅ Add Select All only if showSelectAll = true
            const options = showSelectAll
              ? [{ label: "Select All", value: "ALL" }, ...formatted]
              : formatted;

            setSectionOptions(options);

            // ✅ default "ALL" select only if enabled & nothing is set
            if (showSelectAll && !value) {
              onSectionChange &&
                onSectionChange({
                  label: "Select All",
                  value: "ALL",
                  allSections: formatted.map((s) => s.value),
                });
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [classId, showSelectAll]);

  const handleChange = (e, newValue) => {
    if (newValue?.value === "ALL") {
      onSectionChange({
        ...newValue,
        allSections: sectionOptions.filter((s) => s.value !== "ALL").map((s) => s.value),
      });
    } else {
      onSectionChange(newValue || null);
    }
  };

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        label={label}
        placeholder="Select section"
        value={sectionOptions.find((opt) => opt.value === value?.value) || null}
        onChange={handleChange}
        options={sectionOptions}
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

export default Section;
