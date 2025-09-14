import React, { useEffect, useState } from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';
import { masterApi } from '../../../../api';

const GetFeeDetails = ({ value, onChange, error, helperText, sx = {} }) => {
  const [feeOptions, setFeeOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeeDetails = async () => {
      setLoading(true);
      try {
        const data = await masterApi.getFeeDetails();

        if (data && Array.isArray(data)) {
          const options = data.map(item => ({
            label: item.feeName || item.name || item.label,
            value: item.feeID || item.id || item.value,
          }));
          setFeeOptions(options);
        }
      } catch (error) {
        console.error('Error fetching fee details:', error);
        setFeeOptions([
          { label: 'Tuition Fee', value: 'tuition_fee' },
          { label: 'Library Fee', value: 'library_fee' },
          { label: 'Laboratory Fee', value: 'laboratory_fee' },
          { label: 'Sports Fee', value: 'sports_fee' },
          { label: 'Transport Fee', value: 'transport_fee' },
          { label: 'Examination Fee', value: 'examination_fee' },
          { label: 'Development Fee', value: 'development_fee' },
          { label: 'Admission Fee', value: 'admission_fee' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeDetails();
  }, []);

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={feeOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='Fee Details'
        name='feeDetails'
        error={error}
        helperText={helperText}
        loading={loading}
        sx={sx}
      />
    </FormControl>
  );
};

export default GetFeeDetails;
