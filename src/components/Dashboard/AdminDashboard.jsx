import React from "react";
import { Box } from "@mui/material";
import {
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaBus,
  FaUserTie,
} from "react-icons/fa";
import CustomBreadcrumb from "../../utils/CustomBreadcrumb";
import ModernDashboardCard from "../ModernDashboardCard";

const adminFeatures = [
  {
    label: "Class Admin",
    icon: <FaChalkboardTeacher />,
    color: "#22c55e",
    path: "/master/class",
    description: "Manage classes & sections"
  },
  {
    label: "Fee Head Admin",
    icon: <FaMoneyBillWave />,
    color: "#2563eb",
    path: "/master/fee-head",
    description: "Configure fee structures"
  },
  {
    label: "Transport Admin",
    icon: <FaBus />,
    color: "#f97316",
    path: "/master/transport",
    description: "Bus routes & transport"
  },
  {
    label: "Employee Admin",
    icon: <FaUserTie />,
    color: "#9333ea",
    path: "/master/employee",
    description: "Staff management"
  },
];

const AdminDashboard = () => {
  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title="Admin Dashboard"
        showHome={true}
        variant="compact"
        animated={true}
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
        Admin Dashboard
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
        {adminFeatures.map((feature, index) => (
          <ModernDashboardCard
            key={feature.label}
            label={feature.label}
            icon={feature.icon}
            color={feature.color}
            path={feature.path}
            description={feature.description}
            index={index}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
