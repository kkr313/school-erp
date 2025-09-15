import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Snackbar,
  Alert,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useApi } from "../../../utils/useApi";
import { API_ENDPOINTS } from "../../../api/endpoints";
import GetFeeDetails from "../../ui/forms/dropdown/GetFeeDetails";
import { useTheme } from "../../../context/ThemeContext";
import FilledTextField from "../../../utils/FilledTextField";
import CustomBreadcrumb from "../../ui/navigation/CustomBreadcrumb";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import FeeReceiptPrintView from "./FeeReceiptPrintView";
import FeeReceiptTwoCopyPrintView from "./FeeReceiptTwoCopyPrintView";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

const CancelFeeCollection = () => {
  const [searchText, setSearchText] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMonthsData, setSelectedMonthsData] = useState([]);
  const [prevDues, setPrevDues] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState(null);
  const [receiptDate, setReceiptDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { callApi, loading, error } = useApi();
  const [successMsg, setSuccessMsg] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [printDialog, setPrintDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptHistory, setReceiptHistory] = useState([]);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [errors, setErrors] = useState({});
  const { theme, fontColor } = useTheme();
  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      const data = await callApi(API_ENDPOINTS.STUDENTS.GET_FILTER_STUDENTS, {
        trackingID: "string",
      });

      if (data) {
        setStudents(data);
        setFilteredStudents(data);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search text
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(
      (student) =>
        student.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
        student.admissionNo.toString().includes(searchText) ||
        student.fatherName.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredStudents(filtered);
  }, [searchText, students]);

  // Fetch receipt number when student is selected
  useEffect(() => {
    if (selectedStudent && !selectedReceipt) {
      fetchReceiptNumber();
      fetchReceiptHistory();
    }
  }, [selectedStudent]);
  const fetchReceiptNumber = async () => {
    try {
      const data = await callApi(API_ENDPOINTS.FEES.GET_BILLING_RECEIPT_NUMBER, {
        trackingID: "string",
        admissionId: selectedStudent.admissionId || selectedStudent.id,
      });

      if (data) {
        setReceiptNumber(data.receiptNumber || "AUTO-GENERATED");
      }
    } catch (err) {
      console.error("Failed to fetch receipt number:", err);
      setReceiptNumber("N/A");
    }
  };

  const fetchReceiptHistory = async () => {
    // Mock receipt history - replace with actual API call
    const mockHistory = [
      {
        receiptNo: "REC001",
        receiptDate: "2024-01-15",
        amount: 5000,
        status: "Paid"
      },
      {
        receiptNo: "REC002", 
        receiptDate: "2024-02-15",
        amount: 5500,
        status: "Paid"
      }
    ];
    setReceiptHistory(mockHistory);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setSelectedMonthsData([]);
    setPrevDues(null);
    setSelectedReceipt(null);
    setErrors({});
  };

  const handleReceiptSelect = (receipt) => {
    setSelectedReceipt(receipt);
    // Load receipt details for cancellation
  };

  const validateForm = () => {
    const newErrors = {};

    if (!receiptDate) {
      newErrors.receiptDate = "Receipt date is required";
    }

    if (!selectedReceipt && selectedMonthsData.length === 0) {
      newErrors.feeSelection = "Please select fees to cancel";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancelFee = () => {
    if (!validateForm()) return;
    setConfirmCancel(true);
  };

  const confirmCancelFee = async () => {
    try {
      const payload = {
        studentId: selectedStudent.admissionId || selectedStudent.id,
        receiptNumber: selectedReceipt?.receiptNo || receiptNumber,
        receiptDate,
        cancelledDues: selectedMonthsData.map((month) => ({
          monthId: month.id || month.monthId,
          monthName: month.value,
          fees: month.details.map((fee) => ({
            ledgerId: fee.ledgerId,
            headId: fee.headId,
            headName: fee.headName,
            amount: fee.amount,
            status: "Cancelled",
          })),
        })),
        reason: "Fee collection cancelled",
        cancelledBy: "Admin", // Get from auth context
      };      console.log("Cancel Payload:", payload);
      
      // Replace with actual API call
      // const result = await callApi(API_ENDPOINTS.FEES.CANCEL_FEE_COLLECTION, payload);
      
      setSuccessMsg(true);
      setPrintData(payload);
      setPrintDialog(true);
      setConfirmCancel(false);
      
      // Reset form
      setSelectedStudent(null);
      setSelectedMonthsData([]);
      setSelectedReceipt(null);
      
    } catch (err) {
      console.error("Failed to cancel fee collection:", err);
    }
  };

  const handlePrint = () => {
    setPrintDialog(false);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: fontColor.paper },
      "&:hover fieldset": { borderColor: fontColor.paper },
      "&.Mui-focused fieldset": { borderColor: fontColor.paper },
    },
    "& .MuiInputLabel-root": { color: fontColor.paper },
    "& .MuiFormHelperText-root": { color: fontColor.paper },
    input: { color: fontColor.paper },
  };

  return (
    <Box>
      <Box sx={{ pt: 0.5, px: 2 }} component="form" autoComplete="off">
        <CustomBreadcrumb
          title="Cancel Fee Collection"
          links={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Collection", href: "/collection" },
          ]}
        />

        <Paper
          elevation={3}
          sx={{
            p: 2,
            pt: 1,
            mb: 2,
            mt: -2,
            backgroundColor: theme.paperBg,
            color: fontColor.paper,
          }}
        >
          <Box sx={{ mt: 0 }}>
            <FilledTextField
              fullWidth
              label="Search by Name / Admission No / Father Name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: fontColor.paper }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {loading && <CircularProgress sx={{ mt: 2 }} />}

            {filteredStudents.length > 0 && searchText.trim() && (
              <Paper
                elevation={2}
                sx={{
                  maxHeight: 200,
                  overflow: "auto",
                  mt: 1,
                  backgroundColor: theme.paperBg,
                }}
              >
                <List>
                  {filteredStudents.slice(0, 10).map((student, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleStudentSelect(student)}
                      sx={{
                        borderBottom: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 500, color: fontColor.paper }}>
                            {student.studentName}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: fontColor.paper }}>
                            Admission: {student.admissionNo} | Father: {student.fatherName} | 
                            Class: {student.className}-{student.section}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Paper>

        {/* Show FeeDetails Component when student selected */}
        {selectedStudent && (
          <Paper
            elevation={4}
            sx={{ p: 2, py: 0, mt: 2, mb: 5, backgroundColor: theme.paperBg }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
                alignItems: "flex-start",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {/* Left: Student Details */}
              <Box
                sx={{
                  p: { xs: 1, sm: 2 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderBottom: { xs: "1px solid grey", sm: "none" },
                  pb: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 1, fontWeight: 600, color: fontColor.paper }}
                >
                  Student Details
                </Typography>

                <Box sx={{ textAlign: "center", width: "100%" }}>
                  <Typography sx={{ mb: 0.5, color: fontColor.paper }}>
                    <strong>Name:</strong> {selectedStudent.studentName}
                  </Typography>
                  <Typography sx={{ mb: 0.5, color: fontColor.paper }}>
                    <strong>Admission No:</strong> {selectedStudent.admissionNo}
                  </Typography>
                  <Typography sx={{ mb: 0.5, color: fontColor.paper }}>
                    <strong>Class:</strong> {selectedStudent.className}-{selectedStudent.section}
                  </Typography>
                  <Typography sx={{ mb: 0.5, color: fontColor.paper }}>
                    <strong>Father:</strong> {selectedStudent.fatherName}
                  </Typography>
                </Box>

                {/* Receipt History */}
                {receiptHistory.length > 0 && (
                  <Box sx={{ mt: 2, width: "100%" }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Recent Receipts
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Receipt No</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {receiptHistory.map((receipt, index) => (
                            <TableRow key={index}>
                              <TableCell>{receipt.receiptNo}</TableCell>
                              <TableCell>{receipt.receiptDate}</TableCell>
                              <TableCell align="right">₹{receipt.amount}</TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleReceiptSelect(receipt)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>

              {/* Right: Fee Collection */}
              <Box sx={{ p: { xs: 1, sm: 2 } }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: fontColor.paper }}
                >
                  Cancel Fee Collection
                </Typography>

                {/* Receipt No + Receipt Date */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                    mb: 2,
                    mt: 1.5,
                  }}
                >
                  <Typography>
                    Receipt No: <strong>{receiptNumber}</strong>
                  </Typography>
                  <TextField
                    label="Receipt Date"
                    type="date"
                    value={receiptDate}
                    disabled={!!selectedReceipt}
                    onChange={(e) => setReceiptDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    inputProps={{
                      max: new Date().toISOString().split("T")[0],
                    }}
                    sx={{ ...textFieldStyles }}
                    error={!!errors.receiptDate}
                    helperText={errors.receiptDate}
                  />
                </Box>

                {/* Fee Selection Component */}
                {!selectedReceipt && (
                  <GetFeeDetails
                    admissionId={
                      selectedStudent.admissionId || selectedStudent.id
                    }
                    onMonthsChange={setSelectedMonthsData}
                    onPrevDues={setPrevDues}
                  />
                )}

                {/* Selected Receipt Details */}
                {selectedReceipt && (
                  <Paper sx={{ p: 2, mb: 2, bgcolor: "#fff3cd" }}>
                    <Typography variant="subtitle2" color="warning.main">
                      Selected Receipt for Cancellation
                    </Typography>
                    <Typography>Receipt: {selectedReceipt.receiptNo}</Typography>
                    <Typography>Date: {selectedReceipt.receiptDate}</Typography>
                    <Typography>Amount: ₹{selectedReceipt.amount}</Typography>
                  </Paper>
                )}

                {/* Action Buttons */}
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleCancelFee}
                    disabled={(!selectedReceipt && selectedMonthsData.length === 0)}
                  >
                    Cancel Fee Collection
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedStudent(null);
                      setSelectedMonthsData([]);
                      setSelectedReceipt(null);
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMsg(false)} severity="success">
          Fee collection cancelled successfully!
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this fee collection?
          </Typography>
          {selectedReceipt && (
            <Typography color="error" sx={{ mt: 1 }}>
              Receipt {selectedReceipt.receiptNo} will be cancelled.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancel(false)}>Cancel</Button>
          <Button onClick={confirmCancelFee} variant="contained" color="error">
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={printDialog} onClose={() => setPrintDialog(false)}>
        <DialogTitle>Cancellation Receipt</DialogTitle>
        <DialogContent>
          <Typography>
            Fee collection has been cancelled successfully.
          </Typography>
          <Typography>
            Do you want to print the cancellation receipt?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrintDialog(false)} color="error">
            No
          </Button>
          <Button onClick={handlePrint} variant="contained" color="primary">
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Print Components */}
      {printData && (
        <>
          {theme.printCopyType === "Double Copy" ? (
            <FeeReceiptTwoCopyPrintView
              data={printData}
              fontColor={fontColor}
            />
          ) : (
            <FeeReceiptPrintView data={printData} fontColor={fontColor} />
          )}
        </>
      )}
    </Box>
  );
};

export default CancelFeeCollection;
