import React, { useState } from "react";
import { getBaseUrlBySchoolCode } from "../../utils/schoolBaseUrls";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import Class from "../Dropdown/Class";
import FilledTextField from "../../utils/FilledTextField";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { ArrowDropDown, Clear } from "@mui/icons-material";
import CustomBreadcrumb from "../../utils/CustomBreadcrumb";

const FeeCollectionDateWiseReport = () => {
  const { fontColor, theme } = useTheme();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    FromDate: sevenDaysAgoStr,
    ToDate: todayStr,
    ClassName: { label: "Select All", value: "10001" },
    Section: "Select All",
    PaymentMode: "All",
    StudentType: "Select All Type",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    setFilters({
      FromDate: sevenDaysAgoStr,
      ToDate: todayStr,
      ClassName: { label: "Select All", value: "10001" },
      Section: "Select All",
      PaymentMode: "All",
      StudentType: "Select All Type",
    });
    setData([]);
    setPage(0);
    setRowsPerPage(10);
    setErrorMsg("");
  };

  const handleClassChange = (newClass) => {
    setFilters((prev) => ({
      ...prev,
      ClassName: newClass || { label: "Select All", value: "10001" },
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const validate = () => {
    if (!filters.FromDate || !filters.ToDate) {
      setErrorMsg("Please select both From Date and To Date.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const fetchData = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload = {
      FromDate: filters.FromDate,
      ToDate: filters.ToDate,
      ClassName: String(filters.ClassName?.value || "10001"),
      Section: filters.Section,
      PaymentMode: filters.PaymentMode,
      StudentType: filters.StudentType,
      PageNumber: "1",
      PageSize: "1000",
      OperationType: "ReportFeeCollection",
    };

    try {
      const schoolCode = localStorage.getItem("schoolCode");
      const baseUrl = getBaseUrlBySchoolCode(schoolCode);

      const response = await fetch(
        `${baseUrl}/api/CollectionFees/GetFeeCollectionDateWiseReport`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      setData(result.feeCollectionFee || []);
    } catch (error) {
      console.error("❌ Error fetching fee collection report:", error);
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: fontColor.paper },
      "&:hover fieldset": { borderColor: fontColor.paper },
      "&.Mui-focused fieldset": { borderColor: fontColor.paper },
    },
    "& .MuiInputLabel-root": { color: fontColor.paper },
    "& .MuiFormHelperText-root": { color: "red" },
    input: { color: fontColor.paper },
  };

  const totalFee = data.reduce(
    (sum, row) => sum + (parseFloat(row.fee) || 0),
    0
  );

  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title="Fee Collection Report (Date Wise)"
        links={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Report", href: "/report" },
        ]}
      />

      <Paper sx={{ p: 2, mb: 3, backgroundColor: theme.paperBg, mt: -1 }}>
        {/* <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "1.8rem", sm: "2.15rem" },
            color: theme.formHeaderFontColor,
            fontFamily: theme.formHeaderFontFamily,
            mb: 3,
          }}
        >
          Fee Collection Report (Date Wise)
        </Typography> */}

        <Box
          display="grid"
          gridTemplateColumns={{ md: "1fr 1fr 1fr", xs: "1fr" }}
          gap={2}
          alignItems="start"
        >
          <FilledTextField
            label="From Date"
            type="date"
            name="FromDate"
            value={filters.FromDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            helperText={!filters.FromDate && errorMsg}
            error={!filters.FromDate && Boolean(errorMsg)}
            inputProps={{ max: new Date().toISOString().split("T")[0] }}
            fullWidth
          />
          <FilledTextField
            label="To Date"
            type="date"
            name="ToDate"
            value={filters.ToDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            helperText={!filters.ToDate && errorMsg}
            error={!filters.ToDate && Boolean(errorMsg)}
            inputProps={{
              min: filters.FromDate || "",
              max: new Date().toISOString().split("T")[0],
            }}
            fullWidth
          />
          <Class onClassChange={handleClassChange} value={filters.ClassName} />

          <FilledAutocomplete
            options={[
              { label: "Select All", value: "Select All" },
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
            ]}
            value={
              filters.Section
                ? { label: filters.Section, value: filters.Section }
                : null
            }
            onChange={(_, selected) =>
              handleChange({
                target: { name: "Section", value: selected?.value || "" },
              })
            }
            getOptionLabel={(option) => option?.label || ""}
            isOptionEqualToValue={(option, val) => option?.value === val?.value}
            label="Section"
            fullWidth
            popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
            clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          />

          <FilledAutocomplete
            options={[
              { label: "Select All", value: "All" },
              { label: "Cash", value: "Cash" },
              { label: "Online", value: "Online" },
            ]}
            value={
              filters.PaymentMode
                ? {
                    label:
                      filters.PaymentMode === "All"
                        ? "Select All"
                        : filters.PaymentMode,
                    value: filters.PaymentMode,
                  }
                : null
            }
            onChange={(_, selected) =>
              handleChange({
                target: { name: "PaymentMode", value: selected?.value || "" },
              })
            }
            getOptionLabel={(option) => option?.label || ""}
            isOptionEqualToValue={(option, val) => option?.value === val?.value}
            label="Payment Mode"
            fullWidth
            popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
            clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          />

          <FilledAutocomplete
            options={[
              { label: "Select All", value: "Select All Type" },
              { label: "Old", value: "Old" },
              { label: "New", value: "New" },
            ]}
            value={{
              label:
                filters.StudentType === "Select All Type"
                  ? "Select All"
                  : filters.StudentType,
              value: filters.StudentType,
            }}
            onChange={(_, selected) =>
              handleChange({
                target: { name: "StudentType", value: selected?.value || "" },
              })
            }
            getOptionLabel={(option) => option?.label || ""}
            isOptionEqualToValue={(option, val) => option?.value === val?.value}
            label="Student Type"
            fullWidth
            popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
            clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          />
        </Box>

        <Box mt={2} display="flex" gap={2}>
          <Button variant="contained" onClick={fetchData}>
            Show
          </Button>
          <Button variant="outlined" onClick={handleReset} color="secondary">
            Reset
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: theme.paperBg }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                  Adm/Roll
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                  Class/Sec
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                  Receipt Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                  Receipt No
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                  Student Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                  Mobile No
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                  Payment Mode
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "black",
                    textAlign: "right",
                  }}
                >
                  Fee
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                  PaidMonths
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                <>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ color: fontColor.paper }}>
                          {row.admNo}
                        </TableCell>
                        <TableCell sx={{ color: fontColor.paper }}>
                          {row.class}
                        </TableCell>
                        <TableCell sx={{ color: fontColor.paper }}>
                          {row.receiptDate}
                        </TableCell>
                        <TableCell sx={{ color: fontColor.paper }}>
                          {row.receiptNo}
                        </TableCell>
                        <TableCell sx={{ color: fontColor.paper }}>
                          {row.studentName}
                        </TableCell>
                        <TableCell sx={{ color: fontColor.paper }}>
                          {row.mobileNo}
                        </TableCell>
                        <TableCell sx={{ color: fontColor.paper }}>
                          {row.paymentMode}
                        </TableCell>
                        <TableCell
                          sx={{
                            color:
                              theme.paperBg === "white" ||
                              theme.paperBg === "#ffffff"
                                ? "green"
                                : fontColor.paper,
                            fontWeight: "bold",
                            textAlign: "right",
                          }}
                        >
                          ₹ {row.fee}
                        </TableCell>
                        <TableCell sx={{ color: fontColor.paper }}>
                          {row.paidMonthNameList}
                        </TableCell>
                      </TableRow>
                    ))}

                  {/* Total Fee Row */}
                  <TableRow>
                    <TableCell colSpan={6} />
                    <TableCell sx={{ fontWeight: "bold", color: "red" }}>
                      Total
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "red",
                        textAlign: "right",
                      }}
                    >
                      ₹ {totalFee.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{ color: fontColor.paper }}
                  >
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={data.length}
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
        </TableContainer>
      )}
    </Box>
  );
};

export default FeeCollectionDateWiseReport;
