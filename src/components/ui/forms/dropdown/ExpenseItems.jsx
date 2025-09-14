import React, { useEffect, useState } from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';
import { useApi } from '../../../../utils/useApi';

const ExpenseItems = ({ value, onChange, error, helperText, sx = {} }) => {
  const [expenseOptions, setExpenseOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchExpenseItems = async () => {
      setLoading(true);
      try {
        const data = await callApi('/Get-ExpenseItems', {
          trackingID: 'string',
        });

        if (data && Array.isArray(data)) {
          const options = data.map(item => ({
            label: item.itemName || item.name || item.label,
            value: item.itemID || item.id || item.value,
          }));
          setExpenseOptions(options);
        }
      } catch (error) {
        console.error('Error fetching expense items:', error);
        setExpenseOptions([
          { label: 'Office Supplies', value: 'office_supplies' },
          { label: 'Maintenance', value: 'maintenance' },
          { label: 'Utilities', value: 'utilities' },
          { label: 'Transportation', value: 'transportation' },
          { label: 'Food & Refreshments', value: 'food_refreshments' },
          { label: 'Equipment', value: 'equipment' },
          { label: 'Books & Materials', value: 'books_materials' },
          { label: 'Software & Licenses', value: 'software_licenses' },
          { label: 'Miscellaneous', value: 'miscellaneous' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseItems();
  }, [callApi]);

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={expenseOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='Expense Item'
        name='expenseItem'
        error={error}
        helperText={helperText}
        loading={loading}
        sx={sx}
      />
    </FormControl>
  );
};

export default ExpenseItems;
