import React, { useEffect, useState } from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';
import { useApi } from '../../../../utils/useApi';

const GetState = ({ value, onChange, error, helperText, sx = {} }) => {
  const [stateOptions, setStateOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      try {
        const data = await callApi('/Get-State', {
          trackingID: 'string',
        });

        if (data && Array.isArray(data)) {
          const options = data.map(item => ({
            label: item.stateName || item.name || item.label,
            value: item.stateID || item.id || item.value,
          }));
          setStateOptions(options);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
        setStateOptions([
          { label: 'Bihar', value: 'Bihar' },
          { label: 'Delhi', value: 'Delhi' },
          { label: 'Maharashtra', value: 'Maharashtra' },
          { label: 'Karnataka', value: 'Karnataka' },
          { label: 'Tamil Nadu', value: 'Tamil Nadu' },
          { label: 'Gujarat', value: 'Gujarat' },
          { label: 'Rajasthan', value: 'Rajasthan' },
          { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [callApi]);

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={stateOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='State'
        name='state'
        error={error}
        helperText={helperText}
        loading={loading}
        sx={sx}
      />
    </FormControl>
  );
};

export default GetState;
