import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import Class from "../Dropdown/Class";
import { useTheme } from "../../context/ThemeContext";
import { getBaseUrlBySchoolCode } from "../../utils/schoolBaseUrls";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import FilledTextField from "../../utils/FilledTextField";
import { ArrowDropDown, Clear } from "@mui/icons-material";
import CustomBreadcrumb from "../../utils/CustomBreadcrumb";
import SubHeaderLabel from "../Design/SubHeaderLabel";

const StudentAttendanceForm = () => {
  const { theme, fontColor } = useTheme();

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

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [sectionOptions, setSectionOptions] = useState(["All"]);
  const [attendanceDate, setAttendanceDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [isAlreadyMarked, setIsAlreadyMarked] = useState(false);

  const trackingId = "2c959833-6fb7-4ada-b401-2de9bc709e19";
  const createdBy = localStorage.getItem("username") || "MobileApp";
  const schoolCode = localStorage.getItem("schoolCode");
  const baseUrl = getBaseUrlBySchoolCode(schoolCode);
  if (!baseUrl) return console.error("Invalid or missing school code");

  const handleClassChange = async (newClass) => {
    setSelectedClass(newClass);
    setSelectedSection("All");
    setSectionOptions(["All"]);
    setErrors({});
    setStudents([]);
    setAttendance({});
    setNoDataFound(false);
    setIsAlreadyMarked(false);

    if (!newClass) return;

    try {
      const res = await fetch(`${baseUrl}/api/Students/GetAllStudentList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: newClass.value }),
      });
      const data = await res.json();
      const filteredByClass = data.filter(
        (s) => s.className?.toLowerCase() === newClass.label.toLowerCase()
      );
      const uniqueSections = [
        ...new Set(
          filteredByClass.map((s) => s.section?.trim()).filter(Boolean)
        ),
      ];
      setSectionOptions(["All", ...uniqueSections]);
      setAllStudents(filteredByClass);
    } catch (error) {
      console.error("Error loading section/student list.");
    }
  };

  const handleShowStudents = async () => {
    const newErrors = {};
    if (!selectedClass) newErrors.class = "Class is required";
    if (!attendanceDate) newErrors.date = "Date is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedDay = new Date(attendanceDate).getDay();
    if (selectedDay === 0) {
      setErrors({ date: "Attendance cannot be marked on Sunday." });
      setStudents([]);
      setAttendance({});
      return;
    }

    setErrors({});
    setNoDataFound(false);
    setIsAlreadyMarked(false);

    const filtered = allStudents.filter(
      (s) =>
        selectedSection === "All" ||
        s.section?.toLowerCase() === selectedSection.toLowerCase()
    );

    if (filtered.length === 0) {
      setNoDataFound(true);
      setStudents([]);
      setAttendance({});
      return;
    }

    try {
      const res = await fetch(
        `${baseUrl}/api/Attendance/GetStudentAttendanceList`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            className: selectedClass.label,
            section: selectedSection === "All" ? "Select All" : selectedSection,
            attendanceDate: attendanceDate,
            operationType: "GetAttendanceWebAPI",
            trackingID: "06a58d2f-d99f-471f-874c-88508a719aa7",
          }),
        }
      );

      const attendanceData = await res.json();
      let finalAttendance = {};

      if (Array.isArray(attendanceData) && attendanceData.length > 0) {
        const markedAttendance = {};
        let anyMarked = false;

        attendanceData.forEach((item) => {
          const admNo = String(item.admRoll?.split("/")[1])?.trim();
          if (admNo) {
            markedAttendance[admNo] = item.markNew;
            if (item.markNew === true) anyMarked = true;
          }
        });

        setIsAlreadyMarked(anyMarked);

        if (anyMarked) {
          filtered.forEach((student) => {
            const admNo = String(student.admissionNo).trim();
            finalAttendance[admNo] =
              admNo in markedAttendance ? markedAttendance[admNo] : true;
          });
        } else {
          filtered.forEach((student) => {
            const admNo = String(student.admissionNo).trim();
            finalAttendance[admNo] = true;
          });
        }
      } else {
        filtered.forEach((student) => {
          const admNo = String(student.admissionNo).trim();
          finalAttendance[admNo] = true;
        });
      }

      setAttendance(finalAttendance);
      setStudents(filtered);
    } catch (err) {
      console.error("Failed to fetch existing attendance.", err);
      const defaultAttendance = {};
      filtered.forEach((student) => {
        const admNo = String(student.admissionNo).trim();
        defaultAttendance[admNo] = true;
      });
      setAttendance(defaultAttendance);
      setStudents(filtered);
    }
  };

  const handleCheckboxChange = (admNo) => {
    setAttendance((prev) => ({
      ...prev,
      [String(admNo).trim()]: !prev[String(admNo).trim()],
    }));
  };

  const clearAll = () => {
    if (isAlreadyMarked) return;
    const updated = {};
    students.forEach((s) => {
      const admNo = String(s.admissionNo).trim();
      updated[admNo] = false;
    });
    setAttendance(updated);
  };

  const handleClearFilters = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedClass(null);
    setSelectedSection("All");
    setAttendanceDate(today);
    setSectionOptions(["All"]);
    setStudents([]);
    setAttendance({});
    setErrors({});
    setNoDataFound(false);
    setIsAlreadyMarked(false);
  };

  const presentCount = Object.values(attendance).filter((v) => v).length;
  const totalCount = students.length;
  const absentCount = totalCount - presentCount;

  const handleSubmitAttendance = async () => {
    const AdmNoPresentAbsentList = Object.entries(attendance)
      .map(
        ([admNo, isPresent]) => `${admNo}~${isPresent ? "Present" : "Absent"}`
      )
      .join(",");

    const payload = {
      AdmNoPresentAbsentList,
      AttendanceDate: attendanceDate,
      CreatedBy: createdBy,
      TrackingID: trackingId,
    };

    try {
      const res = await fetch(
        `${baseUrl}/api/Attendance/CreateStudentAttendance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        alert("Attendance submitted successfully!");
        handleClearFilters();
        setConfirmOpen(false);
      } else {
        alert("Attendance submission failed!");
      }
    } catch (error) {
      alert("Failed to submit attendance.");
    }
  };

  return (
    // JSX continues exactly as before...
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title="Student Attendance"
        links={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Attendance", href: "/attendance" },
        ]}
      />

      <Paper
        elevation={3}
        sx={{ p: 2, mb: 3, backgroundColor: theme.paperBg, mt: -1 }}
      >
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
          Student Attendance
        </Typography> */}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Class
            onClassChange={handleClassChange}
            value={selectedClass}
            label="Class Name"
            error={Boolean(errors.class)}
            helperText={errors.class}
          />

          <FilledAutocomplete
            options={sectionOptions}
            value={selectedSection}
            onChange={(_, newValue) => {
              if (newValue.includes("All")) {
                // If "Select All" chosen, select all except "All"
                setSelectedSection(
                  sectionOptions.filter((opt) => opt !== "All")
                );
              } else {
                setSelectedSection(newValue);
              }
            }}
            getOptionLabel={(option) =>
              option === "All" ? "Select All" : option
            }
            label="Section"
            fullWidth
            sx={{ minWidth: 120 }}
            popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
            clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          />

          <FilledTextField
            type="date"
            label="Attendance Date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            error={Boolean(errors.date)}
            helperText={errors.date}
            inputProps={{
              max: new Date().toISOString().split("T")[0], // ✅ Prevent future dates
            }}
            sx={{ minWidth: 180 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
          <Button variant="contained" onClick={handleShowStudents}>
            Show
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      {noDataFound && (
        <Paper
          elevation={3}
          sx={{ p: 3, backgroundColor: theme.paperBg, textAlign: "center" }}
        >
          <Typography sx={{ color: fontColor.paper }}>
            No data found for selected filters.
          </Typography>
        </Paper>
      )}
      {students.length > 0 && (
        <Paper
          elevation={3}
          sx={{ p: 2, mb: 3, backgroundColor: theme.paperBg }}
        >
          <SubHeaderLabel title="Mark Attendance" theme={theme} />

          {isAlreadyMarked && (
            <Typography sx={{ color: "orange", mb: 2 }}>
              Attendance has already been marked for this date.
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>
            <Typography color="primary">
              <strong>Total:</strong> {totalCount}
            </Typography>
            <Typography sx={{ color: "green" }}>
              <strong>Present:</strong> {presentCount}
            </Typography>
            <Typography sx={{ color: "red" }}>
              <strong>Absent:</strong> {absentCount}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              color="warning"
              onClick={clearAll}
            >
              Clear All
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ backgroundColor: theme.paperBg }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>
                    <strong>AdmNo / Roll</strong>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    <strong>Class</strong>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    <strong>Sec</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Student Name</strong>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    <strong>Father Name</strong>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    <strong>Mobile No</strong>
                  </TableCell>
                  <TableCell>
                    <strong>IsPresent</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => {
                  const admNo = String(student.admissionNo).trim();
                  const isPresent = !!attendance[admNo];
                  const rowStyle = {
                    backgroundColor: isPresent ? "inherit" : "#ffe6e6",
                  };
                  const textStyle = {
                    color: isPresent ? fontColor.paper : "black",
                  };
                  return (
                    <TableRow key={admNo} sx={rowStyle}>
                      <TableCell sx={textStyle}>
                        {student.admissionNo} / {student.rollNo}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...textStyle,
                          display: { xs: "none", sm: "table-cell" },
                        }}
                      >
                        {student.className}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...textStyle,
                          display: { xs: "none", sm: "table-cell" },
                        }}
                      >
                        {student.section}
                      </TableCell>
                      <TableCell sx={textStyle}>
                        {student.studentName}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...textStyle,
                          display: { xs: "none", sm: "table-cell" },
                        }}
                      >
                        {student.fatherName}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...textStyle,
                          display: { xs: "none", sm: "table-cell" },
                        }}
                      >
                        {student.mobileNo}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={!!attendance[admNo]}
                          onChange={() => handleCheckboxChange(admNo)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            color="success"
            onClick={() => setConfirmOpen(true)}
            sx={{ mt: 2 }}
          >
            {isAlreadyMarked ? "Update Attendance" : "Save Attendance"}
          </Button>
        </Paper>
      )}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle
          sx={{ backgroundColor: theme.paperBg, color: fontColor.paper }}
        >
          {isAlreadyMarked
            ? "Are you sure you want to update attendance?"
            : "Are you sure you want to submit attendance?"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.paperBg }}>
          <Typography sx={{ color: "green" }}>
            <strong>Present:</strong> {presentCount}
          </Typography>
          <Typography sx={{ color: "red" }}>
            <strong>Absent:</strong> {absentCount}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: theme.paperBg }}>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitAttendance}
            variant="contained"
            color="success"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentAttendanceForm;
