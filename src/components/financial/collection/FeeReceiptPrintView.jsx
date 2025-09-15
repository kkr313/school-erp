import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import HeaderPDF from "../../ui/print/HeaderPDF";
import AmountInWords from "../../../utils/AmountInWords";

const FeeReceiptPrintView = ({ data, fontColor }) => {
  // Collect all paid months
  const paidMonths = useMemo(() => {
    if (!data?.dues) return "";
    return data.dues.map((m) => m.monthName).join(", ");
  }, [data]);

  // Group fee heads and sum amounts
  const feeSummary = useMemo(() => {
    const summary = {};
    if (data?.dues) {
      data.dues.forEach((month) => {
        month.fees.forEach((fee) => {
          if (!summary[fee.headName]) {
            summary[fee.headName] = 0;
          }
          summary[fee.headName] += Number(fee.amount);
        });
      });
    }
    return summary;
  }, [data]);

  return (
    <Box p={2} className="print-area">
      {/* Print-specific styles */}
      <style>
        {`
          @media screen {
            .print-area {
              display: none;
            }
          }
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .MuiDialog-root,
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
            @page {
              margin: 0;
            }
          }
        `}
      </style>

      {/* School Header */}
      <HeaderPDF />

      {/* Main Wrapper */}
      <Box
        mt={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Receipt Header */}
        <Box textAlign="center" sx={{ width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Fee Receipt
          </Typography>
        </Box>

        {/* Student & Receipt Details */}
        <Box
          p={1}
          component={Paper}
          elevation={2}
          sx={{
            width: "80%",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            columnGap: 4,
            rowGap: 1.5,
            color: fontColor?.paper || "#000",
          }}
        >
          <Typography>
            <b>Receipt No :</b> {data?.receiptNumber}
          </Typography>
          <Typography>
            <b>Receipt Date :</b> {data?.receiptDate}
          </Typography>
          <Typography>
            <b>AdmNo / Roll :</b> {data?.student?.admissionNo} /{" "}
            {data?.student?.rollNo}
          </Typography>
          <Typography>
            <b>Class / Section :</b> {data?.student?.className} -{" "}
            {data?.student?.section}
          </Typography>
          <Typography>
            <b>Name :</b> {data?.student?.studentName}
          </Typography>
          <Typography>
            <b>Father's Name :</b> {data?.student?.fatherName}
          </Typography>
          <Typography sx={{ gridColumn: "span 2" }}>
            <b>Paid Months :</b> {paidMonths}
          </Typography>
        </Box>

        {/* Fee Details Table */}
        <Box p={1} component={Paper} elevation={2} sx={{ width: "80%" }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Fee Head</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Fee Heads */}
                {Object.entries(feeSummary).map(([head, amount], idx) => (
                  <TableRow key={idx}>
                    <TableCell>{head}</TableCell>
                    <TableCell align="right">{amount}</TableCell>
                  </TableRow>
                ))}

                {/* Previous Dues */}
                {data?.prevDues?.dueAmount > 0 && (
                  <TableRow>
                    <TableCell>
                      Previous Dues
                    </TableCell>
                    <TableCell align="right">{data.prevDues.dueAmount}</TableCell>
                  </TableRow>
                )}

                {/* Fine */}
                {data?.fine > 0 && (
                  <TableRow>
                    <TableCell>Fine</TableCell>
                    <TableCell align="right">{data.fine}</TableCell>
                  </TableRow>
                )}

                {/* Concession */}
                {data?.concession > 0 && (
                  <TableRow>
                    <TableCell>Concession</TableCell>
                    <TableCell align="right">-{data.concession}</TableCell>
                  </TableRow>
                )}

                {/* Total */}
                <TableRow sx={{ backgroundColor: "#f0f8ff" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Total Paid</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ₹{data?.paidAmount || 0}
                  </TableCell>
                </TableRow>

                {/* Dues */}
                {data?.duesAmount > 0 && (
                  <TableRow sx={{ backgroundColor: "#fff5f5" }}>
                    <TableCell sx={{ fontWeight: 600, color: "red" }}>
                      Remaining Dues
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, color: "red" }}
                    >
                      ₹{data.duesAmount}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Amount in Words */}
        <Box p={1} component={Paper} elevation={2} sx={{ width: "80%" }}>
          <AmountInWords amount={data?.paidAmount} />
        </Box>
      </Box>
    </Box>
  );
};

export default FeeReceiptPrintView;
