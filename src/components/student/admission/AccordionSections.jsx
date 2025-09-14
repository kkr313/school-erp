// src/components/Admission/AccordionSections.jsx
import React, { useMemo } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AdditionalDetails from './AdditionalDetails';
import ParentDetails from './ParentDetails';
import { useTheme } from '../../../context/ThemeContext';

const AccordionSections = React.memo(({ formData, setFormData }) => {
  const { theme } = useTheme();

  // Memoize accordion styles to prevent unnecessary recalculations
  const accordionStyle = useMemo(
    () => ({
      bgcolor: theme.paperBg,
      border: `1px solid rgba(226, 232, 240, 0.8)`,
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      '&:before': { display: 'none' },
      mb: 1,
    }),
    [theme.paperBg],
  );

  const accordionSummaryStyle = useMemo(
    () => ({
      backgroundColor: '#f8fafc',
      borderRadius: '8px 8px 0 0',
      minHeight: 48,
      '& .MuiAccordionSummary-content': {
        my: 0.5,
      },
    }),
    [],
  );

  const typographyStyle = useMemo(
    () => ({
      fontSize: '0.95rem',
      fontWeight: 500,
    }),
    [],
  );

  return (
    <>
      {/* Additional Details Accordion */}
      <Accordion className='span-3' sx={accordionStyle}>
        <AccordionSummary
          sx={accordionSummaryStyle}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography sx={typographyStyle}>Additional Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AdditionalDetails formData={formData} setFormData={setFormData} />
        </AccordionDetails>
      </Accordion>

      {/* Parent Details Accordion */}
      <Accordion className='span-3' sx={accordionStyle}>
        <AccordionSummary
          sx={accordionSummaryStyle}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography sx={typographyStyle}>Parent Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ParentDetails formData={formData} setFormData={setFormData} />
        </AccordionDetails>
      </Accordion>
    </>
  );
});

AccordionSections.displayName = 'AccordionSections';

export default AccordionSections;
