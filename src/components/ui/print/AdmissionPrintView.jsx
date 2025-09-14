// components/AdmissionPrintView.jsx
import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import HeaderPDF from './HeaderPDF';

const AdmissionPrintView = ({ data, fontColor }) => {
  const filteredData = Object.entries(data).filter(
    ([label]) =>
      !['Monthly Fees', 'One-Time Fees', 'Transport Fees'].includes(label),
  );

  return (
    <Box p={2} className='print-area'>
      {/* Print-only style */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .MuiDialogActions-root,
            .MuiDialogTitle-root,
            button {
              display: none !important;
            }
            .MuiDialog-paper {
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        `}
      </style>
      <style>
        {`
    @media print {
      @page {
        margin: 0; /* Remove all default print margins */
      }

      html, body {
        padding: 0 !important;
        margin: 0 !important;
      }

      body * {
        visibility: hidden;
      }

      .print-area, .print-area * {
        visibility: visible;
      }

      .MuiDialogActions-root,
      .MuiDialogTitle-root,
      button {
        display: none !important;
      }

      .MuiDialog-paper {
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
    }
  `}
      </style>

      <HeaderPDF />

      {/* Student Details in Two Columns */}
      <Box
        mt={2}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          columnGap: 4,
          rowGap: 1.5,
          color: fontColor?.paper || '#000',
        }}
      >
        {filteredData.map(([label, value]) => (
          <Box key={label} sx={{ display: 'flex' }}>
            <Typography sx={{ fontWeight: 600, minWidth: 140 }}>
              {label}:
            </Typography>
            <Typography>{value || '-'}</Typography>
          </Box>
        ))}
      </Box>

      {/* Guardian Signature */}
      <Box mt={5} display='flex' justifyContent='flex-end' pr={4}>
        <Box textAlign='center'>
          <Typography>__________________________</Typography>
          <Typography>Guardian Signature</Typography>
        </Box>
      </Box>

      {/* Scissor cut line */}
      <Box mt={4} mb={2} position='relative'>
        <Divider
          sx={{
            borderStyle: 'dashed',
            borderColor: fontColor?.paper || '#000',
          }}
        />
        <Typography
          sx={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            px: 1,
            fontSize: 20,
          }}
        >
          ✂️
        </Typography>
      </Box>

      {/* Acknowledgement Slip */}
      <Box mt={3}>
        <Typography
          variant='h6'
          textAlign='center'
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Admission Acknowledgement
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            columnGap: 4,
            rowGap: 1.5,
            mt: 2,
            color: fontColor?.paper || '#000',
          }}
        >
          {[
            ['Admission No', data['Admission No']],
            ['Student Name', data['Student Name']],
            ["Father's Name", data["Father's Name"]],
            ['Class', data['Class']],
            ['DOA', data['DOA']],
            ['Section', data['Section']],
            ['Roll No', data['Roll No']],
            ['Gender', data['Gender']],
          ].map(([label, value]) => (
            <Box key={label} sx={{ display: 'flex' }}>
              <Typography sx={{ fontWeight: 600, minWidth: 140 }}>
                {label}:
              </Typography>
              <Typography>{value || '-'}</Typography>
            </Box>
          ))}
        </Box>

        {/* Principal Signature */}
        <Box mt={4} display='flex' justifyContent='flex-end' pr={4}>
          <Box textAlign='center'>
            <Typography>__________________________</Typography>
            <Typography>Principal Signature</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdmissionPrintView;
