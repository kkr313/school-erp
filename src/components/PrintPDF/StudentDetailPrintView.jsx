import React, { forwardRef } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const StudentDetailPrintView = forwardRef(({ data }, ref) => {
  return (
    <Box ref={ref} p={2}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Student Detail Report</h2>
      <Table size="small" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <TableHead>
          <TableRow>
            {['Sl.', 'Class', 'Sec', 'Roll', 'AdmNo', 'StudentName', 'FatherName', 'DOA', 'Gender', 'DOB', 'Address'].map((head, index) => (
              <TableCell
                key={index}
                style={{ border: '1px solid #ccc', fontWeight: 'bold', fontSize: '12px' }}
              >
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} align="center">
                No records found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((student, index) => (
              <TableRow key={student.id || index}>
                <TableCell style={{ border: '1px solid #ccc', fontSize: '12px' }}>{index + 1}</TableCell>
                <TableCell style={{ border: '1px solid #ccc', fontSize: '12px' }}>{student.className}</TableCell>
                <TableCell style={{ border: '1px solid #ccc', fontSize: '12px' }}>{student.section || '-'}</TableCell>
                <TableCell style={{ border: '1px solid #ccc', fontSize: '12px' }}>{student.rollNo || '-'}</TableCell>
                <TableCell style={{ border: '1px solid #ccc', fontSize: '12px' }}>{student.admissionNo}</TableCell>
                <TableCell style={{ border: '1px solid #ccc', fontSize: '12px' }}>{student.studentName}</TableCell>
                <TableCell style={{ border: '1px solid #ccc', fontSize: '12px' }}>{student.fatherName}</TableCell>
                <TableCell style={{ border: '1px solid #ccc', fontSize: '12px' }}>{student.doa}</TableCell>
                <TableCell style={{ border: '1px solid #ccc', fontSize: '12px' }}>{student.gender}</TableCell>
                <TableCell style={{ border: '1px solid #ccc', fontSize: '12px' }}>{student.dob}</TableCell>
                <TableCell style={{ border: '1px solid #ccc', fontSize: '12px' }}>{student.address}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
});


export default StudentDetailPrintView;
