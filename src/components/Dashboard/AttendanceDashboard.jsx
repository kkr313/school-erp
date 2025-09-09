import React from "react";
import { Box } from "@mui/material";
import { FaUserCheck, FaListAlt } from "react-icons/fa";
import CustomBreadcrumb from "../../utils/CustomBreadcrumb";
import ModernDashboardCard from "../ModernDashboardCard";

const attendanceFeatures = [
  {
    label: "Mark Attendance",
    icon: <FaUserCheck size={40} />,
    color: "#16a34a",
    path: "/attendance/mark",
    description: "Record daily attendance"
  },
  {
    label: "Attendance Report",
    icon: <FaListAlt size={40} />,
    color: "#2563eb",
    path: "/attendance/report",
    description: "View attendance reports"
  },
  {
    label: "Monthly Attendance Report",
    icon: <FaListAlt size={40} />,
    color: "#f59e0b",
    path: "/attendance/report-monthly",
    description: "Monthly statistics"
  },
];

const AttendanceDashboard = () => {

  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title="Attendance Dashboard"
        links={[{ label: "Dashboard", href: "/dashboard" }]}
      />

      {/* <Typography
        variant="h4"
        gutterBottom
        className="text-center md:text-left"
        sx={{
          mb: 2,
          fontSize: { xs: "1.8rem", sm: "2.15rem" },
          color: theme.formHeaderFontColor,
          fontFamily: theme.formHeaderFontFamily,
          fontWeight: 600,
        }}
      >
        Attendance Dashboard
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
        {attendanceFeatures.map((feature, index) => (
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

export default AttendanceDashboard;
