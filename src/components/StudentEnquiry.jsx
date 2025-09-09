import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Autocomplete,
  FormControl,
  Paper,
  Box,
} from "@mui/material";
import Class from "./Dropdown/Class";
import { useTheme } from "../context/ThemeContext";
import { usePrompt } from "../hooks/usePrompt";
import { useBeforeUnload } from "../hooks/useBeforeUnload";
import FilledTextField from "../utils/FilledTextField";
import FilledAutocomplete from "../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import CustomBreadcrumb from "../utils/CustomBreadcrumb";
import HeaderLabel from "./Design/HeaderLabel";

const StudentEnquiry = () => {
  const { theme, fontColor } = useTheme();

  const [formData, setFormData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const [enquiryNo, setEnquiryNo] = useState(1001);
  const [doe, setDoe] = useState("");
  const [studentName, setStudentName] = useState("");
  const [gender, setGender] = useState(null);
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [prevClass, setPrevClass] = useState(null);
  const [prevSchoolName, setPrevSchoolName] = useState("");
  const [prevSchoolAddress, setPrevSchoolAddress] = useState("");
  const [enquiryClass, setEnquiryClass] = useState(null);
  const [whenToCome, setWhenToCome] = useState("");
  const [remarks, setRemarks] = useState("");

  const genderOptions = ["Male", "Female", "Other"];
  const today = new Date().toISOString().split("T")[0];

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: fontColor.paper },
      "&:hover fieldset": { borderColor: fontColor.paper },
      "&.Mui-focused fieldset": { borderColor: fontColor.paper },
    },
    "& .MuiInputLabel-root": { color: fontColor.paper },
    "& .MuiFormHelperText-root": { color: fontColor.paper },
  };

  const isDirty = !!(
    doe ||
    studentName ||
    gender ||
    fatherName ||
    motherName ||
    address ||
    mobileNo ||
    email ||
    prevClass ||
    prevSchoolName ||
    prevSchoolAddress ||
    enquiryClass ||
    whenToCome ||
    remarks
  );

  // Prompt if the form is dirty and not yet submitted
  usePrompt(
    "You have unsaved changes. Are you sure you want to leave this page?",
    isDirty
  );

  // Warn on browser/tab close
  useBeforeUnload(isDirty);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      "Enquiry No": enquiryNo,
      "Date of Enquiry": doe,
      "Student Name": studentName,
      Gender: gender,
      "Father's Name": fatherName,
      "Mother's Name": motherName,
      Address: address,
      "Mobile No": mobileNo,
      Email: email,
      "Previous Class Name": prevClass?.label || "",
      "Previous School Name": prevSchoolName,
      "Previous School Address": prevSchoolAddress,
      "Enquiry Class": enquiryClass?.label || "",
      "When to Come": whenToCome,
      Remarks: remarks,
    };

    setFormData(data);
    setModalOpen(true);
  };

  const resetForm = () => {
    setEnquiryNo((prev) => prev + 1);
    setDoe("");
    setStudentName("");
    setGender(null);
    setFatherName("");
    setMotherName("");
    setAddress("");
    setMobileNo("");
    setEmail("");
    setPrevClass(null);
    setPrevSchoolName("");
    setPrevSchoolAddress("");
    setEnquiryClass(null);
    setWhenToCome("");
    setRemarks("");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // full viewport height
        backgroundColor: theme.bodyBg, // optional: to ensure visual contrast
        px: { xs: 2, sm: 2 },
        py: { xs: 1, sm: 0 },
      }}
    >
      <CustomBreadcrumb
        title="Student Enquiry"
        links={[{ label: "Dashboard", href: "/dashboard" }]}
      />

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "1000px" },
          mx: "auto",
          backgroundColor: theme.paperBg,
          color: fontColor.paper,
          fontFamily: theme.fontFamily,
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          mt: -1,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <FilledTextField
            label="Enquiry No."
            fullWidth
            value={enquiryNo}
            InputProps={{ readOnly: true }}
          />

          <FilledTextField
            type="date"
            label="Date of Enquiry"
            fullWidth
            required
            value={doe}
            onChange={(e) => setDoe(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: today }}
          />

          <FilledTextField
            label="Student Name"
            fullWidth
            required
            value={studentName}
            onChange={(e) =>
              /^[A-Za-z\s]{0,30}$/.test(e.target.value) &&
              setStudentName(e.target.value)
            }
            error={
              studentName !== "" && !/^[A-Za-z\s]{1,30}$/.test(studentName)
            }
            helperText={
              studentName !== "" && !/^[A-Za-z\s]{1,30}$/.test(studentName)
                ? "Only alphabets, max 30 characters"
                : ""
            }
          />

          <FormControl fullWidth required>
            <FilledAutocomplete
              label="Gender"
              value={gender}
              onChange={(e, newValue) => setGender(newValue)}
              required
              options={genderOptions}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option?.label || ""
              }
              isOptionEqualToValue={(option, value) => option === value}
              popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
              clearIcon={<Clear sx={{ color: fontColor.paper }} />}
            />
          </FormControl>

          <FilledTextField
            label="Father's Name"
            fullWidth
            required
            value={fatherName}
            onChange={(e) =>
              /^[A-Za-z\s]{0,30}$/.test(e.target.value) &&
              setFatherName(e.target.value)
            }
            error={fatherName !== "" && !/^[A-Za-z\s]{1,30}$/.test(fatherName)}
            helperText={
              fatherName !== "" && !/^[A-Za-z\s]{1,30}$/.test(fatherName)
                ? "Only alphabets, max 30 characters"
                : ""
            }
          />

          <FilledTextField
            label="Mother's Name"
            fullWidth
            required
            value={motherName}
            onChange={(e) =>
              /^[A-Za-z\s]{0,30}$/.test(e.target.value) &&
              setMotherName(e.target.value)
            }
            error={motherName !== "" && !/^[A-Za-z\s]{1,30}$/.test(motherName)}
            helperText={
              motherName !== "" && !/^[A-Za-z\s]{1,30}$/.test(motherName)
                ? "Only alphabets, max 30 characters"
                : ""
            }
          />

          <FilledTextField
            label="Address"
            fullWidth
            required
            value={address}
            onChange={(e) =>
              e.target.value.length <= 100 && setAddress(e.target.value)
            }
            helperText={`${address.length}/100`}
          />

          <FilledTextField
            label="Mobile No."
            fullWidth
            required
            value={mobileNo}
            onChange={(e) =>
              /^\d{0,10}$/.test(e.target.value) && setMobileNo(e.target.value)
            }
            error={mobileNo !== "" && !/^\d{10}$/.test(mobileNo)}
            helperText={
              mobileNo !== "" && !/^\d{10}$/.test(mobileNo)
                ? "Enter a 10-digit number"
                : ""
            }
          />

          <FilledTextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
            helperText={
              email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? "Enter a valid email"
                : ""
            }
          />

          <Class
            value={prevClass}
            onClassChange={setPrevClass}
            label="Previous Class"
          />

          <FilledTextField
            label="Previous School Name"
            fullWidth
            value={prevSchoolName}
            onChange={(e) =>
              e.target.value.length <= 50 && setPrevSchoolName(e.target.value)
            }
          />

          <FilledTextField
            label="Previous School Address"
            fullWidth
            value={prevSchoolAddress}
            onChange={(e) =>
              e.target.value.length <= 100 &&
              setPrevSchoolAddress(e.target.value)
            }
            helperText={`${prevSchoolAddress.length}/100`}
          />

          <Class
            value={enquiryClass}
            onClassChange={setEnquiryClass}
            label="Enquiry Class"
          />

          <FilledTextField
            type="date"
            label="When to Come"
            fullWidth
            value={whenToCome}
            onChange={(e) => setWhenToCome(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: today }}
          />

          <FilledTextField
            label="Remarks"
            fullWidth
            value={remarks}
            onChange={(e) =>
              e.target.value.length <= 100 && setRemarks(e.target.value)
            }
            helperText={`${remarks.length}/100`}
          />

          <Box sx={{ gridColumn: "1 / -1", textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Submit Enquiry
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
              fontFamily: theme.fontFamily,
            },
          }}
        >
          <DialogTitle>Submitted Enquiry Details</DialogTitle>
          <DialogContent
            dividers
            sx={{
              borderTop: `1px solid ${fontColor.paper}`,
              borderBottom: `1px solid ${fontColor.paper}`,
            }}
          >
            {Object.entries(formData).map(([label, value]) => (
              <Typography key={label} gutterBottom>
                <strong>{label}:</strong> {value || "-"}
              </Typography>
            ))}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModal}
              color="primary"
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default StudentEnquiry;
