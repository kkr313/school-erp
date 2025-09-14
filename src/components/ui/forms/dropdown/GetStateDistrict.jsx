import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import GetState from './GetState';
import GetDistrict from './GetDistrict';

const GetStateDistrict = ({
  stateValue,
  onStateChange,
  districtValue,
  onDistrictChange,
  stateError,
  districtError,
  stateHelperText,
  districtHelperText,
  sx = {},
}) => {
  const [selectedState, setSelectedState] = useState(stateValue);

  useEffect(() => {
    setSelectedState(stateValue);
  }, [stateValue]);

  const handleStateChange = value => {
    setSelectedState(value);
    onStateChange(value);
    // Clear district when state changes
    if (onDistrictChange) {
      onDistrictChange(null);
    }
  };

  return (
    <Box sx={sx}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <GetState
            value={selectedState}
            onChange={handleStateChange}
            error={stateError}
            helperText={stateHelperText}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <GetDistrict
            value={districtValue}
            onChange={onDistrictChange}
            stateId={selectedState?.value}
            error={districtError}
            helperText={districtHelperText}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default GetStateDistrict;
