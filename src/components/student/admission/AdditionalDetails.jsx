import React, { useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useTheme } from '../../../context/ThemeContext';
import FilledTextField from '../../../utils/FilledTextField';

const AdditionalDetails = ({ formData, setFormData }) => {
  const { theme, fontColor } = useTheme();

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: fontColor.paper },
      '&:hover fieldset': { borderColor: fontColor.paper },
      '&.Mui-focused fieldset': { borderColor: fontColor.paper },
    },
    '& .MuiInputLabel-root': { color: fontColor.paper },
    '& .MuiFormHelperText-root': { color: fontColor.paper },
    input: { color: fontColor.paper },
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let valid = true;

    switch (name) {
      case 'motherName':
        valid = /^[A-Za-z\s]{0,30}$/.test(value);
        break;
      case 'aadharNo':
        valid = /^\d{0,12}$/.test(value);
        break;
      case 'city':
        valid = /^[A-Za-z\s]{0,20}$/.test(value);
        break;
      case 'pin':
        valid = /^\d{0,6}$/.test(value);
        break;
      case 'phone':
        valid = /^\d{0,10}$/.test(value);
        break;
      case 'email':
        valid = value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'caste':
        valid = /^[A-Za-z\s]{0,20}$/.test(value);
        break;
      case 'weight':
      case 'height':
        valid = /^\d{0,3}$/.test(value);
        break;
      default:
        break;
    }

    if (valid) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setFormData(prev => ({
        ...prev,
        bmi,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        bmi: '',
      }));
    }
  }, [formData.weight, formData.height]);

  return (
    <Box
      sx={{
        width: '100%',
        p: 2,
        mt: 2,
        border: `1px solid ${fontColor.paper}`,
        borderRadius: '8px',
        boxShadow: 1,
        bgcolor: theme.paperBg,
        color: fontColor.paper,
      }}
    >
      <Typography variant='h6' gutterBottom sx={{ color: fontColor.paper }}>
        Additional Details
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        <FilledTextField
          label='Mother Name'
          name='motherName'
          value={formData.motherName || ''}
          onChange={handleChange}
          fullWidth
          error={
            formData.motherName &&
            !/^[A-Za-z\s]{1,30}$/.test(formData.motherName)
          }
          helperText={
            formData.motherName &&
            !/^[A-Za-z\s]{1,30}$/.test(formData.motherName)
              ? 'Alphabets only, max 30 characters'
              : ''
          }
        />

        <FilledTextField
          label='Aadhar No.'
          name='aadharNo'
          value={formData.aadharNo || ''}
          onChange={handleChange}
          fullWidth
          error={formData.aadharNo && !/^\d{12}$/.test(formData.aadharNo)}
          helperText={
            formData.aadharNo && !/^\d{12}$/.test(formData.aadharNo)
              ? 'Enter exactly 12 digits'
              : ''
          }
        />

        <FilledTextField
          label='City'
          name='city'
          value={formData.city || ''}
          onChange={handleChange}
          fullWidth
          error={formData.city && !/^[A-Za-z\s]{1,20}$/.test(formData.city)}
          helperText={
            formData.city && !/^[A-Za-z\s]{1,20}$/.test(formData.city)
              ? 'Alphabets only, max 20 characters'
              : ''
          }
        />

        <FilledTextField
          label='PIN'
          name='pin'
          value={formData.pin || ''}
          onChange={handleChange}
          fullWidth
          error={formData.pin && !/^\d{6}$/.test(formData.pin)}
          helperText={
            formData.pin && !/^\d{6}$/.test(formData.pin)
              ? 'Enter exactly 6 digits'
              : ''
          }
        />

        <FilledTextField
          label='Phone No.'
          name='phone'
          value={formData.phone || ''}
          onChange={handleChange}
          fullWidth
          error={formData.phone && !/^\d{10}$/.test(formData.phone)}
          helperText={
            formData.phone && !/^\d{10}$/.test(formData.phone)
              ? 'Enter a 10-digit number'
              : ''
          }
        />

        <FilledTextField
          label='Email'
          name='email'
          type='email'
          value={formData.email || ''}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              email: e.target.value,
            }))
          }
          fullWidth
          error={
            formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
          }
          helperText={
            formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
              ? 'Must contain @ and .'
              : ''
          }
        />

        <FilledTextField
          label='Caste'
          name='caste'
          value={formData.caste || ''}
          onChange={handleChange}
          fullWidth
          error={formData.caste && !/^[A-Za-z\s]{1,20}$/.test(formData.caste)}
          helperText={
            formData.caste && !/^[A-Za-z\s]{1,20}$/.test(formData.caste)
              ? 'Alphabets only, max 20 characters'
              : ''
          }
        />

        <FilledTextField
          label='Previous School'
          name='previousSchool'
          value={formData.previousSchool || ''}
          onChange={handleChange}
          fullWidth
        />

        <FilledTextField
          label='Weight (kg)'
          name='weight'
          value={formData.weight || ''}
          onChange={handleChange}
          fullWidth
          helperText=''
        />

        <FilledTextField
          label='Height (cm)'
          name='height'
          value={formData.height || ''}
          onChange={handleChange}
          fullWidth
          helperText=''
        />

        <FilledTextField
          label='BMI'
          name='bmi'
          value={formData.bmi || ''}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default AdditionalDetails;
