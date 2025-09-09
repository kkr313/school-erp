import React, { useEffect, useState } from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import { getBaseUrlBySchoolCode } from '../../utils/schoolBaseUrls';
import FilledAutocomplete from '../../utils/FilledAutocomplete';


const Religion = ({ value, onChange, error, helperText, sx = {} }) => {
  const [religionOptions, setReligionOptions] = useState([]);

  useEffect(() => {
    const fetchReligions = async () => {
      try {
        const schoolCode = localStorage.getItem('schoolCode'); // 👈 Get stored schoolCode
        const baseUrl = getBaseUrlBySchoolCode(schoolCode);   // 👈 Get API base URL

        if (!baseUrl) {
          console.error('Invalid or missing school code');
          return;
        }

        const response = await fetch(`${baseUrl}/api/Religions/GetReligions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch religions');
        }

        const data = await response.json();
        const options = data.map(item => item.religionName);
        setReligionOptions(options);
      } catch (error) {
        console.error('Error fetching religions:', error);
      }
    };

    fetchReligions();
  }, []);

  return (
    <FormControl fullWidth required>
      <FilledAutocomplete
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        label="Religion"
        options={religionOptions}
        error={error}
        helperText={helperText}
        required
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        sx={sx}
      />
    </FormControl>
  );
};

export default Religion;
