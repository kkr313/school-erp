import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme as useMuiTheme } from "@mui/material/styles";

import { useTheme } from "../context/ThemeContext";

import Class from "./Dropdown/Class";
import Gender from "./Dropdown/Gender";
import BloodGroup from "./Dropdown/BloodGroup";
import SchoolPeriod from "./Dropdown/SchoolPeriod";
import StudentType from "./Dropdown/StudentType";
import StudentStatus from "./Dropdown/StudentStatus";
import MonthlyFees from "./Fees/MonthlyFees";
import OneTimeFees from "./Fees/OneTimeFees";
import TransportFees from "./Fees/TransportFees";
import ParentDetails from "./ParentDetails";
import AdditionalDetails from "./AdditionalDetails";
import { usePrompt } from "../hooks/usePrompt";
import { useBeforeUnload } from "../hooks/useBeforeUnload";
import AdmissionPrintView from "./PrintPDF/AdmissionPrintView";
import FilledTextField from "../utils/FilledTextField";
import CustomBreadcrumb from "../utils/CustomBreadcrumb";
import GetReligion from "./Dropdown/GetReligion";
import GetCategory from "./Dropdown/GetCategory";
import GetStateDistrict from "./Dropdown/GetStateDistrict";
import GetState from "./Dropdown/GetState";
import GetDistrict from "./Dropdown/GetDistrict";

