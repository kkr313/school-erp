import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Avatar,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { ArrowDropDown, Clear } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import State from '../ui/forms/dropdown/State';
import District from '../ui/forms/dropdown/District';
import FilledTextField from '../../utils/FilledTextField';
import FilledAutocomplete from '../../utils/FilledAutocomplete';
import { getBaseUrlBySchoolCode } from '../../utils/schoolBaseUrls';
import CustomBreadcrumb from '../ui/navigation/CustomBreadcrumb';

const countries = ['India'];

const SchoolMaster = () => {
  const { theme, fontColor } = useTheme();
  const [confirmSave, setConfirmSave] = useState(false);

  const [school, setSchool] = useState({
    name: '',
    slogan: '',
    address: '',
    country: 'India',
    state: '',
    district: '',
    city: '',
    mobile: '',
    phone: '',
    contactPerson: '',
    email: '',
    website: '',
    uDise: '',
    year: '',
    board: '',
    affiliatedBy: '',
    regNo: '',
    principal: '',
    logo: '',
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load from localStorage if exists
    const saved = JSON.parse(localStorage.getItem('schoolMaster'));
    if (saved) {
      setSchool(saved);
      if (saved.logo) setLogoPreview(saved.logo); // Logo only from localStorage
    }

    fetchSchoolDataFromAPI();
  }, []);

  const fetchSchoolDataFromAPI = async () => {
    try {
      const schoolCode = localStorage.getItem('schoolCode');
      const baseUrl = getBaseUrlBySchoolCode(schoolCode);

      if (!baseUrl) {
        console.error('Invalid or missing school code');
        return;
      }

      const response = await fetch(`${baseUrl}/api/Schools/GetSchoolDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // if API requires body params, add here
      });

      const data = await response.json();

      if (data?.name) {
        const mappedData = {
          name: data.name || '',
          slogan: data.slogan || '',
          address: data.address || '',
          country: data.country || 'India',
          state: data.state || '',
          district: data.district || '',
          city: data.city || '',
          mobile: data.mobileNo || '',
          phone: data.phoneNo || '',
          contactPerson: data.contactPerson || '',
          email: data.email || '',
          website: data.website || '',
          uDise: data.uDiseNo || '',
          year: data.yearEstablishment || '',
          board: data.boardUniversity || '',
          affiliatedBy: data.aff || '',
          regNo: data.regNo || '',
          principal: data.principal || '',
        };

        setSchool(prev => ({
          ...prev,
          ...mappedData,
          logo: prev.logo || '', // Preserve logo from localStorage only
        }));
      }
    } catch (err) {
      console.error('Failed to fetch school data', err);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!school.name) newErrors.name = 'School name is required';
    if (!school.slogan) newErrors.slogan = 'Slogan is required';
    if (!school.address) newErrors.address = 'Address is required';
    if (!school.state) newErrors.state = 'State is required';
    if (!school.district) newErrors.district = 'District is required';
    if (!school.mobile || school.mobile.length !== 10)
      newErrors.mobile = 'Enter valid 10-digit mobile number';
    if (!school.email || !/\S+@\S+\.\S+/.test(school.email))
      newErrors.email = 'Enter a valid email address';
    return newErrors;
  };

  const handleChange = (field, value) => {
    let updatedValue = value;

    switch (field) {
      case 'name':
        updatedValue = value.slice(0, 60);
        break;
      case 'slogan':
        updatedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
        break;
      case 'address':
        updatedValue = value.slice(0, 100);
        break;
      case 'mobile':
      case 'phone':
        updatedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        break;
      case 'contactPerson':
        updatedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 30);
        break;
      case 'email':
        updatedValue = value.slice(0, 100);
        break;
      case 'website':
        updatedValue = value.includes('.') ? value : value;
        break;
      case 'uDise':
        updatedValue = value.replace(/[^0-9]/g, '').slice(0, 20);
        break;
      case 'year':
        updatedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
        break;
      case 'board':
      case 'affiliatedBy':
        updatedValue = value.slice(0, 50);
        break;
      case 'regNo':
        updatedValue = value.slice(0, 30);
        break;
      case 'principal':
        updatedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 30);
        break;
      default:
        break;
    }

    setSchool(prev => ({ ...prev, [field]: updatedValue }));
  };

  const handleLogoUpload = e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSchool(prev => ({ ...prev, logo: reader.result }));
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Just open confirmation dialog (DON'T save yet)
    setConfirmSave(true);
  };

  const handleConfirmSave = () => {
    localStorage.setItem('schoolMaster', JSON.stringify(school));
    setConfirmSave(false);
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: fontColor.paper },
      '&:hover fieldset': { borderColor: fontColor.paper },
      '&.Mui-focused fieldset': { borderColor: fontColor.paper },
    },
    '& .MuiInputLabel-root': { color: fontColor.paper },
    '& .MuiFormHelperText-root': { color: fontColor.paper },
    input: { color: fontColor.paper },
    textarea: { color: fontColor.paper },
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: theme.bodyBg,
        minHeight: '100vh',
        px: { xs: 2, sm: 2 },
        py: { xs: 1, sm: 0 },
      }}
    >
      <CustomBreadcrumb
        title='School Master'
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
      />
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: '1000px' },
          mx: 'auto',
          backgroundColor: theme.paperBg,
          color: fontColor.paper,
          fontFamily: theme.fontFamily,
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          mt: -1,
        }}
      >
        <Typography
          variant='h4'
          align='center'
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.formHeaderFontColor,
            fontFamily: theme.formHeaderFontFamily,
          }}
        >
          School Master
        </Typography>

        <Box
          sx={{
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Button variant='outlined' component='label'>
            Upload Logo
            <input
              type='file'
              hidden
              accept='image/*'
              onChange={handleLogoUpload}
            />
          </Button>
          {logoPreview && (
            <Avatar
              src={logoPreview}
              variant='rounded'
              sx={{
                width: 100,
                height: 90,
                border: `2px solid ${fontColor.paper}`,
              }}
            />
          )}
        </Box>

        {/* Form fields here as before */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
          }}
        >
          <FilledTextField
            label='Name of School'
            value={school.name}
            onChange={e => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />

          <FilledTextField
            label='Slogan'
            value={school.slogan}
            onChange={e => handleChange('slogan', e.target.value)}
            error={!!errors.slogan}
            helperText={errors.slogan}
            fullWidth
            required
          />
          <FilledTextField
            label='Address of School'
            value={school.address}
            onChange={e => handleChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
            fullWidth
            required
            rows={3}
          />
          <FilledAutocomplete
            options={countries}
            value={school.country}
            onChange={(_, value) => handleChange('country', value)}
            label='Country'
            error={!!errors.country}
            helperText={errors.country}
            popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
            clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          />

          <FilledTextField
            label='City'
            value={school.city}
            onChange={e => handleChange('city', e.target.value)}
            fullWidth
          />
          <State
            value={school.state}
            onChange={value => handleChange('state', value)}
            error={!!errors.state}
            helperText={errors.state}
          />
          <District
            state={school.state}
            value={school.district}
            onChange={value => handleChange('district', value)}
            error={!!errors.district}
            helperText={errors.district}
          />
          <FilledTextField
            label='Mobile No.'
            value={school.mobile}
            onChange={e => handleChange('mobile', e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile}
            fullWidth
            required
          />
          <FilledTextField
            label='Phone No.'
            value={school.phone}
            onChange={e => handleChange('phone', e.target.value)}
            fullWidth
          />
          <FilledTextField
            label='Contact Person'
            value={school.contactPerson}
            onChange={e => handleChange('contactPerson', e.target.value)}
            fullWidth
          />
          <FilledTextField
            label='E-Mail ID'
            value={school.email}
            onChange={e => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            required
          />
          <FilledTextField
            label='School Website URL'
            value={school.website}
            onChange={e => handleChange('website', e.target.value)}
            fullWidth
          />
          <FilledTextField
            label='U-Dise No.'
            value={school.uDise}
            onChange={e => handleChange('uDise', e.target.value)}
            fullWidth
          />
          <FilledTextField
            label='Year of Establishment'
            value={school.year}
            onChange={e => handleChange('year', e.target.value)}
            fullWidth
          />
          <FilledTextField
            label='Board/University'
            value={school.board}
            onChange={e => handleChange('board', e.target.value)}
            fullWidth
          />
          <FilledTextField
            label='Affiliated By'
            value={school.affiliatedBy}
            onChange={e => handleChange('affiliatedBy', e.target.value)}
            fullWidth
          />
          <FilledTextField
            label='Registration No.'
            value={school.regNo}
            onChange={e => handleChange('regNo', e.target.value)}
            fullWidth
          />
          <FilledTextField
            label='Name of Principal'
            value={school.principal}
            onChange={e => handleChange('principal', e.target.value)}
            fullWidth
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button variant='contained' onClick={handleSave}>
            Save
          </Button>
        </Box>

        <Dialog
          open={confirmSave}
          onClose={() => setConfirmSave(false)}
          PaperProps={{
            sx: {
              backgroundColor: theme.paperBg,
              color: fontColor.paper,
            },
          }}
        >
          <DialogTitle>Do you want to save these details?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setConfirmSave(false)}>Cancel</Button>
            <Button onClick={handleConfirmSave} variant='contained'>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default SchoolMaster;
