import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Autocomplete,
  TablePagination,
} from "@mui/material";
import ExpenseItems from "../Dropdown/ExpenseItems";
import EmployeeList from "../Dropdown/EmployeeList";
import { useTheme } from "../../context/ThemeContext";
import { ArrowDropDown, Clear, Print } from "@mui/icons-material";
import { getBaseUrlBySchoolCode } from "../../utils/schoolBaseUrls";
import FilledTextField from "../../utils/FilledTextField";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import CustomBreadcrumb from "../../utils/CustomBreadcrumb";

const ExpenseReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState({
    groupId: 0,
    groupName: "Select All",
  });
  const [expenseItem, setExpenseItem] = useState({
    itemId: 0,
    itemName: "Select All",
  });
  const [expenseBy, setExpenseBy] = useState({ id: 0, name: "Select All" });
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({
    group: "",
    expenseItem: "",
    expenseBy: "",
  });

  const { theme, fontColor } = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const schoolCode = localStorage.getItem("schoolCode");
  const baseUrl = getBaseUrlBySchoolCode(schoolCode);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/Expense/GetItemExpenseList`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch groups");
        const data = await response.json();

        const groups = Array.from(
          new Map(
            data.map((item) => [
              item.groupId || item.itemGroupId || item.groupName,
              {
                groupId: item.groupId || item.itemGroupId || 0,
                groupName: item.groupName || "Unknown",
              },
            ])
          ).values()
        );

        const selectAll = { groupId: 0, groupName: "Select All" };
        setGroupOptions([selectAll, ...groups]);
        setSelectedGroup(selectAll);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };
    fetchGroups();
  }, [baseUrl]);

  const fetchExpenses = async () => {
    let hasError = false;
    const errors = { group: "", expenseItem: "", expenseBy: "" };

    // Validate dropdowns
    if (!selectedGroup || !selectedGroup.groupName) {
      errors.group = "Please select a group name.";
      hasError = true;
    }
    if (!expenseItem || !expenseItem.itemName) {
      errors.expenseItem = "Please select an expense item.";
      hasError = true;
    }
    if (!expenseBy || !expenseBy.name) {
      errors.expenseBy = "Please select an employee (expense by).";
      hasError = true;
    }

    setValidationErrors(errors);

    if (hasError) return;

    // Validate dates
    if (!fromDate || !toDate) {
      setError("Please select both From and To dates.");
      return;
    }
    if (new Date(toDate) < new Date(fromDate)) {
      setError("To Date cannot be earlier than From Date.");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    if (toDate > today || fromDate > today) {
      setError("Dates cannot be in the future.");
      return;
    }

    setError("");
    setHasSearched(true);

    const payload = {
      fromDate,
      toDate,
      itemGroupId: selectedGroup?.groupId || 0,
      itemId: expenseItem?.itemId || 0,
      expensesBy: expenseBy?.id || 0,
    };

    setLoading(true);
    setExpenses([]);
    try {
      const response = await fetch(`${baseUrl}/api/Expense/GetFilterExpenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setExpenses(data);
      setPage(0);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to fetch expense report.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7); // ✅ 7 days before

    const formattedToday = today.toISOString().split("T")[0];
    const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split("T")[0];

    setFromDate(formattedSevenDaysAgo);
    setToDate(formattedToday);
    const defaultGroup = groupOptions.find((g) => g.groupId === 0) || {
      groupId: 0,
      groupName: "Select All",
    };
    setSelectedGroup(defaultGroup);
    setExpenseItem({ itemId: 0, itemName: "Select All" });
    setExpenseBy({ id: 0, name: "Select All" });
    setExpenses([]);
    setHasSearched(false);
    setValidationErrors({ group: "", expenseItem: "", expenseBy: "" });
  };

  const handlePrint = () => {
    if (!expenses.length) return;
    const tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Voucher No</th>
            <th>Voucher Date</th>
            <th>Expense Group</th>
            <th>Item</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Expense By</th>
          </tr>
        </thead>
        <tbody>
          ${expenses
            .map(
              (exp) => `
            <tr>
              <td>${exp.voucherNo}</td>
              <td>${exp.voucherDate}</td>
              <td>${exp.groupName || "N/A"}</td>
              <td>${exp.itemName || "N/A"}</td>
              <td>${exp.descriptions || "N/A"}</td>
              <td>₹ ${exp.amount}</td>
              <td>${exp.expensesBy || "N/A"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
    const win = window.open("", "", "height=700,width=900");
    win.document.write(`
      <html>
        <head>
          <title>Expense Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; font-size: 13px; text-align: left; }
            @media print { .MuiTablePagination-root { display: none; } }
          </style>
        </head>
        <body>
          <h2>Expense Report</h2>
          ${tableHTML}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7); // ✅ 7 days before

    const formattedToday = today.toISOString().split("T")[0];
    const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split("T")[0];

    setFromDate(formattedSevenDaysAgo); // ✅ Default: 7 days ago
    setToDate(formattedToday); // ✅ Default: Today
  }, []);

  const paginatedExpenses = expenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (!baseUrl) {
    return (
      <Box sx={{ minHeight: "100vh", p: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          Invalid or missing school code. Please check your configuration.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${theme.bodyBg} 0%, ${theme.paperBg} 100%)`,
      px: { xs: 2, sm: 3 }, 
      py: { xs: 1, sm: 2 } 
    }}>
      <CustomBreadcrumb
        title="Expense Analytics"
        links={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Expense", href: "/expense" },
        ]}
      />

      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
          p: 4,
          borderRadius: 3,
          mb: 3,
          mt: 1,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            📊 Expense Reports & Analytics
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
            Generate detailed expense reports with advanced filtering options
          </Typography>
          {expenses.length > 0 && (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ 
                bgcolor: "rgba(255,255,255,0.2)", 
                px: 2, 
                py: 1, 
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}>
                <Typography variant="body2">
                  Total Records: {expenses.length}
                </Typography>
              </Box>
              <Box sx={{ 
                bgcolor: "rgba(255,255,255,0.2)", 
                px: 2, 
                py: 1, 
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}>
                <Typography variant="body2">
                  Total Amount: ₹{expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Box 
          sx={{ 
            position: "absolute", 
            top: -50, 
            right: -50, 
            width: 200, 
            height: 200, 
            borderRadius: "50%", 
            background: "rgba(255,255,255,0.1)" 
          }} 
        />
      </Paper>

      {/* Filters Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 3, 
          backgroundColor: theme.paperBg, 
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider"
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: fontColor.paper, display: "flex", alignItems: "center", gap: 1 }}>
          🔍 Filter Options
        </Typography>

        {/* Date Range Section */}
        <Box sx={{ 
          p: 3, 
          mb: 3,
          border: "2px dashed", 
          borderColor: "primary.main", 
          borderRadius: 2,
          bgcolor: "primary.50"
        }}>
          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 600, mb: 2 }}>
            📅 Date Range
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns={{ md: "1fr 1fr", xs: "1fr" }}
            gap={2}
          >
            <FilledTextField
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: new Date().toISOString().split("T")[0] }}
              fullWidth
            />
            <FilledTextField
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: fromDate,
                max: new Date().toISOString().split("T")[0],
              }}
              fullWidth
            />
            <FilledAutocomplete
              value={selectedGroup}
              onChange={(e, newValue) => setSelectedGroup(newValue)}
              options={groupOptions}
              getOptionLabel={(option) => option?.groupName || ""}
              isOptionEqualToValue={(o, v) => o.groupId === v.groupId}
              label="Group Name"
              error={!!validationErrors.group}
              helperText={validationErrors.group}
              fullWidth
              popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
              clearIcon={<Clear sx={{ color: fontColor.paper }} />}
            />
            <ExpenseItems
              value={expenseItem}
              onChange={setExpenseItem}
              error={!!validationErrors.expenseItem}
              helperText={validationErrors.expenseItem}
            />
            <EmployeeList
              value={expenseBy}
              onChange={setExpenseBy}
              error={!!validationErrors.expenseBy}
              helperText={validationErrors.expenseBy}
            />
          </Box>
        </Box>

        {/* Filter Selection Section */}
        <Box sx={{ 
          p: 3, 
          mt: 2,
          border: "2px dashed", 
          borderColor: "success.main", 
          borderRadius: 2,
          bgcolor: "success.50"
        }}>
          <Typography variant="h6" sx={{ color: "success.main", fontWeight: 600, mb: 2 }}>
            🎯 Filter Options
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns={{ md: "1fr 1fr 1fr", xs: "1fr" }}
            gap={2}
          >
            <FilledAutocomplete
              value={selectedGroup}
              onChange={(e, newValue) => setSelectedGroup(newValue)}
              options={groupOptions}
              getOptionLabel={(option) => option?.groupName || ""}
              isOptionEqualToValue={(o, v) => o.groupId === v.groupId}
              label="Group Name"
              error={!!validationErrors.group}
              helperText={validationErrors.group}
              fullWidth
              popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
              clearIcon={<Clear sx={{ color: fontColor.paper }} />}
            />
            <ExpenseItems
              value={expenseItem}
              onChange={setExpenseItem}
              error={!!validationErrors.expenseItem}
              helperText={validationErrors.expenseItem}
            />
            <EmployeeList
              value={expenseBy}
              onChange={setExpenseBy}
              error={!!validationErrors.expenseBy}
              helperText={validationErrors.expenseBy}
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          mt: 3, 
          display: "flex", 
          gap: 2, 
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <Button 
            variant="contained" 
            onClick={fetchExpenses}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #5a67d8 0%, #667eea 100%)",
                transform: "translateY(-1px)"
              },
              transition: "all 0.2s ease"
            }}
          >
            📊 Generate Report
          </Button>
          <Button 
            variant="outlined" 
            onClick={resetFilters}
            sx={{
              color: "primary.main",
              borderColor: "primary.main",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "primary.50",
                transform: "translateY(-1px)"
              },
              transition: "all 0.2s ease"
            }}
          >
            🔄 Reset Filters
          </Button>
          {expenses.length > 0 && (
            <Button
              variant="contained"
              onClick={handlePrint}
              startIcon={<Print />}
              sx={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(135deg, #e084fc 0%, #f34570 100%)",
                  transform: "translateY(-1px)"
                },
                transition: "all 0.2s ease"
              }}
            >
              🖨️ Print Report
            </Button>
          )}
        </Box>
      </Paper>

      {error && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: "error.50", 
            border: "1px solid",
            borderColor: "error.main",
            borderRadius: 2
          }}
        >
          <Typography color="error.main" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
            ⚠️ {error}
          </Typography>
        </Paper>
      )}
      </Paper>



      {/* Results Section */}
      <Paper 
        elevation={0}
        sx={{ 
          backgroundColor: theme.paperBg, 
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider"
        }}
      >
        <Box sx={{ 
          p: 3, 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white"
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📋 Expense Records
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {expenses.length > 0 ? `Found ${expenses.length} records` : "No data available"}
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: "rgba(103, 126, 234, 0.1)",
                "& .MuiTableCell-head": {
                  fontWeight: 700,
                  color: "primary.main",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: 1
                }
              }}>
                <TableCell>Voucher No</TableCell>
                <TableCell>Voucher Date</TableCell>
                <TableCell>Expense Group</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Description</TableCell>
                <TableCell sx={{ textAlign: "right" }}>Amount</TableCell>
                <TableCell>Expense By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ color: fontColor.paper }}>
                        Loading expenses...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : expenses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 8, color: fontColor.paper }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <Typography variant="h6" sx={{ opacity: 0.6 }}>
                        📄 {hasSearched ? "No Records Found" : "No Data to Display"}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {hasSearched
                          ? "Try adjusting your filter criteria"
                          : 'Please click "Show" after selecting filters'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedExpenses.map((exp, idx) => (
                  <TableRow 
                    key={page * rowsPerPage + idx}
                    sx={{ 
                      "&:hover": { backgroundColor: "rgba(103, 126, 234, 0.05)" },
                      transition: "background-color 0.2s ease"
                    }}
                  >
                    <TableCell sx={{ 
                      color: fontColor.paper, 
                      fontWeight: 500,
                      borderBottom: "1px solid rgba(224, 224, 224, 0.5)"
                    }}>
                      {exp.voucherNo}
                    </TableCell>
                    <TableCell sx={{ 
                      color: fontColor.paper,
                      borderBottom: "1px solid rgba(224, 224, 224, 0.5)"
                    }}>
                      {new Date(exp.voucherDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ 
                      color: fontColor.paper,
                      borderBottom: "1px solid rgba(224, 224, 224, 0.5)"
                    }}>
                      <Box sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: "rgba(103, 126, 234, 0.1)",
                        color: "primary.main",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        display: "inline-block"
                      }}>
                        {exp.groupName || "N/A"}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      color: fontColor.paper,
                      borderBottom: "1px solid rgba(224, 224, 224, 0.5)"
                    }}>
                      {exp.itemName || "N/A"}
                    </TableCell>
                    <TableCell sx={{ 
                      color: fontColor.paper,
                      borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                      maxWidth: "200px"
                    }}>
                      <Typography variant="body2" sx={{ 
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {exp.descriptions || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{
                      color: "success.main",
                      fontWeight: 700,
                      textAlign: "right",
                      fontSize: "1rem",
                      borderBottom: "1px solid rgba(224, 224, 224, 0.5)"
                    }}>
                      ₹ {exp.amount?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell sx={{ 
                      color: fontColor.paper,
                      borderBottom: "1px solid rgba(224, 224, 224, 0.5)"
                    }}>
                      <Box sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: "rgba(76, 175, 80, 0.1)",
                        color: "success.main",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        display: "inline-block"
                      }}>
                        {exp.expensesBy || "N/A"}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {expenses.length > 0 && (
            <Box sx={{ 
              p: 2, 
              backgroundColor: "rgba(103, 126, 234, 0.02)",
              borderTop: "1px solid rgba(224, 224, 224, 0.5)"
            }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={expenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  color: fontColor.paper,
                  "& .MuiTablePagination-toolbar": { color: fontColor.paper },
                  "& .MuiSelect-select": { color: fontColor.paper },
                  "& .MuiSvgIcon-root": { color: fontColor.paper },
                  "& .MuiTablePagination-displayedRows": { color: fontColor.paper },
                }}
              />
            </Box>
          )}
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ExpenseReport;
