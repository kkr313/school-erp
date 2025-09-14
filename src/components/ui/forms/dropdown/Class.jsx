import React, { useEffect, useState } from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';
import { masterApi } from '../../../../api';

const Class = ({ value, onChange, error, helperText, sx = {} }) => {
  const [classOptions, setClassOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const data = await masterApi.getClasses();

        if (data && Array.isArray(data)) {
          const options = data.map(item => ({
            label: item.className || item.name || item.label,
            value: item.classID || item.id || item.value,
          }));
          setClassOptions(options);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        // Fallback options
        setClassOptions([
          { label: 'Class 1', value: '1' },
          { label: 'Class 2', value: '2' },
          { label: 'Class 3', value: '3' },
          { label: 'Class 4', value: '4' },
          { label: 'Class 5', value: '5' },
          { label: 'Class 6', value: '6' },
          { label: 'Class 7', value: '7' },
          { label: 'Class 8', value: '8' },
          { label: 'Class 9', value: '9' },
          { label: 'Class 10', value: '10' },
          { label: 'Class 11', value: '11' },
          { label: 'Class 12', value: '12' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={classOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='Class'
        name='class'
        error={error}
        helperText={helperText}
        loading={loading}
        sx={sx}
      />
    </FormControl>
  );
};

export default Class;
