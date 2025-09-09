import React, { useState, useEffect, forwardRef } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpenseItems from "./Dropdown/ExpenseItems";
import EmployeeList from "./Dropdown/EmployeeList";
import { useTheme } from "../context/ThemeContext";
import { usePrompt } from "../hooks/usePrompt";
import { useBeforeUnload } from "../hooks/useBeforeUnload";
import { getBaseUrlBySchoolCode } from "../utils/schoolBaseUrls";
import FilledTextField from "../utils/FilledTextField";
import CustomBreadcrumb from "../utils/CustomBreadcrumb";

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Expense = () => {
  const { theme, fontColor } = useTheme();

  const [form, setForm] = useState({
    voucherNo: "",
    voucherDate: new Date().toISOString().split("T")[0],
    expenseName: null, // { itemId, itemName }
    amount: "",
    description: "",
    expenseBy: null, // { id, name }
  });

  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const isDirty = Object.values(form).some(
    (v) =>
      v !== "" && v !== null && v !== new Date().toISOString().split("T")[0]
  );
  usePrompt(
    "You have unsaved changes. Are you sure you want to leave this page?",
    isDirty
  );
  useBeforeUnload(isDirty);

  // Fetch expenses when voucherDate changes
  useEffect(() => {
    fetchExpenses();
  }, [form.voucherDate]);

  // Fetch expenses based on date
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const payload = {
        fromDate: form.voucherDate,
        toDate: form.voucherDate,
        itemGroupId: 0,
        itemId: 0,
        expensesBy: 0,
      };

      const schoolCode = localStorage.getItem("schoolCode"); // 👈 Get stored schoolCode
      const baseUrl = getBaseUrlBySchoolCode(schoolCode); // 👈 Get API base URL

      if (!baseUrl) {
        console.error("Invalid or missing school code");
        return;
      }

      const response = await fetch(`${baseUrl}/api/Expense/GetFilterExpenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to fetch expenses");

      const data = await response.json();
      setAllExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if voucher number already exists
  const checkVoucherExists = async (voucherNo) => {
    try {
      const payload = {
        fromDate: "2024-01-01",
        toDate: "2030-12-31",
        itemGroupId: 0,
        itemId: 0,
        expensesBy: 0,
      };

      const response = await fetch(`${baseUrl}/api/Expense/GetFilterExpenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to check voucher");

      const data = await response.json();
      return data.some((exp) => exp.voucherNo === voucherNo);
    } catch (error) {
      console.error("Error checking voucher:", error);
      return false;
    }
  };

  const handleChange = (field) => (e) => {
    const value = e?.target?.value ?? e;
    setForm({ ...form, [field]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.voucherNo) newErrors.voucherNo = "Voucher No. is required";
    if (!form.voucherDate) newErrors.voucherDate = "Voucher Date is required";
    if (!form.expenseName) newErrors.expenseName = "Expense name is required";
    if (!form.amount) newErrors.amount = "Amount is required";
    if (!form.expenseBy) newErrors.expenseBy = "Expense By is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setOpenDialog(true);
  };

  // Save expense to API
  const handleConfirm = async () => {
    try {
      // Check for duplicate voucher number
      const exists = await checkVoucherExists(form.voucherNo);
      if (exists) {
        setErrors({ voucherNo: "This Voucher No already exists." });
        setOpenDialog(false);
        return;
      }

      const payload = {
        voucherNo: form.voucherNo,
        voucherDate: form.voucherDate,
        itemId: form.expenseName?.itemId,
        descriptions: form.description,
        amount: parseFloat(form.amount),
        expensesBy: form.expenseBy?.id,
        createdBy: localStorage.getItem("username") || "System",
      };

      const response = await fetch(
        "https://teo-vivekanadbihar.co.in/api/Expense/AddExpenses",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to save expense");

      await fetchExpenses(); // Refresh table
      clearForm();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const clearForm = () => {
    setForm({
      voucherNo: "",
      voucherDate: new Date().toISOString().split("T")[0],
      expenseName: null,
      amount: "",
      description: "",
      expenseBy: null,
    });
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: fontColor.paper },
      "&:hover fieldset": { borderColor: fontColor.paper },
      "&.Mui-focused fieldset": { borderColor: fontColor.paper },
    },
    "& .MuiInputLabel-root": { color: fontColor.paper },
    "& .MuiFormHelperText-root": { color: fontColor.paper },
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        flexDirection: "column",
        px: { xs: 2, sm: 2 },
        py: { xs: 1, sm: 0 },
      }}
    >
      <CustomBreadcrumb
        title="Expense Management"
        showHome={true}
      />

      {/* Form Section */}
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          boxShadow: 6,
          background: `linear-gradient(135deg, ${theme.paperBg} 80%, #e3f2fd 100%)`,
          color: fontColor.paper,
          mt: -2,
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          mb={2}
          sx={{
            color: theme.formHeaderFontColor,
            fontFamily: theme.formHeaderFontFamily,
            fontWeight: 700,
            letterSpacing: 1,
            textShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <span role="img" aria-label="expense">💸</span> Expense Entry
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: { xs: 1, md: 2 },
            mb: 2,
          }}
        >
          <FilledTextField
            label="Voucher No."
            value={form.voucherNo}
            onChange={(e) =>
              /^[0-9]{0,6}$/.test(e.target.value) &&
              handleChange("voucherNo")(e)
            }
            fullWidth
            size="small"
            inputProps={{
              inputMode: "numeric",
              maxLength: 6,
            }}
            error={!!errors.voucherNo}
            helperText={errors.voucherNo}
            sx={{
              background: "#f5f5f5",
              borderRadius: 2,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          />
          <FilledTextField
            label="Voucher Date"
            type="date"
            value={form.voucherDate}
            onChange={handleChange("voucherDate")}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <Box component="span" sx={{ ml: 1 }}>
                  <span role="img" aria-label="calendar">📅</span>
                </Box>
              ),
            }}
            inputProps={{
              max: new Date().toISOString().split("T")[0],
            }}
            error={!!errors.voucherDate}
            helperText={errors.voucherDate}
            sx={{
              background: "#f5f5f5",
              borderRadius: 2,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          />
          <ExpenseItems
            value={form.expenseName}
            onChange={handleChange("expenseName")}
            error={!!errors.expenseName}
            helperText={errors.expenseName}
            size="small"
            sx={{
              background: "#f5f5f5",
              borderRadius: 2,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              width: "100%",
              minWidth: 0,
              height: '40px',
              '& .MuiInputBase-root': {
                height: '40px',
                minHeight: '40px',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
              },
              '& .MuiSelect-select': {
                height: '40px',
                minHeight: '40px',
                paddingTop: '10px',
                paddingBottom: '10px',
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
          <FilledTextField
            label="Expense Amount"
            type="text"
            value={form.amount}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,4}$/.test(value)) {
                handleChange("amount")(e);
              }
            }}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <Box component="span" sx={{ ml: 1 }}>
                  <span role="img" aria-label="currency">💰</span>
                </Box>
              ),
            }}
            error={!!errors.amount}
            helperText={errors.amount}
            sx={{
              background: "#f5f5f5",
              borderRadius: 2,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          />
          <FilledTextField
            label="Expense Description"
            value={form.description}
            onChange={handleChange("description")}
            fullWidth
            size="small"
            sx={{
              background: "#f5f5f5",
              borderRadius: 2,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          />
          <EmployeeList
            value={form.expenseBy}
            onChange={handleChange("expenseBy")}
            error={!!errors.expenseBy}
            helperText={errors.expenseBy}
            size="small"
            sx={{
              background: "#f5f5f5",
              borderRadius: 2,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              width: "100%",
              minWidth: 0,
              height: '40px',
              '& .MuiInputBase-root': {
                height: '40px',
                minHeight: '40px',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
              },
              '& .MuiSelect-select': {
                height: '40px',
                minHeight: '40px',
                paddingTop: '10px',
                paddingBottom: '10px',
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
          <Button
            variant="contained"
            size="medium"
            sx={{
              background: "linear-gradient(90deg,#1976d2 60%,#64b5f6 100%)",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              boxShadow: "0 2px 8px rgba(25,118,210,0.12)",
              textTransform: "uppercase",
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Paper>

      {/* Confirm Dialog with Theme */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            backgroundColor: theme.paperBg,
            color: fontColor.paper,
            fontFamily: theme.fontFamily,
            borderRadius: 3,
            boxShadow: 4,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", pb: 0 }}>
          Confirm Expense Entry
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            borderTop: `1px solid ${fontColor.paper}`,
            borderBottom: `1px solid ${fontColor.paper}`,
          }}
        >
          <Box sx={{ mt: 1 }}>
            <Typography>
              <strong>Voucher No:</strong> {form.voucherNo}
            </Typography>
            <Typography>
              <strong>Date:</strong> {form.voucherDate}
            </Typography>
            <Typography>
              <strong>Expense Name:</strong> {form.expenseName?.itemName || ""}
            </Typography>
            <Typography>
              <strong>Amount:</strong> ₹{form.amount}
            </Typography>
            <Typography>
              <strong>Description:</strong> {form.description || "N/A"}
            </Typography>
            <Typography>
              <strong>Expense By:</strong> {form.expenseBy?.name || ""}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: "purple" }}>
            CANCEL
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{ backgroundColor: "#1976d2" }}
          >
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expenses Table */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: theme.paperBg,
          color: fontColor.paper,
          mt: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Expenses on {form.voucherDate}
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : allExpenses.length === 0 ? (
          <Typography>No entries found for this date.</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  {[
                    "Voucher No",
                    "ExpenseItem",
                    "ExpenseBy",
                    "Description",
                    "VoucherDate",
                    "Amount",
                  ].map((col) => (
                    <TableCell
                      key={col}
                      align={col === "Amount" ? "right" : "left"}
                    >
                      <strong>{col}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allExpenses.map((exp, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {exp.voucherNo}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {exp.itemName}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {exp.expensesBy}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {exp.descriptions || "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {exp.voucherDate}
                    </TableCell>
                    <TableCell
                      sx={{
                        color:
                          theme.paperBg === "white" ||
                          theme.paperBg === "#ffffff"
                            ? "red"
                            : fontColor.paper,
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      ₹ {exp.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Expense;
