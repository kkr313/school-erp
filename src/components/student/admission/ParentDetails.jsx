import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
} from '@mui/material';
import { useTheme } from '../../../context/ThemeContext';
import FilledTextField from '../../../utils/FilledTextField';

const ParentDetails = () => {
  const { theme, fontColor } = useTheme();
  const [useGuardianForID, setUseGuardianForID] = useState(false);

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

  return (
    <Box p={0} width='100%'>
      {/* Father Details */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          width: '100%',
          bgcolor: theme.paperBg,
          color: fontColor.paper,
          border: `1px solid ${fontColor.paper}`,
        }}
      >
        <Typography variant='h6' gutterBottom sx={{ color: fontColor.paper }}>
          Father Details
        </Typography>

        {/* Row 1 */}
        <Box display='flex' gap={2} mb={2}>
          <FilledTextField label='Occupation' fullWidth />
          <FilledTextField label='Office Address' fullWidth />
        </Box>

        {/* Row 2 */}
        <Box display='flex' gap={2} mb={2}>
          <TextField
            label='Mobile No'
            required
            fullWidth
            sx={textFieldStyles}
          />
          <TextField label='E-mail ID' fullWidth sx={textFieldStyles} />
        </Box>
      </Paper>

      {/* Mother Details */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          width: '100%',
          bgcolor: theme.paperBg,
          color: fontColor.paper,
          border: `1px solid ${fontColor.paper}`,
        }}
      >
        <Typography variant='h6' gutterBottom sx={{ color: fontColor.paper }}>
          Mother Details
        </Typography>

        {/* Row 1 */}
        <Box display='flex' gap={2} mb={2}>
          <TextField label='Occupation' fullWidth sx={textFieldStyles} />
          <TextField label='Office Address' fullWidth sx={textFieldStyles} />
        </Box>

        {/* Row 2 */}
        <Box display='flex' gap={2} mb={2}>
          <TextField
            label='Mobile No'
            required
            fullWidth
            sx={textFieldStyles}
          />
          <TextField label='E-mail ID' fullWidth sx={textFieldStyles} />
        </Box>
      </Paper>

      {/* Local Guardian Details */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          width: '100%',
          bgcolor: theme.paperBg,
          color: fontColor.paper,
          border: `1px solid ${fontColor.paper}`,
        }}
      >
        <Typography variant='h6' gutterBottom sx={{ color: fontColor.paper }}>
          Local Guardian Details
        </Typography>

        {/* Row 1 */}
        <Box display='flex' gap={2} mb={2}>
          <TextField label='Guardian Name' fullWidth sx={textFieldStyles} />
          <TextField label='Occupation' fullWidth sx={textFieldStyles} />
        </Box>

        {/* Address */}
        <Box mb={2}>
          <TextField label='Address' fullWidth sx={textFieldStyles} />
        </Box>

        {/* Row 2 */}
        <Box display='flex' gap={2} mb={2}>
          <TextField
            label='Mobile No'
            required
            fullWidth
            sx={textFieldStyles}
          />
          <TextField label='E-mail ID' fullWidth sx={textFieldStyles} />
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={useGuardianForID}
              onChange={e => setUseGuardianForID(e.target.checked)}
              sx={{ color: fontColor.paper }}
            />
          }
          label='Is use Guardian Details for ID Card'
          sx={{ color: fontColor.paper }}
        />
      </Paper>
    </Box>
  );
};

export default ParentDetails;
