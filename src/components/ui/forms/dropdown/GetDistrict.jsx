import React, { useEffect, useState } from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';
import { useApi } from '../../../../utils/useApi';

const GetDistrict = ({
  value,
  onChange,
  error,
  helperText,
  stateId,
  sx = {},
}) => {
  const [districtOptions, setDistrictOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!stateId) {
        setDistrictOptions([]);
        return;
      }

      setLoading(true);
      try {
        const data = await callApi('/Get-District', {
          trackingID: 'string',
          stateID: stateId,
        });

        if (data && Array.isArray(data)) {
          const options = data.map(item => ({
            label: item.districtName || item.name || item.label,
            value: item.districtID || item.id || item.value,
          }));
          setDistrictOptions(options);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
        setDistrictOptions([
          { label: 'Patna', value: 'Patna' },
          { label: 'Gaya', value: 'Gaya' },
          { label: 'Muzaffarpur', value: 'Muzaffarpur' },
          { label: 'Bhagalpur', value: 'Bhagalpur' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [callApi, stateId]);

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={districtOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='District'
        name='district'
        error={error}
        helperText={helperText}
        loading={loading}
        disabled={!stateId}
        sx={sx}
      />
    </FormControl>
  );
};

export default GetDistrict;
