import React, { useEffect, useState } from 'react';
import { getBaseUrlBySchoolCode } from '../../utils/schoolBaseUrls';
import FilledAutocomplete from '../../utils/FilledAutocomplete';
import { useTheme } from '../../context/ThemeContext';
import { Clear, ArrowDropDown } from '@mui/icons-material';

const EmployeeList = ({ value, onChange, error, helperText }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const { theme, fontColor } = useTheme();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const schoolCode = localStorage.getItem('schoolCode');
        const baseUrl = getBaseUrlBySchoolCode(schoolCode);

        if (!baseUrl) {
          console.error('Invalid or missing school code');
          return;
        }

        const response = await fetch(`${baseUrl}/api/Employee/GetEmployees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const data = await response.json();
        setEmployees(data.map((emp) => ({ id: emp.id, name: emp.name })));
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <FilledAutocomplete
      label="Expense By"
      value={value || null}
      onChange={(e, newValue) => onChange(newValue)}
      options={employees}
      getOptionLabel={(option) => option?.name || ''}
      isOptionEqualToValue={(option, val) => option?.id === val?.id}
      clearOnEscape
      loading={loading}
      loadingText="Loading employees..."
      error={error}
      helperText={helperText}
      popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
      clearIcon={<Clear sx={{ color: fontColor.paper }} />}
    />
  );
};

export default EmployeeList;
