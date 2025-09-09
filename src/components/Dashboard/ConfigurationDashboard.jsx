// src/components/ConfigurationDashboard.jsx
import React from "react";
import { Box } from "@mui/material";
import {
  Settings as SettingsIcon,
  Tune as TuneIcon,
} from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import CustomBreadcrumb from "../../utils/CustomBreadcrumb";
import ModernDashboardCard from "../ModernDashboardCard";

const configMenus = [
  {
    label: "Main Config",
    icon: <SettingsIcon fontSize="inherit" />,
    color: "#e74c3c",
    path: "/configuration/main",
    description: "Theme & appearance settings"
  },
  {
    label: "Header Config",
    icon: <TuneIcon fontSize="inherit" />,
    color: "#16a085",
    path: "/configuration/header",
    description: "Header customization"
  },
  {
    label: "Print Header Config",
    icon: <PrintIcon fontSize="inherit" />,
    color: "#2980b9",
    path: "/configuration/print-header",
    description: "Print layout settings"
  },
];

const ConfigurationDashboard = () => {

  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title="Configuration Dashboard"
        links={[{ label: "Dashboard", href: "/dashboard" }]}
      />

      {/* <Typography
        variant="h4"
        gutterBottom
        className="text-center md:text-left"
        sx={{
          marginBottom: 2,
          fontSize: { xs: "1.8rem", sm: "2.15rem" },
          color: theme.formHeaderFontColor,
          fontFamily: theme.formHeaderFontFamily,
          fontWeight: 600,
        }}
      >
        Configuration Dashboard
      </Typography> */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 2, sm: 3 },
          justifyContent: { xs: "space-around", md: "flex-start" },
          mt: -1,
          alignItems: "stretch",
        }}
      >
        {configMenus.map((menu, index) => (
          <ModernDashboardCard
            key={menu.label}
            label={menu.label}
            icon={menu.icon}
            color={menu.color}
            path={menu.path}
            description={menu.description}
            index={index}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ConfigurationDashboard;
