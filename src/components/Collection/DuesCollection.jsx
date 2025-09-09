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
} from "@mui/material";
import { useApi } from "../../utils/useApi";
import GetFeeDetails from "../Dropdown/GetFeeDetails";
import { useTheme } from "../../context/ThemeContext";
import FilledTextField from "../../utils/FilledTextField";
import CustomBreadcrumb from "../../utils/CustomBreadcrumb";
import SubHeaderLabel from "../Design/SubHeaderLabel";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";

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

  const { callApi, loading, error } = useApi();
  const [successMsg, setSuccessMsg] = useState(false);

  // ✅ ThemeContext
  const { theme, fontColor } = useTheme();

  // ✅ Modal states
  const [fine, setFine] = useState(0);
  const [concession, setConcession] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);

  const [errors, setErrors] = useState({
    receiptDate: "",
    fine: "",
    concession: "",
    paidAmount: "",
  });

  // ✅ Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      const data = await callApi("/api/GetStudents/GetFilterDuesFeesStudents", {
        trackingId: "string",
      });
      if (data) {
        setStudents(data);
        setFilteredStudents(data);
      }
    };
    fetchStudents();
  }, [callApi]);

  // ✅ Filter students
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
    const data = await callApi(
      "/api/MonthlyBillingFees/GetBillingReceiptNumber",
      { admissionId } // ✅ Send correct admissionId
    );
    if (data && data.receiptNumber) {
      setReceiptNumber(data.receiptNumber);
    } else {
      setReceiptNumber("N/A");
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: fontColor.paper },
      "&:hover fieldset": { borderColor: fontColor.paper },
      "&.Mui-focused fieldset": { borderColor: fontColor.paper },

      // ✅ Disabled ke liye
      "&.Mui-disabled": {
        "& fieldset": { borderColor: fontColor.paper, borderStyle: "dashed" },
      },
    },
    "& .MuiInputLabel-root": { color: fontColor.paper },
    "& .MuiInputLabel-root.Mui-disabled": { color: fontColor.paper },
    "& .MuiFormHelperText-root": { color: "red" },
    input: { color: fontColor.paper },
    "& input.Mui-disabled": {
      color: fontColor.paper,
      WebkitTextFillColor: fontColor.paper,
    },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]": {
      MozAppearance: "textfield", // Firefox
    },
  };

  const validateForm = () => {
    const newErrors = {};

    // Paid Amount Validations
    if (!paidAmount || Number(paidAmount) === 0) {
      newErrors.paidAmount = "Paid Amount must greater than 0";
    } else if (prevDues && Number(paidAmount) < Number(prevDues.dueAmount)) {
      newErrors.paidAmount = `Paid Amount should be ≥ Prev Dues (${prevDues.dueAmount})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ group by headName
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

    console.log("✅ Saved Payload:", payload);
    setSuccessMsg(true);
  };

  return (
    <>
      {/* Breadcrumb section - visually separated, no background wrapper */}
      <Box sx={{ width: "100%", mb: 0, pb: 0 }}>
        <CustomBreadcrumb
          title="Dues Collection"
          links={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Collection", href: "/collection" },
          ]}
          animated={true}
        />
      </Box>

      {/* Main module section - full width, no background color wrapper */}
      <Box
        sx={{
          width: "100%",
          px: { xs: 0, sm: 0 },
          pt: 0,
          mt: 0,
        }}
      >
        {/* Compact Search Box */}
        <Box
          sx={{
            width: { xs: "100%", sm: "60%", md: "40%" },
            mx: { xs: 0, sm: 0 },
            mb: 3,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "relative",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              borderRadius: 3,
              boxShadow:
                "0 4px 20px -2px rgba(99, 102, 241, 0.08), 0 2px 8px -2px rgba(99, 102, 241, 0.04)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                boxShadow:
                  "0 8px 30px -4px rgba(99, 102, 241, 0.12), 0 4px 16px -4px rgba(99, 102, 241, 0.08)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                transform: "translateY(-1px)",
              },
              "&:focus-within": {
                boxShadow:
                  "0 8px 30px -4px rgba(99, 102, 241, 0.15), 0 0 0 3px rgba(99, 102, 241, 0.1)",
                border: "1px solid #6366f1",
                transform: "translateY(-1px)",
              },
            }}
          >
            <TextField
              fullWidth
              placeholder="Search by Name / Admission No / Father Name"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: "#6366f1",
                        fontSize: "1.4rem",
                        filter:
                          "drop-shadow(0 1px 2px rgba(99, 102, 241, 0.2))",
                      }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  height: 54,
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  color: "#1e293b",
                  letterSpacing: "0.3px",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                  "& input": {
                    padding: "16px 12px",
                    "&::placeholder": {
                      color: "#64748b",
                      opacity: 0.8,
                      fontWeight: 500,
                    },
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  background: "transparent",
                },
              }}
            />
          </Box>
        </Box>

        {/* Results + Details inside Paper */}
        {searchText.trim() !== "" && (
          <Paper
            elevation={4}
            sx={{
              maxHeight: "70vh",
              overflow: "auto",
              mb: 2,
              mt: -3,
              background: "linear-gradient(90deg, #f5f5f5 60%, #e0e7ff 100%)",
              borderRadius: 2,
              boxShadow: "0 2px 12px rgba(59,130,246,0.10)",
              transition: "box-shadow 0.3s",
            }}
            className="custom-scrollbar animate-slideIn"
          >
            {loading ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <CircularProgress sx={{ color: "#6366f1" }} />
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ p: 2 }}>
                {error}
              </Typography>
            ) : (
              <List>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <ListItem
                      button
                      key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      sx={{
                        borderBottom:
                          index !== filteredStudents.length - 1
                            ? "1px solid #e0e0e0"
                            : "none",
                        transition: "background 0.2s",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%)",
                        },
                        borderRadius: 2,
                        boxShadow: "0 1px 4px rgba(59,130,246,0.04)",
                        mb: 1,
                      }}
                    >
                      <ListItemText
                        primary={
                          <>
                            <span style={{ color: "#6366f1", fontWeight: 600 }}>
                              {student.rollNo} / {student.admissionNo}
                            </span>
                            {` - `}
                            <span style={{ color: "#0ea5e9", fontWeight: 600 }}>
                              {student.studentName}
                            </span>
                            {` S/O `}
                            <span style={{ color: "#334155" }}>
                              {student.fatherName}
                            </span>
                          </>
                        }
                        secondary={
                          student.duesDescription ? (
                            <>
                              <span
                                style={{ color: "#ef4444", fontWeight: 500 }}
                              >
                                Dues: {student.duesDescription}
                              </span>
                            </>
                          ) : null
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography sx={{ p: 2 }}>No students found</Typography>
                )}
              </List>
            )}
          </Paper>
        )}

        {/* Show FeeDetails Component when student selected */}
        {selectedStudent && (
          <Paper
            elevation={8}
            sx={{
              p: { xs: 1.5, sm: 3 },
              py: 0,
              mt: 2,
              mb: 5,
              background: "rgba(255,255,255,0.85)",
              borderRadius: 4,
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
              transition: "box-shadow 0.3s",
            }}
            className="glass animate-float"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, // responsive 1-2 layout
                gap: 3,
                alignItems: "flex-start",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {/* ✅ Left: Student Details */}
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
                <Box>
                  <SubHeaderLabel title="Student Details" theme={theme} />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "130px 20px 1fr",
                    gap: 1,
                    color: fontColor.paper,
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  {/* Admission No */}
                  <Typography
                    sx={{
                      display: { xs: "none", sm: "block", fontWeight: "bold" },
                    }}
                  >
                    Admission No
                  </Typography>
                  <Typography
                    sx={{
                      display: { xs: "none", sm: "block", fontWeight: "bold" },
                    }}
                  >
                    :
                  </Typography>
                  <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                    {selectedStudent.admissionNo}
                  </Typography>

                  {/* Roll No */}
                  <Typography
                    sx={{
                      display: { xs: "none", sm: "block", fontWeight: "bold" },
                    }}
                  >
                    Roll No
                  </Typography>
                  <Typography
                    sx={{
                      display: { xs: "none", sm: "block", fontWeight: "bold" },
                    }}
                  >
                    :
                  </Typography>
                  <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                    {selectedStudent.rollNo}
                  </Typography>

                  {/* Mobile combined Adm/Roll */}
                  <Typography
                    sx={{
                      display: { xs: "block", sm: "none", fontWeight: "bold" },
                    }}
                  >
                    Adm/Roll
                  </Typography>
                  <Typography
                    sx={{
                      display: { xs: "block", sm: "none", fontWeight: "bold" },
                    }}
                  >
                    :
                  </Typography>
                  <Typography sx={{ display: { xs: "block", sm: "none" } }}>
                    {selectedStudent.admissionNo} / {selectedStudent.rollNo}
                  </Typography>

                  {/* Class / Section */}
                  <Typography sx={{ fontWeight: "bold" }}>
                    Class / Section
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>:</Typography>
                  <Typography>
                    {selectedStudent.className} - {selectedStudent.section}
                  </Typography>

                  {/* Student Name */}
                  <Typography sx={{ fontWeight: "bold" }}>
                    Student Name
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>:</Typography>
                  <Typography>{selectedStudent.studentName}</Typography>

                  {/* Father's Name */}
                  <Typography sx={{ fontWeight: "bold" }}>
                    Father's Name
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>:</Typography>
                  <Typography>{selectedStudent.fatherName}</Typography>

                  {/* Mother's Name */}
                  <Typography sx={{ fontWeight: "bold" }}>
                    Mother's Name
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>:</Typography>
                  <Typography>{selectedStudent.motherName}</Typography>
                </Box>
              </Box>

              {/* ✅ Right: Fee Details */}
              <Box
                sx={{
                  p: { xs: 1, sm: 2 },
                  borderLeft: { xs: "none", sm: "1px solid grey" },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: "65%" },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <SubHeaderLabel title="Fee Details" theme={theme} />
                  </Box>

                  {/* ✅ Receipt No + Receipt Date */}
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

                  {/* ✅ Fee Selection Component */}

                  <GetFeeDetails
                    admissionId={
                      selectedStudent.admissionId || selectedStudent.id
                    }
                    onMonthsChange={setSelectedMonthsData}
                    onPrevDues={setPrevDues}
                  />

                  {(groupedFeesArray.length > 0 || prevDues) && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          mb: 2,
                          color: fontColor.paper,
                        }}
                      >
                        {selectedMonthsData.length > 0
                          ? `Fee Details - ${selectedMonthsData[0]?.label} to ${
                              selectedMonthsData[selectedMonthsData.length - 1]
                                ?.label
                            }`
                          : "Fee Details"}
                      </Typography>

                      <TableContainer
                        component={Paper}
                        sx={{
                          backgroundColor: theme.paperBg,
                          width: "100%",
                        }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: "#f5f5f5",
                                height: "26px",
                              }}
                            >
                              <TableCell sx={{ px: 1, py: 0.5 }}>
                                <strong>Head</strong>
                              </TableCell>
                              <TableCell sx={{ textAlign: "right", py: 0.5 }}>
                                <strong>Amount</strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {groupedFeesArray.map((fee, idx) => (
                              <TableRow key={idx} sx={{ height: "26px" }}>
                                <TableCell
                                  sx={{ px: 1, color: fontColor.paper, py: 0 }}
                                >
                                  {fee.headName}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    textAlign: "right",
                                    color: fontColor.paper,
                                    py: 0,
                                  }}
                                >
                                  {fee.amount}
                                </TableCell>
                              </TableRow>
                            ))}

                            {prevDues && (
                              <TableRow sx={{ height: "26px" }}>
                                <TableCell
                                  sx={{ px: 1, color: fontColor.paper, py: 0 }}
                                >
                                  Previous Dues ( {prevDues.dueDesc} )
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "bold",
                                    textAlign: "right",
                                    py: 0,
                                    color:
                                      theme.paperBg === "white" ||
                                      theme.paperBg === "#ffffff"
                                        ? "red"
                                        : fontColor.paper,
                                  }}
                                >
                                  {prevDues.dueAmount}
                                </TableCell>
                              </TableRow>
                            )}

                            <TableRow sx={{ height: "26px" }}>
                              <TableCell
                                sx={{ px: 1, color: fontColor.paper, py: 0 }}
                              >
                                <strong>Total Billing</strong>
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "right",
                                  color: fontColor.paper,
                                  py: 0,
                                }}
                              >
                                <strong>{totalBilling}</strong>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* ✅ Fine, Concession, Total Payable, Paid, Dues */}
                      <Box sx={{ mt: 2 }}>
                        <TableContainer
                          sx={{ width: "100%", overflowX: "auto" }}
                        >
                          <Table size="small">
                            <TableBody>
                              {/* Fine */}
                              <TableRow sx={{ height: "28px" }}>
                                <TableCell
                                  sx={{
                                    px: 1,
                                    color: fontColor.paper,
                                    py: 0.5,
                                  }}
                                >
                                  Fine
                                </TableCell>
                                <TableCell
                                  sx={{ px: 1, textAlign: "right", py: 0.5 }}
                                >
                                  <TextField
                                    type="number"
                                    value={fine}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (
                                        value === "" ||
                                        /^\d{0,5}$/.test(value)
                                      ) {
                                        setFine(value);
                                      }
                                    }}
                                    size="small"
                                    sx={{
                                      ...textFieldStyles,
                                      "& .MuiInputBase-root": {
                                        height: 28,
                                        width: 85,
                                      },

                                      "& input": { textAlign: "right" }, // ✅ align right
                                    }}
                                    error={!!errors.fine}
                                    helperText={errors.fine}
                                  />
                                </TableCell>
                              </TableRow>

                              {/* Concession */}
                              <TableRow>
                                <TableCell
                                  sx={{ px: 1, color: fontColor.paper }}
                                >
                                  Concession
                                </TableCell>
                                <TableCell sx={{ px: 1, textAlign: "right" }}>
                                  <TextField
                                    type="number"
                                    value={concession}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (
                                        value === "" ||
                                        /^\d{0,5}$/.test(value)
                                      ) {
                                        setConcession(value);
                                      }
                                    }}
                                    size="small"
                                    sx={{
                                      ...textFieldStyles,
                                      "& .MuiInputBase-root": {
                                        height: 28,
                                        width: 85,
                                      },
                                      "& input": { textAlign: "right" },
                                    }}
                                    error={!!errors.concession}
                                    helperText={errors.concession}
                                  />
                                </TableCell>
                              </TableRow>

                              {/* Total Payable */}
                              <TableRow>
                                <TableCell
                                  sx={{ px: 1, color: fontColor.paper }}
                                >
                                  Total Payable
                                </TableCell>
                                <TableCell sx={{ px: 1, textAlign: "right" }}>
                                  <TextField
                                    value={totalPayable}
                                    size="small"
                                    disabled
                                    sx={{
                                      ...textFieldStyles,
                                      "& .MuiInputBase-root": {
                                        height: 28,
                                        width: 85,
                                      },
                                      "& input": { textAlign: "right" },
                                    }}
                                  />
                                </TableCell>
                              </TableRow>

                              {/* Paid Amount */}
                              <TableRow>
                                <TableCell
                                  sx={{ px: 1, color: fontColor.paper }}
                                >
                                  Paid Amount
                                </TableCell>
                                <TableCell sx={{ px: 1, textAlign: "right" }}>
                                  <TextField
                                    type="number"
                                    value={paidAmount}
                                    onChange={(e) => {
                                      let value = e.target.value;
                                      if (!/^\d{0,6}$/.test(value)) return;
                                      if (Number(value) > totalPayable)
                                        value = totalPayable.toString();
                                      setPaidAmount(value);

                                      // Clear error on input
                                      if (errors.paidAmount) {
                                        setErrors((prevErrors) => ({
                                          ...prevErrors,
                                          paidAmount: "",
                                        }));
                                      }
                                    }}
                                    size="small"
                                    sx={{
                                      ...textFieldStyles,
                                      "& .MuiInputBase-root": {
                                        height: 28,
                                        width: 85,
                                      },
                                      "& input": { textAlign: "right" },
                                    }}
                                    error={!!errors.paidAmount}
                                    helperText={errors.paidAmount}
                                  />
                                </TableCell>
                              </TableRow>

                              {/* Dues */}
                              <TableRow>
                                <TableCell
                                  sx={{ px: 1, color: fontColor.paper }}
                                >
                                  Dues
                                </TableCell>
                                <TableCell sx={{ px: 1, textAlign: "right" }}>
                                  <TextField
                                    value={dues}
                                    size="small"
                                    disabled
                                    sx={{
                                      ...textFieldStyles,
                                      "& .MuiInputBase-root": {
                                        height: 28,
                                        width: 85,
                                      },
                                      "& input": { textAlign: "right" },
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>

                      {/* Save Button */}
                      <Box sx={{ textAlign: "left", mt: 1.5 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={handleSave}
                          sx={{
                            px: 3,
                            py: 0.8,
                            fontWeight: 500,
                            fontSize: "0.9rem",
                            borderRadius: 1.5,
                            textTransform: "none",
                          }}
                        >
                          Collect Dues
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Premium Snackbar */}
        <Snackbar
          open={successMsg}
          autoHideDuration={3000}
          onClose={() => setSuccessMsg(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSuccessMsg(false)}
            severity="success"
            sx={{
              width: "100%",
              fontWeight: 600,
              fontSize: "1.05rem",
              background: "linear-gradient(90deg, #bbf7d0 0%, #f0fdf4 100%)",
              color: "#059669",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(34,197,94,0.10)",
            }}
          >
            Saved Successfully!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default DuesCollection;
