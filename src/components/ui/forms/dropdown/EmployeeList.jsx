import React, { useEffect, useState } from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';
import { useApi } from '../../../../utils/useApi';

const EmployeeList = ({ value, onChange, error, helperText, sx = {} }) => {
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await callApi('/Get-Employees', {
          trackingID: 'string',
        });

        if (data && Array.isArray(data)) {
          const options = data.map(item => ({
            label: item.employeeName || item.name || item.label,
            value: item.employeeID || item.id || item.value,
          }));
          setEmployeeOptions(options);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployeeOptions([
          { label: 'John Doe', value: 'emp_001' },
          { label: 'Jane Smith', value: 'emp_002' },
          { label: 'Robert Johnson', value: 'emp_003' },
          { label: 'Emily Davis', value: 'emp_004' },
          { label: 'Michael Brown', value: 'emp_005' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [callApi]);

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={employeeOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='Employee'
        name='employee'
        error={error}
        helperText={helperText}
        loading={loading}
        sx={sx}
      />
    </FormControl>
  );
};

export default EmployeeList;
