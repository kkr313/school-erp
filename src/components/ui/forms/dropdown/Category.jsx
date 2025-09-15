import React, { useEffect, useState } from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import { useApi } from '../../../../utils/useApi.jsx';
import { API_ENDPOINTS } from '../../../../api/endpoints';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';

const Category = ({ value, onChange, error, helperText, sx = {} }) => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchCategories = async () => {
      try {        // Try alternative endpoint first (matches school-web-app pattern)
        const response = await callApi(API_ENDPOINTS.MASTERS.GET_STUDENT_CATEGORIES_ALT, {});
        
        if (response && Array.isArray(response)) {
          const options = response.map(item => item.categoryName);
          setCategoryOptions(options);
        }
      } catch (error) {
        console.error('Error fetching student categories:', error);
        // Fallback to main endpoint if alternative fails
        try {
          const fallbackResponse = await callApi(API_ENDPOINTS.MASTERS.GET_STUDENT_CATEGORIES, {
            trackingID: 'string'
          });
          if (fallbackResponse && Array.isArray(fallbackResponse)) {
            const options = fallbackResponse.map(item => item.categoryName);
            setCategoryOptions(options);
          }
        } catch (fallbackError) {
          console.error('Error with fallback endpoint:', fallbackError);
        }
      }
    };

    fetchCategories();
  }, [callApi]);

  return (
    <FormControl fullWidth required>
      <FilledAutocomplete
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        label="Category"
        options={categoryOptions}
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

export default Category;
