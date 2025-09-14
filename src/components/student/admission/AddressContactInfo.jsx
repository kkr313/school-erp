// src/components/Admission/AddressContactInfo.jsx
import React, { memo, useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import FilledTextField from '../../../utils/FilledTextField';
import GetState from '../../ui/forms/dropdown/GetState';
import GetDistrict from '../../ui/forms/dropdown/GetDistrict';

const AddressContactInfo = memo(
  ({
    address,
    setAddress,
    mobileNo,
    setMobileNo,
    selectedState,
    setSelectedState,
    district,
    setDistrict,
    nationality,
    setNationality,
  }) => {
    const handleAddressChange = useCallback(
      e => {
        const value = e.target.value;
        if (value.length <= 100) setAddress(value);
      },
      [setAddress],
    );

    const handleMobileChange = useCallback(
      e => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) setMobileNo(value);
      },
      [setMobileNo],
    );

    const addressHelperText = useMemo(
      () => `${address.length}/100`,
      [address.length],
    );

    const mobileError = useMemo(() => {
      return mobileNo !== '' && !/^\d{10}$/.test(mobileNo);
    }, [mobileNo]);

    return (
      <>
        {/* Address & Contact Section */}
        <Box
          className='span-3'
          sx={{
            borderTop: '1px solid #e2e8f0',
            pt: 1.5,
            mt: 1.5,
            mb: 0.5,
            position: 'relative',
          }}
        >
          <Typography
            variant='body2'
            sx={{
              position: 'absolute',
              top: -10,
              left: 12,
              bgcolor: 'white',
              px: 1,
              color: '#64748b',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            Address & Contact
          </Typography>
        </Box>

        <FilledTextField
          className='span-2'
          label='Address'
          name='address'
          value={address}
          onChange={handleAddressChange}
          helperText={addressHelperText}
          fullWidth
          required
        />
        <FilledTextField
          label='Mobile No.'
          name='mobileNo'
          value={mobileNo}
          onChange={handleMobileChange}
          error={mobileError}
          helperText={mobileError ? 'Enter a 10-digit mobile number' : ''}
          fullWidth
          required
        />
        <GetState value={selectedState} onChange={setSelectedState} />
        <GetDistrict
          stateValue={selectedState}
          value={district}
          onChange={setDistrict}
        />
        <FilledTextField
          label='Nationality'
          name='nationality'
          value={nationality}
          onChange={e => setNationality(e.target.value)}
          fullWidth
          required
        />
      </>
    );
  },
);

AddressContactInfo.displayName = 'AddressContactInfo';

export default AddressContactInfo;
