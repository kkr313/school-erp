// src/components/Admission/FeesSection.jsx
import React, { memo, useMemo } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MonthlyFees from '../../financial/fees/MonthlyFees';
import OneTimeFees from '../../financial/fees/OneTimeFees';
import TransportFees from '../../financial/fees/TransportFees';
import { useTheme } from '../../../context/ThemeContext';

const FeesSection = memo(
  ({
    selectedClass,
    showMonthly,
    setShowMonthly,
    showOneTime,
    setShowOneTime,
    showTransport,
    setShowTransport,
    setMonthlyFeeData,
    setOneTimeFeeData,
    setTransportFeeData,
  }) => {
    const { theme, fontColor } = useTheme();

    const feeBoxStyle = useMemo(
      () => ({
        flex: '1',
        minWidth: '300px',
        border: `1px solid ${theme.borderColor}`,
        borderRadius: 2,
        p: 2,
        bgcolor: theme.paperBg,
      }),
      [theme.borderColor, theme.paperBg],
    );

    const accordionSx = useMemo(
      () => ({
        bgcolor: theme.paperBg,
        opacity: !selectedClass ? 0.6 : 1,
        border: `1px solid rgba(226, 232, 240, 0.8)`,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        '&:before': { display: 'none' },
        mb: 1,
      }),
      [theme.paperBg, selectedClass],
    );

    return (
      <Accordion disabled={!selectedClass} className='span-3' sx={accordionSx}>
        <AccordionSummary
          sx={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px 8px 0 0',
            minHeight: 48,
            '& .MuiAccordionSummary-content': {
              my: 0.5,
            },
          }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
            Assign Fees
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {!selectedClass ? (
            <Typography sx={{ color: fontColor.paper, fontStyle: 'italic' }}>
              Please select a class to assign fees.
            </Typography>
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                  gap: 2,
                  mb: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showMonthly}
                      onChange={e => setShowMonthly(e.target.checked)}
                      sx={{ color: fontColor.paper }}
                    />
                  }
                  label='Monthly Fees'
                  sx={{ color: fontColor.paper }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showOneTime}
                      onChange={e => setShowOneTime(e.target.checked)}
                      sx={{ color: fontColor.paper }}
                    />
                  }
                  label='One-Time Fees'
                  sx={{ color: fontColor.paper }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showTransport}
                      onChange={e => setShowTransport(e.target.checked)}
                      sx={{ color: fontColor.paper }}
                    />
                  }
                  label='Transport Fees'
                  sx={{ color: fontColor.paper }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                {showMonthly && (
                  <Box sx={feeBoxStyle}>
                    <Typography
                      variant='h6'
                      textAlign='center'
                      sx={{ color: fontColor.paper }}
                    >
                      Monthly Fees
                    </Typography>
                    <MonthlyFees
                      classId={selectedClass?.value}
                      onFeeChange={setMonthlyFeeData}
                    />
                  </Box>
                )}

                {showOneTime && (
                  <Box sx={feeBoxStyle}>
                    <Typography
                      variant='h6'
                      textAlign='center'
                      sx={{ color: fontColor.paper }}
                    >
                      One-Time Fees
                    </Typography>
                    <OneTimeFees
                      classId={selectedClass?.value}
                      onFeeChange={setOneTimeFeeData}
                    />
                  </Box>
                )}

                {showTransport && (
                  <Box sx={feeBoxStyle}>
                    <Typography
                      variant='h6'
                      textAlign='center'
                      sx={{ color: fontColor.paper }}
                    >
                      Transport Fees
                    </Typography>
                    <TransportFees
                      classId={selectedClass?.value}
                      onFeeChange={setTransportFeeData}
                    />
                  </Box>
                )}
              </Box>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    );
  },
);

FeesSection.displayName = 'FeesSection';

export default FeesSection;
