import React, { useEffect, useState } from 'react';
import { FormControl } from '@mui/material';
import { Clear, ArrowDropDown } from '@mui/icons-material';
import FilledAutocomplete from '../../../../utils/FilledAutocomplete';
import { masterApi } from '../../../../api';

const Section = ({ value, onChange, error, helperText, classId, sx = {} }) => {
  const [sectionOptions, setSectionOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      if (!classId) {
        setSectionOptions([]);
        return;
      }

      setLoading(true);
      try {
        const data = await masterApi.getClassSections(classId);

        if (data && Array.isArray(data)) {
          const options = data.map(item => ({
            label: item.sectionName || item.name || item.label,
            value: item.sectionID || item.id || item.value,
          }));
          setSectionOptions(options);
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
        setSectionOptions([
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B' },
          { label: 'C', value: 'C' },
          { label: 'D', value: 'D' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [classId]);

  return (
    <FormControl fullWidth>
      <FilledAutocomplete
        options={sectionOptions}
        value={value}
        onChange={(e, v) => onChange(v)}
        getOptionLabel={option => option?.label || ''}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        popupIcon={<ArrowDropDown />}
        clearIcon={<Clear />}
        label='Section'
        name='section'
        error={error}
        helperText={helperText}
        loading={loading}
        disabled={!classId}
        sx={sx}
      />
    </FormControl>
  );
};

export default Section;
