import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TablePagination,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Print, Clear } from "@mui/icons-material";
import { useTheme } from "../../context/ThemeContext";
import Class from "../Dropdown/Class";
import Gender from "../Dropdown/Gender";
import Section from "../Dropdown/Section"; // ✅ use Section.jsx here
import { getBaseUrlBySchoolCode } from "../../utils/schoolBaseUrls";
import FilledTextField from "../../utils/FilledTextField";
import GetGender from "../Dropdown/GetGender";
import GetMultiGender from "../Dropdown/GetMultiGender";
import CustomBreadcrumb from "../../utils/CustomBreadcrumb";

const StudentDetailReport = () => {
  const { theme, fontColor } = useTheme();

  const [students, setStudents] = useState([]);
  const [baseFiltered, setBaseFiltered] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const printRef = useRef();

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const schoolCode = localStorage.getItem("schoolCode");
      const baseUrl = getBaseUrlBySchoolCode(schoolCode);

      if (!baseUrl) {
        console.error("Invalid or missing school code");
        return;
      }

      const res = await fetch(`${baseUrl}/api/Students/GetAllStudentList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingID: "string", operationType: "select" }),
      });

      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();
      setStudents(data);
      setBaseFiltered(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Apply filters
  const applyFilters = () => {
    let temp = [...students];

    const classValue =
      selectedClass && typeof selectedClass === "object"
        ? selectedClass.label
        : selectedClass || "";

    const genderValue =
      selectedGender && typeof selectedGender === "object"
        ? selectedGender.label
        : selectedGender || "";

    const sectionValue =
      selectedSection && typeof selectedSection === "object"
        ? selectedSection.value // ✅ ab value se match hoga
        : selectedSection || "";

    if (classValue)
      temp = temp.filter(
        (s) =>
          s.className?.toLowerCase().trim() === classValue.toLowerCase().trim()
      );

    // Gender filter
    if (selectedGender && selectedGender.length > 0) {
      const genderValues = selectedGender.map((g) =>
        g.label.toLowerCase().trim()
      );

      temp = temp.filter((s) =>
        genderValues.includes(s.gender?.toLowerCase().trim())
      );
    }

    if (sectionValue && sectionValue !== "ALL") {
      if (sectionValue === "N/A") {
        temp = temp.filter((s) => !s.section || s.section.trim() === "");
      } else {
        temp = temp.filter(
          (s) =>
            (s.section || "").toLowerCase().trim() ===
            sectionValue.toLowerCase().trim()
        );
      }
    }
    setBaseFiltered(temp);
    searchWithinData(temp, searchTerm);
    setPage(0);
  };

  // Search only within baseFiltered data
  const searchWithinData = (data, term) => {
    if (!term.trim()) {
      setFiltered(data);
      return;
    }
    const searchValue = term.toLowerCase();
    const result = data.filter((s) =>
      (s.studentName + s.admissionNo + s.fatherName)
        .toLowerCase()
        .includes(searchValue)
    );
    setFiltered(result);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchWithinData(baseFiltered, term);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFiltered(baseFiltered);
    setPage(0);
  };

  const clearFilters = () => {
    setSelectedClass(null);
    setSelectedGender("");
    setSelectedSection(null); // ✅ reset object
    setSearchTerm("");
    setBaseFiltered(students);
    setFiltered(students);
    setPage(0);
  };

  const handlePrint = () => {
    if (!filtered || filtered.length === 0) return;

    const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Sl.</th>
          <th>Class</th>
          <th>Sec</th>
          <th>Roll</th>
          <th>AdmNo</th>
          <th>StudentName</th>
          <th>FatherName</th>
          <th>DOA</th>
          <th>Gender</th>
          <th>DOB</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        ${filtered
          .map(
            (student, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${student.className || "N/A"}</td>
            <td>${student.section || "N/A"}</td>
            <td>${student.rollNo || "N/A"}</td>
            <td>${student.admissionNo || "N/A"}</td>
            <td>${student.studentName || "N/A"}</td>
            <td>${student.fatherName || "N/A"}</td>
            <td>${student.doa || "N/A"}</td>
            <td>${student.gender || "N/A"}</td>
            <td>${student.dob || "N/A"}</td>
            <td>${student.address || "N/A"}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

    const win = window.open("", "", "height=600,width=900");
    win.document.write(`
    <html>
      <head>
        <title>Student Detail Report</title>
        <style>
          @page { margin: 0; }
          body { margin: 20px; font-family: Arial, sans-serif; }
          h2 { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ccc;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <h2>Student Detail Report</h2>
        ${tableHTML}
        <script>
          window.onload = () => {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);
    win.document.close();
  };

  const paginatedData = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      p={2}
      sx={{
        backgroundColor: theme.bodyBg,
        color: fontColor.paper,
        minHeight: "100vh",
        px: { xs: 2, sm: 2 },
        py: { xs: 1, sm: 0 },
      }}
    >
      <CustomBreadcrumb
        title="Student Detail Report"
        links={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Report", href: "/report" },
        ]}
      />

      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: theme.paperBg,
          color: fontColor.paper,
          mt: -1,
        }}
      >
        {/* <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 600,
            color: theme.formHeaderFontColor,
            fontFamily: theme.formHeaderFontFamily,
            mb: 3
          }}
        >
          Student Detail Report
        </Typography> */}

        <Box
          display="grid"
          gridTemplateColumns={{ md: "1fr 1fr 1fr", xs: "1fr" }}
          gap={2}
        >
          <Class value={selectedClass} onClassChange={setSelectedClass} />
          {/* <Gender value={selectedGender} onChange={setSelectedGender} /> */}
          <GetMultiGender
            value={selectedGender}
            onGenderChange={setSelectedGender}
            showSelectAll={true}
          />

          {/* ✅ Section dropdown instead of textfield */}
          <Section
            classId={selectedClass?.value}
            value={selectedSection}
            onSectionChange={(newVal) => setSelectedSection(newVal)}
            showSelectAll
          />
        </Box>

        <Box
          mt={2}
          display="flex"
          flexWrap="wrap"
          gap={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <FilledTextField
            label="Search"
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{ width: 250 }}
            InputProps={{
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} size="small">
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={clearFilters}>
              Clear
            </Button>
            <Button variant="contained" onClick={applyFilters}>
              Apply
            </Button>
            {filtered.length > 0 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePrint}
                startIcon={<Print />}
              >
                Print
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            ref={printRef}
            sx={{ backgroundColor: theme.paperBg }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  {[
                    "Sl.",
                    "Class",
                    "Sec",
                    "Roll",
                    "AdmNo",
                    "StudentName",
                    "FatherName",
                    "DOA",
                    "Gender",
                    "DOB",
                    "Address",
                  ].map((head, index) => (
                    <TableCell
                      key={index}
                      sx={{ fontWeight: "bold", color: "black" }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      align="center"
                      sx={{ color: fontColor.paper }}
                    >
                      No records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((student, index) => (
                    <TableRow key={student.id || index}>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {student.className || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {student.section || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {student.rollNo || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {student.admissionNo || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {student.studentName || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {student.fatherName || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {student.doa || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {student.gender || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {student.dob || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: fontColor.paper }}>
                        {student.address || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              sx={{
                color: fontColor.paper,
                "& .MuiTablePagination-toolbar": { color: fontColor.paper },
                "& .MuiSelect-select": { color: fontColor.paper },
                "& .MuiSvgIcon-root": { color: fontColor.paper },
                "& .MuiTablePagination-displayedRows": {
                  color: fontColor.paper,
                },
              }}
            />
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default StudentDetailReport;
