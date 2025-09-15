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
  Divider,
} from "@mui/material";
import HeaderPDF from "../../ui/print/HeaderPDF";
import AmountInWords from "../../../utils/AmountInWords";

const FeeReceiptTwoCopyPrintView = ({ data, fontColor }) => {
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

  const renderCopy = (title) => (
    <Box mb={2} className="copy-container">
      {/* Header */}
      <HeaderPDF overrideStyle={{ printHeaderStyle: "style2" }} />

      {/* Copy Title */}
      <Box textAlign="center" mt={-1} mb={0.5}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>

      {/* Two-column layout: Student Details + Fee Table */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          width: "100%",
        }}
      >
        {/* Student & Receipt Details */}
        <Box
          p={1}
          component={Paper}
          elevation={2}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
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
        <Box p={1} component={Paper} elevation={2} sx={{ flex: 1 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600, py: 0.5 }}>
                    Fee Head
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 0.5 }}>
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Fee Heads */}
                {Object.entries(feeSummary).map(([head, amount], idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ py: 0.3 }}>{head}</TableCell>
                    <TableCell align="right" sx={{ py: 0.3 }}>
                      {amount}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Previous Dues */}
                {data?.prevDues?.dueAmount > 0 && (
                  <TableRow>
                    <TableCell sx={{ py: 0.3 }}>Previous Dues</TableCell>
                    <TableCell align="right" sx={{ py: 0.3 }}>
                      {data.prevDues.dueAmount}
                    </TableCell>
                  </TableRow>
                )}

                {/* Fine */}
                {data?.fine > 0 && (
                  <TableRow>
                    <TableCell sx={{ py: 0.3 }}>Fine</TableCell>
                    <TableCell align="right" sx={{ py: 0.3 }}>
                      {data.fine}
                    </TableCell>
                  </TableRow>
                )}

                {/* Concession */}
                {data?.concession > 0 && (
                  <TableRow>
                    <TableCell sx={{ py: 0.3 }}>Concession</TableCell>
                    <TableCell align="right" sx={{ py: 0.3 }}>
                      -{data.concession}
                    </TableCell>
                  </TableRow>
                )}

                {/* Total */}
                <TableRow sx={{ backgroundColor: "#f0f8ff" }}>
                  <TableCell sx={{ fontWeight: 600, py: 0.4 }}>
                    Total Paid
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, py: 0.4 }}
                  >
                    ₹{data?.paidAmount || 0}
                  </TableCell>
                </TableRow>

                {/* Dues */}
                {data?.duesAmount > 0 && (
                  <TableRow sx={{ backgroundColor: "#fff5f5" }}>
                    <TableCell
                      sx={{ fontWeight: 600, color: "red", py: 0.4 }}
                    >
                      Remaining Dues
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, color: "red", py: 0.4 }}
                    >
                      ₹{data.duesAmount}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Amount in Words and Signatures */}
      <Box mt={1.5}>
        <AmountInWords amount={data?.paidAmount} />
      </Box>

      {/* Signature Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 3,
          px: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            textDecoration: "overline",
            minWidth: 150,
            textAlign: "center",
          }}
        >
          {title === "School Copy"
            ? "Receiver's Signature"
            : "Principal's Signature"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box p={3} className="print-area">
      {/* Print-specific styles */}
      <style>
        {`
          @media screen {
            .print-area {
              display: none;
            }
          }
          @media print {
            @page {
              size: A4;
              margin: 10mm;
            }
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
                padding: 0;
                box-sizing: border-box;

                /* Replace zoom with transform */
                transform: scale(1);
                transform-origin: top center;
            }

            .print-area .copy-container {
              page-break-inside: avoid;
              margin-bottom: auto;
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
          }
        `}
      </style>

      {/* School Copy */}
      {renderCopy("School Copy")}

      <Divider sx={{ borderStyle: "dashed", my: 2 }} />

      {/* Parent Copy */}
      {renderCopy("Parent Copy")}
    </Box>
  );
};

export default FeeReceiptTwoCopyPrintView;
