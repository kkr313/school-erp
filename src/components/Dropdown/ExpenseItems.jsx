import React, { useEffect, useState } from 'react';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import { getBaseUrlBySchoolCode } from '../../utils/schoolBaseUrls';
import FilledAutocomplete from '../../utils/FilledAutocomplete';
import { useTheme } from '../../context/ThemeContext';

const ExpenseItems = ({ value, onChange, error, helperText }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, fontColor } = useTheme();

  useEffect(() => {
    const fetchExpenseItems = async () => {
      try {
        const schoolCode = localStorage.getItem('schoolCode');
        const baseUrl = getBaseUrlBySchoolCode(schoolCode);

        if (!baseUrl) {
          console.error('Invalid or missing school code');
          return;
        }

        const response = await fetch(
          `${baseUrl}/api/Expense/GetItemExpenseList`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' } }
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Error fetching expense items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseItems();
  }, []);

  return (
    <FilledAutocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      label="Name of Expense"
      error={error}
      helperText={helperText}
      options={options}
      getOptionLabel={(option) => option?.itemName || ''}
      isOptionEqualToValue={(option, val) => option?.itemId === val?.itemId}
      loading={loading}
      popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
      clearIcon={<Clear sx={{ color: fontColor.paper }} />}
    />
  );
};

export default ExpenseItems;
