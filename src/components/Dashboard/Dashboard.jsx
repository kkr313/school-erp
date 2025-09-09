import React from "react";
import { Box } from "@mui/material";
import { MdAdminPanelSettings, MdReceipt, MdSchool } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import {
  People as AttendanceIcon,
  EventNote as TimetableIcon,
  Assignment as ExamIcon,
  CalendarMonth as CalendarIcon,
  Article as NewsIcon,
  MenuBook as HomeworkIcon,
  Assessment as ExamResultIcon,
  Settings as SettingsIcon,
  Tune as ConfigurationIcon,
} from "@mui/icons-material";
import ModernDashboardCard from "../ModernDashboardCard";

const features = [
  {
    label: "Collection",
    icon: <FaWallet />,
    color: "#059669",
    path: "/collection",
    description: "Manage fee collections"
  },
  { 
    label: "Expenses", 
    icon: <FaWallet />, 
    color: "#dc2626", 
    path: "/expense",
    description: "Track school expenses"
  },
  {
    label: "Demand Bill",
    icon: <MdReceipt />,
    color: "#f97316",
    path: "/demand-bill",
    description: "Generate bills"
  },
  {
    label: "Attendance",
    icon: <AttendanceIcon fontSize="inherit" />,
    color: "#ff6b6b",
    path: "/attendance",
    description: "Student attendance"
  },
  {
    label: "Admission",
    icon: <MdSchool />,
    color: "#16a34a",
    path: "/admission",
    description: "New student admissions"
  },
  {
    label: "Student Enquiry",
    icon: <BsPersonLinesFill />,
    color: "#ca8a04",
    path: "/student-enquiry",
    description: "Handle enquiries"
  },
  {
    label: "Report",
    icon: <HiDocumentReport />,
    color: "#0ea5e9",
    path: "/report",
    description: "Analytics & reports"
  },
  {
    label: "Admin",
    icon: <MdAdminPanelSettings />,
    color: "#9333ea",
    path: "/admin",
    description: "System administration"
  },
  {
    label: "Exam",
    icon: <ExamIcon fontSize="inherit" />,
    color: "#3498db",
    path: "/exam",
    description: "Examination management"
  },
  {
    label: "Timetable",
    icon: <TimetableIcon fontSize="inherit" />,
    color: "#e84393",
    path: "/timetable",
    description: "Class schedules"
  },
  {
    label: "Calendar",
    icon: <CalendarIcon fontSize="inherit" />,
    color: "#e67e22",
    path: "/calendar",
    description: "Academic calendar"
  },
  {
    label: "News",
    icon: <NewsIcon fontSize="inherit" />,
    color: "#2ecc71",
    path: "/news",
    description: "School announcements"
  },
  {
    label: "Homework",
    icon: <HomeworkIcon fontSize="inherit" />,
    color: "#9b59b6",
    path: "/homework",
    description: "Assignment tracking"
  },
  {
    label: "Exam Result",
    icon: <ExamResultIcon fontSize="inherit" />,
    color: "#34495e",
    path: "/exam-result",
    description: "Results & grades"
  },
  {
    label: "Settings",
    icon: <SettingsIcon fontSize="inherit" />,
    color: "#e74c3c",
    path: "/settings",
    description: "App preferences"
  },
  {
    label: "Configuration",
    icon: <ConfigurationIcon fontSize="inherit" />,
    color: "#16a085",
    path: "/configuration",
    description: "System setup"
  },
];

const Dashboard = () => {
  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 1 } }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 2, sm: 3 },
          justifyContent: { xs: "space-around", md: "flex-start" },
          alignItems: "stretch",
        }}
      >
        {features.map((feature, index) => (
          <ModernDashboardCard
            key={feature.label}
            label={feature.label}
            icon={feature.icon}
            color={feature.color}
            path={feature.path}
            description={feature.description}
            badge={feature.badge}
            index={index}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
