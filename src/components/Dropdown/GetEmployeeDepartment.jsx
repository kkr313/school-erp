import React, { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import { useApi } from "../../utils/useApi"; // custom hook

const GetEmployeeDepartment = ({
  onDepartmentChange,
  value,
  label = "Department",
  error = false,
  helperText = "",
  showSelectAll = false, // ✅ नया prop default false
}) => {
  const { fontColor } = useTheme();
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await callApi(
        "/api/EmployeeDepartment/GetEmployeeDepartments",
        {}
      );

      if (data && data.departmentsName) {
        // format as label/value pairs
        const formatted = data.departmentsName.map((d) => ({
          label: d,
          value: d,
        }));

        // ✅ अगर showSelectAll true है तो सबसे पहले Select All option जोड़ो
        const options = showSelectAll
          ? [{ label: "Select All", value: "ALL" }, ...formatted]
          : formatted;

        setDepartmentOptions(options);

        // ✅ default ALL select अगर पहले से कोई value set नहीं है और showSelectAll true है
        if (showSelectAll && !value) {
          onDepartmentChange &&
            onDepartmentChange({ label: "Select All", value: "ALL" });
        }
      }
    };

    fetchDepartments();
  }, [callApi, showSelectAll]);

  const handleChange = (e, newValue) => {
    onDepartmentChange && onDepartmentChange(newValue || null);
  };

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        label={label}
        placeholder="Select department"
        value={
          departmentOptions.find((opt) => opt.value === value?.value) || null
        }
        onChange={handleChange}
        options={departmentOptions}
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

export default GetEmployeeDepartment;
