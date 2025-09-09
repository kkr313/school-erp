import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import { usePrompt } from "../../hooks/usePrompt";
import { useBeforeUnload } from "../../hooks/useBeforeUnload";
import FilledTextField from "../../utils/FilledTextField";
import FilledAutocomplete from "../../utils/FilledAutocomplete";
import { Clear, ArrowDropDown } from "@mui/icons-material";
import CustomBreadcrumb from "../../utils/CustomBreadcrumb";

const FeeHeadMaster = () => {
  const { theme, fontColor } = useTheme();

  const [feeHeadName, setFeeHeadName] = useState("");
  const [feesType, setFeesType] = useState("");
  const [feeHeads, setFeeHeads] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState({});

  const feeTypes = ["Monthly Fee", "Admission Time Fee", "Other Fee"];

  // ✅ Detect if form is dirty (and not in edit mode)
  const isDirty = !!feeHeadName || !!feesType;
  usePrompt(
    "You have unsaved changes. Are you sure you want to leave this page?",
    isDirty && selectedIndex === null
  );

  useBeforeUnload(isDirty);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("feeHeads")) || [];
    setFeeHeads(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("feeHeads", JSON.stringify(feeHeads));
  }, [feeHeads]);

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

  const validate = () => {
    const newErrors = {};
    if (!feeHeadName.trim())
      newErrors.feeHeadName = "Fee Head Name is required";
    if (!feesType) newErrors.feesType = "Fees Type is required";

    const isDuplicateName = feeHeads.some(
      (f, idx) =>
        f.feeHeadName.toLowerCase() === feeHeadName.trim().toLowerCase() &&
        idx !== selectedIndex
    );
    if (isDuplicateName) newErrors.feeHeadName = "Fee Head already exist";

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const newEntry = { feeHeadName: feeHeadName.trim(), feesType };
    if (selectedIndex !== null) {
      const updated = [...feeHeads];
      updated[selectedIndex] = newEntry;
      setFeeHeads(updated);
    } else {
      setFeeHeads([...feeHeads, newEntry]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFeeHeadName("");
    setFeesType("");
    setSelectedIndex(null);
    setErrors({});
  };

  const handleDelete = () => {
    if (selectedIndex !== null) {
      const updated = [...feeHeads];
      updated.splice(selectedIndex, 1);
      setFeeHeads(updated);
      resetForm();
      setConfirmDelete(false);
    }
  };

  const handleRowDoubleClick = (index) => {
    const selected = feeHeads[index];
    setFeeHeadName(selected.feeHeadName);
    setFeesType(selected.feesType);
    setSelectedIndex(index);
    setErrors({});
  };

  return (
    <>
      <Box
        sx={{
          px: { xs: 2, sm: 2 },
          py: { xs: 1, sm: 0 },
        }}
      >
        <CustomBreadcrumb
          title="Fee Head Master"
          links={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Admin", href: "/admin" },
          ]}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          p: 3,
          mt: -4,
          alignItems: "flex-start",
          minHeight: "100%",
          backgroundColor: theme.bodyBg,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            minWidth: 350,
            maxWidth: 400,
            flexShrink: 0,
            height: "fit-content",
            backgroundColor: theme.paperBg,
            color: fontColor.paper,
            borderRadius: 2,
          }}
        >
          {/* <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: theme.formHeaderFontColor,
              fontFamily: theme.formHeaderFontFamily,
            }}
          >
            Fee Head Detail Master
          </Typography> */}

          <FilledTextField
            label="Name of Fee Head"
            value={feeHeadName}
            onChange={(e) => setFeeHeadName(e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!errors.feeHeadName}
            helperText={errors.feeHeadName}
          />

          <FilledAutocomplete
            options={feeTypes}
            value={feesType}
            onChange={(_, val) => setFeesType(val)}
            label="Fees Type"
            error={!!errors.feesType}
            helperText={errors.feesType}
            required
            popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
            clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          />

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            {selectedIndex === null ? (
              <Button variant="contained" fullWidth onClick={handleSave}>
                Save
              </Button>
            ) : (
              <>
                <Button variant="contained" fullWidth onClick={handleSave}>
                  Update
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            flex: 1,
            minWidth: { xs: "100%", md: 300 },
            minHeight: { xs: "100%", md: 250 },
            backgroundColor: theme.paperBg,
            color: fontColor.paper,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, color: fontColor.paper }}
          >
            Saved Fee Heads
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ backgroundColor: theme.paperBg }}
          >
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ color: "black" }}>
                    <strong>Fee Head</strong>
                  </TableCell>
                  <TableCell sx={{ color: "black" }}>
                    <strong>Fees Type</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feeHeads.map((fee, idx) => (
                  <TableRow
                    key={idx}
                    hover
                    onDoubleClick={() => handleRowDoubleClick(idx)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell sx={{ color: fontColor.paper }}>
                      {fee.feeHeadName}
                    </TableCell>
                    <TableCell sx={{ color: fontColor.paper }}>
                      {fee.feesType}
                    </TableCell>
                  </TableRow>
                ))}
                {feeHeads.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ color: fontColor.paper }}
                    >
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          PaperProps={{
            sx: {
              backgroundColor: theme.paperBg,
              color: fontColor.paper,
            },
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Do you want to delete the Fee Head?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default FeeHeadMaster;