const Admission = () => {
  const { theme, fontColor } = useTheme();
  const muiTheme = useMuiTheme();

  const [formData, setFormData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const [admissionNo, setAdmissionNo] = useState(12345);
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [district, setDistrict] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [nationality, setNationality] = useState("");
  const [bloodGroup, setBloodGroup] = useState(null);
  const [schoolPeriod, setSchoolPeriod] = useState(null);
  const [studentType, setStudentType] = useState(null);
  const [studentStatus, setStudentStatus] = useState(null);
  const [religion, setReligion] = useState(null);
  const [category, setCategory] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Fees-related states
  const [monthlyFeeData, setMonthlyFeeData] = useState([]);
  const [oneTimeFeeData, setOneTimeFeeData] = useState([]);
  const [transportFeeData, setTransportFeeData] = useState([]);
  const [assignFees, setAssignFees] = useState(false);
  const [showMonthly, setShowMonthly] = useState(true);
  const [showOneTime, setShowOneTime] = useState(true);
  const [showTransport, setShowTransport] = useState(true);

  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [showParentDetails, setShowParentDetails] = useState(false);

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

  const isDirty = !!(
    dateOfAdmission ||
    rollNo ||
    studentName ||
    gender ||
    dob ||
    fatherName ||
    address ||
    selectedState ||
    district ||
    mobileNo ||
    nationality ||
    bloodGroup ||
    schoolPeriod ||
    studentType ||
    studentStatus ||
    religion ||
    category ||
    selectedClass ||
    selectedSection ||
    assignFees ||
    monthlyFeeData.length ||
    oneTimeFeeData.length ||
    transportFeeData.length ||
    showAdditionalDetails ||
    showParentDetails
  );

  const [printMode, setPrintMode] = useState(false);
  const printRef = useRef(null);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 300); // Allow DOM to update before print
  };

  usePrompt(
    "You have unsaved changes. Are you sure you want to leave this page?",
    isDirty
  );

  useBeforeUnload(isDirty);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      "Admission No": admissionNo,
      "Student Name": studentName,
      DOA: dateOfAdmission,
      Class: selectedClass?.label || "",
      Section: selectedSection || "",
      "Roll No": rollNo,
      Gender: gender,
      "Date of Birth": dob,
      "Father's Name": fatherName,
      Address: address,
      State: selectedState,
      District: district || "",
      "Mobile No": mobileNo,
      Nationality: nationality,
      "Blood Group": bloodGroup,
      "School Period": schoolPeriod,
      "Student Type": studentType,
      "Student Status": studentStatus,
      Religion: religion,
      Category: category,
      "Monthly Fees": monthlyFeeData,
      "One-Time Fees": oneTimeFeeData,
      "Transport Fees": transportFeeData,
    };

    setFormData(data);
    setModalOpen(true);
  };

  const resetForm = () => {
    setAdmissionNo((prev) => prev + 1);
    setDateOfAdmission("");
    setRollNo("");
    setStudentName("");
    setGender(null);
    setDob("");
    setFatherName("");
    setAddress("");
    setSelectedState("");
    setDistrict("");
    setMobileNo("");
    setNationality("");
    setBloodGroup(null);
    setSchoolPeriod(null);
    setStudentType(null);
    setStudentStatus(null);
    setReligion(null);
    setCategory(null);
    setSelectedClass(null);
    setSelectedSection("");
    setAssignFees(false);
    setMonthlyFeeData([]);
    setOneTimeFeeData([]);
    setTransportFeeData([]);
    setShowAdditionalDetails(false);
    setShowParentDetails(false);
    setShowMonthly(true);
    setShowOneTime(true);
    setShowTransport(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };
  const feeBoxStyle = {
    border: `1px solid ${fontColor.paper}`,
    borderRadius: "8px",
    boxShadow: 1,
    padding: "1rem 0",
    minWidth: "250px",
    flex: "1 1 30%", // Flexible layout for 3 columns
  };

  return (
    <>
      {/* Breadcrumb section - visually separated, no background wrapper */}
      <Box sx={{ width: '100%', mb: 0, pb: 0 }}>
        <CustomBreadcrumb
          title="Student Admission"
          links={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Admission", href: "/admission" },
          ]}
          animated={true}
        />
      </Box>

      {/* Main module section - full width, premium design */}
      <Box
        sx={{
          width: '100%',
          px: { xs: 0, sm: 0 },
          pt: 0,
          mt: 0,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: 900 },
            mx: "auto",
            mt: { xs: 1, sm: 1 },
            mb: { xs: 3, sm: 4 },
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 2.5 },
            background: 'rgba(255,255,255,0.98)',
            borderRadius: 2,
            boxShadow: '0 4px 20px 0 rgba(31,38,135,0.08)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
            transition: 'all 0.3s ease',
          }}
        >
        {/* <Typography
          variant="h4"
          align="center"
          mb={4}
          sx={{
            color: theme.formHeaderFontColor,
            fontFamily: theme.formHeaderFontFamily,
            fontWeight: 600,
          }}
        >
          Admission Form
        </Typography> */}

        <Box
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit}
          sx={(theme) => ({
            display: "grid",
            gap: "0.8rem",
            width: "100%",
            gridTemplateColumns: "1fr",

            [theme.breakpoints.up("sm")]: {
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            },

            [theme.breakpoints.up("md")]: {
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.2rem",
            },

            "& > *": {
              gridColumn: "span 1",
              width: "100%",
            },

            // Special spanning for certain fields
            "& .span-2": {
              [theme.breakpoints.up("sm")]: {
                gridColumn: "span 2",
              },
            },
            
            "& .span-3": {
              [theme.breakpoints.up("md")]: {
                gridColumn: "span 3",
              },
            },
          })}
        >
          {" "}
          <FilledTextField
            label="Admission No."
            value={admissionNo}
            fullWidth
            InputProps={{ readOnly: true }}
            required
          />
          <FilledTextField
            label="Date of Admission"
            type="date"
            value={dateOfAdmission}
            onChange={(e) => setDateOfAdmission(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split("T")[0] }}
            fullWidth
            required
          />
          <Class value={selectedClass} onClassChange={setSelectedClass} />
          <FilledTextField
            label="Section"
            value={selectedSection}
            onChange={(e) => {
              const raw = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
              const trimmed = raw.slice(0, 2); // Max 2 characters
              setSelectedSection(trimmed);
            }}
            fullWidth
          />
          <FilledTextField
            label="Roll No."
            value={rollNo}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,3}$/.test(value)) setRollNo(value);
            }}
            error={rollNo !== "" && !/^\d{1,3}$/.test(rollNo)}
            helperText={
              rollNo !== "" && !/^\d{1,3}$/.test(rollNo)
                ? "Enter up to 3 digits only"
                : ""
            }
            fullWidth
          />
          <FilledTextField
            label="Student Name"
            value={studentName}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[A-Za-z\s]{0,30}$/.test(value)) setStudentName(value);
            }}
            error={
              studentName !== "" && !/^[A-Za-z\s]{1,30}$/.test(studentName)
            }
            helperText={
              studentName !== "" && !/^[A-Za-z\s]{1,30}$/.test(studentName)
                ? "Alphabets only, max 30 characters"
                : ""
            }
            fullWidth
            required
          />
          
          {/* Personal Information Section */}
          <Box className="span-3" sx={{ 
            borderTop: '1px solid #e2e8f0', 
            pt: 1.5, 
            mt: 1, 
            mb: 0.5,
            position: 'relative',
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                position: 'absolute', 
                top: -10, 
                left: 12, 
                bgcolor: 'white', 
                px: 1, 
                color: '#64748b',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              Personal Information
            </Typography>
          </Box>

          <Gender value={gender} onChange={setGender} />
          <FilledTextField
            label="Date of Birth"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: new Date(
                new Date().setFullYear(new Date().getFullYear() - 3)
              )
                .toISOString()
                .split("T")[0],
            }}
            fullWidth
            required
          />
          <FilledTextField
            label="Father's Name"
            value={fatherName}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[A-Za-z\s]{0,30}$/.test(value)) setFatherName(value);
            }}
            error={fatherName !== "" && !/^[A-Za-z\s]{1,30}$/.test(fatherName)}
            helperText={
              fatherName !== "" && !/^[A-Za-z\s]{1,30}$/.test(fatherName)
                ? "Alphabets only, max 30 characters"
                : ""
            }
            fullWidth
            required
          />
          {/* Address & Contact Section */}
          <Box className="span-3" sx={{ 
            borderTop: '1px solid #e2e8f0', 
            pt: 1.5, 
            mt: 1.5, 
            mb: 0.5,
            position: 'relative',
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                position: 'absolute', 
                top: -10, 
                left: 12, 
                bgcolor: 'white', 
                px: 1, 
                color: '#64748b',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              Address & Contact
            </Typography>
          </Box>

          <FilledTextField
            className="span-2"
            label="Address"
            value={address}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 100) setAddress(value);
            }}
            helperText={`${address.length}/100`}
            fullWidth
            required
          />
          <FilledTextField
            label="Mobile No."
            value={mobileNo}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) setMobileNo(value);
            }}
            error={mobileNo !== "" && !/^\d{10}$/.test(mobileNo)}
            helperText={
              mobileNo !== "" && !/^\d{10}$/.test(mobileNo)
                ? "Enter a 10-digit mobile number"
                : ""
            }
            fullWidth
            required
          />
          <GetState value={selectedState} onChange={setSelectedState} />
          <GetDistrict
            stateValue={selectedState}
            value={district}
            onChange={setDistrict}
          />
          <FilledTextField
            label="Nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            fullWidth
            required
          />

          {/* Additional Information Section */}
          <Box className="span-3" sx={{ 
            borderTop: '1px solid #e2e8f0', 
            pt: 1.5, 
            mt: 1.5, 
            mb: 0.5,
            position: 'relative',
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                position: 'absolute', 
                top: -10, 
                left: 12, 
                bgcolor: 'white', 
                px: 1, 
                color: '#64748b',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              Additional Information
            </Typography>
          </Box>

          <BloodGroup value={bloodGroup} onChange={setBloodGroup} />
          <SchoolPeriod value={schoolPeriod} onChange={setSchoolPeriod} />
          <StudentType value={studentType} onChange={setStudentType} />
          <StudentStatus value={studentStatus} onChange={setStudentStatus} />
          <GetReligion value={religion} onReligionChange={setReligion} />
          <GetCategory value={category} onCategoryChange={setCategory} />
          {/* Assign Fees Accordion */}
          <Accordion
            disabled={!selectedClass}
            className="span-3"
            sx={{
              bgcolor: theme.paperBg,
              opacity: !selectedClass ? 0.6 : 1,
              border: `1px solid rgba(226, 232, 240, 0.8)`,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              "&:before": { display: "none" },
              mb: 1,
            }}
          >
            <AccordionSummary
              sx={{ 
                backgroundColor: "#f8fafc",
                borderRadius: '8px 8px 0 0',
                minHeight: 48,
                '& .MuiAccordionSummary-content': {
                  my: 0.5,
                },
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 500 }}>Assign Fees</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {!selectedClass ? (
                <Typography
                  sx={{ color: fontColor.paper, fontStyle: "italic" }}
                >
                  Please select a class to assign fees.
                </Typography>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      flexWrap: "wrap",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showMonthly}
                          onChange={(e) => setShowMonthly(e.target.checked)}
                          sx={{ color: fontColor.paper }}
                        />
                      }
                      label="Monthly Fees"
                      sx={{ color: fontColor.paper }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showOneTime}
                          onChange={(e) => setShowOneTime(e.target.checked)}
                          sx={{ color: fontColor.paper }}
                        />
                      }
                      label="One-Time Fees"
                      sx={{ color: fontColor.paper }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showTransport}
                          onChange={(e) => setShowTransport(e.target.checked)}
                          sx={{ color: fontColor.paper }}
                        />
                      }
                      label="Transport Fees"
                      sx={{ color: fontColor.paper }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {showMonthly && (
                      <Box sx={feeBoxStyle}>
                        <Typography
                          variant="h6"
                          textAlign="center"
                          sx={{ color: fontColor.paper }}
                        >
                          Monthly Fees
                        </Typography>
                        <MonthlyFees
                          classId={selectedClass?.value}
                          onFeeChange={setMonthlyFeeData}
                        />
                      </Box>
                    )}

                    {showOneTime && (
                      <Box sx={feeBoxStyle}>
                        <Typography
                          variant="h6"
                          textAlign="center"
                          sx={{ color: fontColor.paper }}
                        >
                          One-Time Fees
                        </Typography>
                        <OneTimeFees
                          classId={selectedClass?.value}
                          onFeeChange={setOneTimeFeeData}
                        />
                      </Box>
                    )}

                    {showTransport && (
                      <Box sx={feeBoxStyle}>
                        <Typography
                          variant="h6"
                          textAlign="center"
                          sx={{ color: fontColor.paper }}
                        >
                          Transport Fees
                        </Typography>
                        <TransportFees
                          classId={selectedClass?.value}
                          onFeeChange={setTransportFeeData}
                        />
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </AccordionDetails>
          </Accordion>
          {/* Additional Details Accordion */}
          <Accordion
            className="span-3"
            sx={{
              bgcolor: theme.paperBg,
              border: `1px solid rgba(226, 232, 240, 0.8)`,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              "&:before": { display: "none" },
              mb: 1,
            }}
          >
            <AccordionSummary
              sx={{ 
                backgroundColor: "#f8fafc",
                borderRadius: '8px 8px 0 0',
                minHeight: 48,
                '& .MuiAccordionSummary-content': {
                  my: 0.5,
                },
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 500 }}>Additional Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AdditionalDetails
                formData={formData}
                setFormData={setFormData}
              />
            </AccordionDetails>
          </Accordion>
          {/* Parent Details Accordion */}
          <Accordion
            className="span-3"
            sx={{
              bgcolor: theme.paperBg,
              border: `1px solid rgba(226, 232, 240, 0.8)`,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              "&:before": { display: "none" },
              mb: 1,
            }}
          >
            <AccordionSummary
              sx={{ 
                backgroundColor: "#f8fafc",
                borderRadius: '8px 8px 0 0',
                minHeight: 48,
                '& .MuiAccordionSummary-content': {
                  my: 0.5,
                },
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 500 }}>Parent Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ParentDetails />
            </AccordionDetails>
          </Accordion>
          <Box className="span-3" sx={{ textAlign: "center", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              sx={{
                px: 4,
                py: 1.2,
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(59,130,246,0.12)',
                background: 'linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)',
                color: '#fff',
                textTransform: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)',
                  boxShadow: '0 4px 16px rgba(59,130,246,0.18)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Submit Admission
            </Button>
          </Box>
        </Box>

        <Dialog
          open={modalOpen}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: theme.paperBg,
              color: fontColor.paper,
            },
          }}
        >
          {!printMode && (
            <DialogTitle sx={{ color: fontColor.paper }}>
              Submitted Admission Details
            </DialogTitle>
          )}

          <DialogContent
            dividers
            sx={{
              borderTop: `1px solid ${fontColor.paper}`,
              borderBottom: `1px solid ${fontColor.paper}`,
              px: 2,
            }}
          >
            {!printMode ? (
              <div ref={printRef}>
                {Object.entries(formData).map(([label, value]) => {
                  const isFeeArray = [
                    "Monthly Fees",
                    "One-Time Fees",
                    "Transport Fees",
                  ].includes(label);
                  return (
                    <Typography
                      key={label}
                      gutterBottom
                      sx={{ color: fontColor.paper }}
                    >
                      <strong>{label}:</strong>{" "}
                      {Array.isArray(value) && isFeeArray ? (
                        value.length > 0 ? (
                          <ul style={{ paddingLeft: "1rem", marginTop: "4px" }}>
                            {value.map((item, index) => (
                              <li key={index}>
                                {Object.values(item).join(", ")}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "-"
                        )
                      ) : (
                        value || "-"
                      )}
                    </Typography>
                  );
                })}
              </div>
            ) : (
              <div ref={printRef}>
                <AdmissionPrintView data={formData} fontColor={fontColor} />
              </div>
            )}
          </DialogContent>

          <DialogActions sx={{ backgroundColor: theme.paperBg }}>
            <Button onClick={handlePrint} color="secondary" variant="outlined">
              Print
            </Button>
            <Button
              onClick={handleCloseModal}
              color="primary"
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        </Box>
      </Box>
    </>
  );
};

export default Admission;
