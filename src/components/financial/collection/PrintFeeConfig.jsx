import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
} from "@mui/material";
import { useTheme } from "../../../context/ThemeContext";
import CustomBreadcrumb from "../../ui/navigation/CustomBreadcrumb";

const PrintFeeConfig = () => {
  const { theme, setTheme } = useTheme();

  const [localConfig, setLocalConfig] = useState({
    printCopyType: "Single Copy", // Default always Single Copy
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    message: "",
  });

  // Set default from theme OR fallback to Single Copy
  useEffect(() => {
    setLocalConfig({
      printCopyType: theme?.printCopyType || "Single Copy",
    });
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalConfig((prev) => ({ ...prev, [name]: value }));
  };

  const confirmAction = () => {
    setConfirmDialog({
      open: true,
      action: "save",
      message: "Do you want to apply this print config?",
    });
  };

  const handleConfirmed = () => {
    setTheme((prev) => ({
      ...prev,
      printCopyType: localConfig.printCopyType || "Single Copy", // Always fallback
    }));
    setConfirmDialog({ open: false, action: null, message: "" });
  };

  return (
    <>
      <CustomBreadcrumb
        title="Print Fee Config"
        links={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Configuration", href: "/configuration" },
        ]}
      />

      <Paper
        elevation={3}
        sx={{
          width: "95%",
          maxWidth: { sm: 480 },
          mx: "auto",
          mt: 2,
          p: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          🖨 Print Fee Config
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            select
            fullWidth
            label="Print Copy Type"
            name="printCopyType"
            value={localConfig.printCopyType}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            {["Single Copy", "Double Copy"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>

          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={confirmAction}
            >
              Save Print Config
            </Button>
          </Box>
        </Box>

        <Dialog
          open={confirmDialog.open}
          onClose={() =>
            setConfirmDialog({ open: false, action: null, message: "" })
          }
        >
          <DialogTitle>{confirmDialog.message}</DialogTitle>
          <DialogActions>
            <Button
              onClick={() =>
                setConfirmDialog({ open: false, action: null, message: "" })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmed} variant="contained" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default PrintFeeConfig;
