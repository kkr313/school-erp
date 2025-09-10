import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
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
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Search, Person, Receipt, Payment } from "@mui/icons-material";
import { useApi } from "../../utils/useApi";
import GetFeeDetails from "../Dropdown/GetFeeDetails";
import { useTheme } from "../../context/ThemeContext";
import CustomBreadcrumb from "../../utils/CustomBreadcrumb";

const DuesCollection = () => {
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const { callApi, loading, error } = useApi();
  const [successMsg, setSuccessMsg] = useState(false);

  const { theme, fontColor } = useTheme();

  const [fine, setFine] = useState(0);
  const [concession, setConcession] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);

  const [errors, setErrors] = useState({
    receiptDate: "",
    fine: "",
    concession: "",
    paidAmount: "",
  });

  // currency formatter
  const formatAmount = (val) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      Number(val || 0)
    );

  // Compute pending from duesDescription like "Aug-300+Sep-2500" or accept plain number
  const getPendingFromDues = (duesDescription) => {
    if (duesDescription == null) return 0;
    if (typeof duesDescription === "number") return duesDescription;
    const str = String(duesDescription);
    try {
      return str
        .split("+")
        .map((part) => Number(part.split("-")[1] || part))
        .filter((n) => Number.isFinite(n))
        .reduce((a, b) => a + b, 0);
    } catch (_) {
      const nums = str.match(/\d+(?:\.\d+)?/g);
      return nums ? nums.map(Number).reduce((a, b) => a + b, 0) : 0;
    }
  };

  // Extract month names from duesDescription like "Aug-300+Sep-2500" and normalize to short names
  const extractMonthNames = (duesDescription) => {
    if (duesDescription == null) return [];
    if (typeof duesDescription === "number") return [];
    const str = String(duesDescription);

    const monthMap = {
      january: "Jan",
      february: "Feb",
      march: "Mar",
      april: "Apr",
      may: "May",
      june: "Jun",
      july: "Jul",
      august: "Aug",
      september: "Sep",
      october: "Oct",
      november: "Nov",
      december: "Dec",
      jan: "Jan",
      feb: "Feb",
      mar: "Mar",
      apr: "Apr",
      jun: "Jun",
      jul: "Jul",
      aug: "Aug",
      sep: "Sep",
      sept: "Sep",
      oct: "Oct",
      nov: "Nov",
      dec: "Dec",
    };

    const parts = str
      .split(/[+,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const months = [];
    for (const p of parts) {
      // pick word prefix before '-' or space
      const match = p.match(/^([A-Za-z]+)[\s-]/);
      if (match) {
        const key = match[1].toLowerCase();
        months.push(monthMap[key] || match[1]);
      }
    }
    return months;
  };

  // Fetch students with dues
  useEffect(() => {
    const fetchStudents = async () => {
      const data = await callApi("/api/GetStudents/GetFilterDuesFeesStudents", {
        trackingId: "string",
      });
      if (data) {
        setStudents(data);
      }
    };
    fetchStudents();
  }, [callApi]);

  // Filter students
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredStudents([]);
      return;
    }
    const filtered = students.filter((s) =>
      [s.studentName, s.admissionNo, s.fatherName]
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchText, students]);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchText("");
    setFilteredStudents([]);
    setPrevDues(null);
    setSelectedMonthsData([]);
    fetchReceiptNumber(student.admissionId);
    setErrors({
      receiptDate: "",
      fine: "",
      concession: "",
      paidAmount: "",
    });
  };

  const fetchReceiptNumber = async (admissionId) => {
    // Try dues billing endpoint first, then fallback to monthly billing
    let data = await callApi(
      "/api/DuesBillingFees/GetBillingReceiptNumber",
      { admissionId }
    );

    if (!data || !data.receiptNumber) {
      data = await callApi(
        "/api/MonthlyBillingFees/GetBillingReceiptNumber",
        { admissionId }
      );
    }

    if (data && data.receiptNumber) {
      setReceiptNumber(data.receiptNumber);
    } else {
      setReceiptNumber("N/A");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paidAmount || Number(paidAmount) === 0) {
      newErrors.paidAmount = "Paid Amount must be greater than 0";
    } else if (prevDues && Number(paidAmount) < Number(prevDues.dueAmount)) {
      newErrors.paidAmount = `Paid Amount should be ≥ Prev Dues (${prevDues.dueAmount})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Group fees by headName
  const groupedFees = {};
  selectedMonthsData.forEach((month) => {
    month.details.forEach((fee) => {
      if (!groupedFees[fee.headName]) {
        groupedFees[fee.headName] = { amount: 0 };
      }
      groupedFees[fee.headName].amount += fee.amount;
    });
  });

  const groupedFeesArray = Object.entries(groupedFees).map(
    ([headName, data]) => ({
      headName,
      amount: data.amount,
    })
  );

  const totalBilling =
    groupedFeesArray.reduce((sum, fee) => sum + fee.amount, 0) +
    (prevDues ? prevDues.dueAmount : 0);

  const totalPayable =
    totalBilling + Number(fine || 0) - Number(concession || 0);
  const dues = totalPayable - Number(paidAmount || 0);

  const handleSave = () => {
    if (!validateForm()) return;

    const payload = {
      admissionId: selectedStudent?.admissionId || selectedStudent?.id,
      prevDues: prevDues || null,
      dues: selectedMonthsData.map((month) => ({
        monthId: month.id || month.monthId,
        monthName: month.month,
        fees: month.details.map((fee) => ({
          ledgerId: fee.ledgerId,
          headId: fee.headId,
          headName: fee.headName,
          headCategory: fee.headCategory,
          headType: fee.headType,
          amount: fee.amount,
          paidStatus: "Paid",
        })),
      })),
      receiptNumber,
      receiptDate,
      fine: Number(fine),
      concession: Number(concession),
      totalBilling,
      totalPayable,
      paidAmount: Number(paidAmount),
      duesAmount: dues,
    };

    console.log("Saved Payload:", payload);
    setSuccessMsg(true);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: "auto" }}>
      <CustomBreadcrumb
        title="Dues Collection"
        links={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Collection", href: "/collection" },
        ]}
      />

      {/* Outstanding Dues Note */}
      <Card
        sx={{
          mb: 2,
          boxShadow: 0,
          border: "1px solid",
          borderColor: "warning.light",
          bgcolor: "warning.50",
        }}
      >
        <CardContent sx={{ py: 1.5 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "warning.dark" }}
          >
            Outstanding dues collection
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Search students with pending dues and collect payments.
          </Typography>
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card
        sx={{
          mb: 2,
          boxShadow: 0,
          // removed outer border for a cleaner look
        }}
      >
        <CardContent sx={{ py: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            {/* Search icon that expands to input */}
            <IconButton
              onClick={() => {
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 0);
              }}
              sx={{
                bgcolor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                transition: "transform 200ms ease, box-shadow 200ms ease",
                "&:hover": { transform: "scale(1.05)", boxShadow: "0 10px 24px rgba(0,0,0,0.1)" },
                border: "none", // ensure no border around the icon
              }}
              size="large"
            >
              <Search sx={{ color: "text.secondary" }} />
            </IconButton>

            {/* Expanding input */}
            <Box
              sx={{
                flex: 1,
                maxWidth: isSearchOpen ? 1000 : 0,
                opacity: isSearchOpen ? 1 : 0,
                transform: isSearchOpen ? "scaleX(1)" : "scaleX(0.95)",
                transition: "max-width 300ms ease, opacity 250ms ease, transform 250ms ease",
                overflow: "hidden",
              }}
            >              <TextField
                fullWidth
                placeholder={isSearchOpen ? "Search by name, admission no, or father's name" : "Search..."}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onBlur={() => {
                  if (!searchText.trim()) setIsSearchOpen(false);
                }}
                inputRef={searchInputRef}
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchText && (
                        <Button
                          size="small"
                          onClick={() => setSearchText("")}
                          sx={{ minWidth: "auto", p: 0.5 }}
                        >
                          ×
                        </Button>
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  },
                }}              />
            </Box>
          </Box>          {/* Search Results */}
          {searchText.trim() && (
            <Box
              sx={{
                mt: 1.5,
                maxHeight: { xs: 280, sm: 320 },
                overflow: "auto",
                borderRadius: 2,
                p: { xs: 1.5, sm: 2.5 }, // responsive padding
                bgcolor: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              ) : filteredStudents.length > 0 ? (
                <List dense disablePadding>
                  {filteredStudents.map((student) => {
                    const pending = getPendingFromDues(student.duesDescription);
                    const classLabel = [student.className, student.section].filter(Boolean).join("-");
                    const rollLabel = Number.isFinite(Number(student.rollNo)) ? `Roll ${student.rollNo}` : "Roll -";
                    const admissionLabel = student.admissionNo ? `Admission No. ${student.admissionNo}` : "Admission -";
                    return (                      <ListItemButton
                        key={student.id}
                        dense
                        onClick={() => handleSelectStudent(student)}
                        sx={{
                          my: { xs: 0.4, sm: 0.6 },
                          py: { xs: 0.75, sm: 1.1 },
                          px: { xs: 1, sm: 1.25 },
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "rgba(255,255,255,0.65)",
                          backdropFilter: "blur(10px)",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.85)" },
                          minHeight: { xs: "auto", sm: "unset" },
                        }}
                      >{/* Responsive layout: stacked on mobile, grid on desktop */}
                        <Box
                          sx={{
                            display: { xs: "flex", sm: "grid" },
                            flexDirection: { xs: "column", sm: "unset" },
                            gridTemplateColumns: { sm: "1.2fr 1fr auto" },
                            columnGap: { sm: 1.25 },
                            rowGap: { xs: 1, sm: 0.75 },
                            alignItems: { xs: "stretch", sm: "center" },
                            width: "100%",
                            gap: { xs: 1, sm: 0 },
                          }}
                        >                          {/* Column 1: Name + Father Name badge */}
                          <Box
                            sx={{
                              minWidth: 0,
                              px: { xs: 0.75, sm: 1 },
                              py: { xs: 0.5, sm: 0.75 },
                              borderRadius: 1.2,
                              background: "linear-gradient(90deg, rgba(59,130,246,0.05), rgba(59,130,246,0.02))",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ 
                                fontWeight: 700, 
                                mb: 0.5, 
                                fontSize: { xs: "0.825rem", sm: "0.875rem" },
                                whiteSpace: "nowrap", 
                                overflow: "hidden", 
                                textOverflow: "ellipsis" 
                              }}
                            >
                              {student.studentName}
                            </Typography>
                            <Chip
                              label={`Father Name - ${student.fatherName ?? '-'}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                bgcolor: "rgba(255,255,255,0.7)",
                                backdropFilter: "blur(6px)",
                                borderColor: "info.light",
                                color: "info.main",
                                fontWeight: 500,
                                maxWidth: "100%",
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                height: { xs: "20px", sm: "24px" },
                                "& .MuiChip-label": {
                                  px: { xs: 0.5, sm: 1 },
                                },
                              }}
                            />
                          </Box>                          {/* Column 2: Class, Roll, Admission chips */}
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: { xs: 0.5, sm: 0.75 },
                              px: { xs: 0.75, sm: 1 },
                              py: { xs: 0.5, sm: 0.75 },
                              borderRadius: 1.2,
                              background: "linear-gradient(90deg, rgba(16,185,129,0.05), rgba(16,185,129,0.02))",
                              minWidth: 0,
                            }}
                          >
                            <Chip
                              label={`${student.className}-${student.section} | ${rollLabel}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                bgcolor: "rgba(99,102,241,0.08)",
                                borderColor: "primary.light",
                                color: "primary.main",
                                fontWeight: 600,
                                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                height: { xs: "20px", sm: "24px" },
                                "& .MuiChip-label": {
                                  px: { xs: 0.5, sm: 1 },
                                },
                                maxWidth: { xs: "100%", sm: "auto" },
                              }}
                            />
                            <Chip
                              label={admissionLabel}
                              size="small"
                              variant="outlined"
                              sx={{
                                bgcolor: "rgba(236,72,153,0.08)",
                                borderColor: "secondary.light",
                                color: "secondary.main",
                                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                height: { xs: "20px", sm: "24px" },
                                "& .MuiChip-label": {
                                  px: { xs: 0.5, sm: 1 },
                                },
                                maxWidth: { xs: "100%", sm: "auto" },
                              }}
                            />
                          </Box>                          {/* Column 3: Pending Amount (right aligned on desktop, full width on mobile) */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: { xs: "center", sm: "flex-end" },
                              alignItems: "center",
                              px: { xs: 0.75, sm: 1 },
                              py: { xs: 0.5, sm: 0.75 },
                              borderRadius: 1.2,
                              background: "linear-gradient(90deg, rgba(239,68,68,0.05), rgba(239,68,68,0.02))",
                              borderLeft: { sm: "1px solid", xs: "none" },
                              borderTop: { xs: "1px solid", sm: "none" },
                              borderColor: "divider",
                              minWidth: 0,
                              mt: { xs: 0.5, sm: 0 },
                            }}
                          >
                            {pending > 0 ? (
                              <Chip
                                label={`Pending ₹${formatAmount(pending)}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  bgcolor: "rgba(239,68,68,0.08)",
                                  borderColor: "error.light",
                                  color: "error.main",
                                  fontWeight: 700,
                                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                  height: { xs: "22px", sm: "24px" },
                                  "& .MuiChip-label": {
                                    px: { xs: 0.75, sm: 1 },
                                    fontWeight: 700,
                                  },
                                }}
                              />
                            ) : null}
                          </Box>
                        </Box>
                      </ListItemButton>
                    );
                  })}
                </List>
              ) : (
                <Typography
                  color="text.secondary"
                  sx={{ textAlign: "center", p: 1.5, fontSize: 13 }}
                >
                  No students with dues found
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Selected Student Details */}
      {selectedStudent && (
        <Grid container spacing={2}>
          {/* Student Information */}
          <Grid item xs={12} md={5}>
            <Card sx={{ border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Person color="primary" fontSize="small" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Student Information
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedStudent.studentName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">
                      Admission No
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedStudent.admissionNo}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">
                      Roll No
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedStudent.rollNo}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">
                      Class
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedStudent.className}-{selectedStudent.section}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">
                      Father's Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedStudent.fatherName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">
                      Mother's Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedStudent.motherName}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Dues Collection */}
          <Grid item xs={12} md={7}>
            <Card sx={{ border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Payment color="primary" fontSize="small" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Dues Collection
                  </Typography>
                </Box>                {/* Receipt Details */}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Receipt No: <strong>{receiptNumber}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Receipt Date"
                      type="date"
                      size="small"
                      fullWidth
                      value={receiptDate}
                      onChange={(e) => setReceiptDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        max: new Date().toISOString().split("T")[0],
                      }}
                      error={!!errors.receiptDate}
                      helperText={errors.receiptDate}
                    />
                  </Grid>
                </Grid>

                {/* Fee Selection */}
                <Box sx={{ mb: 2 }}>
                  <GetFeeDetails
                    admissionId={
                      selectedStudent?.admissionId || selectedStudent?.id
                    }
                    onMonthsChange={setSelectedMonthsData}
                    onPrevDues={setPrevDues}
                  />
                </Box>                {/* Fee Summary */}
                {selectedMonthsData.length > 0 && (
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ 
                      mb: 2,
                      overflowX: "auto",
                      "& .MuiTable-root": {
                        minWidth: { xs: 300, sm: "auto" },
                      },
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Description
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontWeight: 600 }}
                          >
                            Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Previous Dues */}
                        {prevDues && (
                          <TableRow>
                            <TableCell>Previous Dues</TableCell>
                            <TableCell align="right">
                              ₹{formatAmount(prevDues.dueAmount)}
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Fee Heads */}
                        {groupedFeesArray.map((fee) => (
                          <TableRow key={fee.headName}>
                            <TableCell>{fee.headName}</TableCell>
                            <TableCell align="right">
                              ₹{formatAmount(fee.amount)}
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow>
                          <TableCell colSpan={2}>
                            <Divider />
                          </TableCell>
                        </TableRow>

                        {/* Total Billing */}
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Total Billing
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontWeight: 600 }}
                          >
                            ₹{formatAmount(totalBilling)}
                          </TableCell>
                        </TableRow>

                        {/* Fine */}
                        <TableRow>
                          <TableCell>Fine</TableCell>
                          <TableCell align="right">                            <TextField
                              type="number"
                              size="small"
                              value={fine}
                              onChange={(e) => setFine(e.target.value)}
                              sx={{ width: { xs: 80, sm: 100 } }}
                              inputProps={{
                                min: 0,
                                style: { textAlign: "right", fontSize: "0.875rem" },
                              }}
                            />
                          </TableCell>
                        </TableRow>

                        {/* Concession */}
                        <TableRow>
                          <TableCell>Concession</TableCell>
                          <TableCell align="right">                            <TextField
                              type="number"
                              size="small"
                              value={concession}
                              onChange={(e) => setConcession(e.target.value)}
                              sx={{ width: { xs: 80, sm: 100 } }}
                              inputProps={{
                                min: 0,
                                style: { textAlign: "right", fontSize: "0.875rem" },
                              }}
                            />
                          </TableCell>
                        </TableRow>

                        {/* Total Payable */}
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Total Payable
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontWeight: 600 }}
                          >
                            ₹{formatAmount(totalPayable)}
                          </TableCell>
                        </TableRow>

                        {/* Paid Amount */}
                        <TableRow>
                          <TableCell>Paid Amount</TableCell>
                          <TableCell align="right">                            <TextField
                              type="number"
                              size="small"
                              value={paidAmount}
                              onChange={(e) => {
                                let value = e.target.value;
                                if (!/^\d{0,6}$/.test(value)) return;
                                if (Number(value) > totalPayable)
                                  value = totalPayable.toString();
                                setPaidAmount(value);
                                if (errors.paidAmount)
                                  setErrors((prev) => ({
                                    ...prev,
                                    paidAmount: "",
                                  }));
                              }}
                              sx={{ width: { xs: 80, sm: 100 } }}
                              inputProps={{
                                min: 0,
                                style: { textAlign: "right", fontSize: "0.875rem" },
                              }}
                              error={!!errors.paidAmount}
                              helperText={errors.paidAmount}
                            />
                          </TableCell>
                        </TableRow>

                        {/* Remaining Dues */}
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Remaining Dues
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 600,
                              color:
                                dues > 0 ? "error.main" : "success.main",
                            }}
                          >
                            ₹{formatAmount(dues)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Collect Button */}
                {selectedMonthsData.length > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      size="medium"
                      startIcon={<Receipt />}
                      sx={{ px: 3 }}
                    >
                      Collect Payment
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMsg(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Dues payment collected successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DuesCollection;