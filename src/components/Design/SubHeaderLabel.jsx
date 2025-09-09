import React from "react";
import { Typography } from "@mui/material";

const SubHeaderLabel = ({
  title = "Sub Header",
  variant = "h6",
  theme,
  sx = {},
}) => {
  return (
    <Typography
      variant={variant}
      display="inline-block"
      sx={{
        fontWeight: 600,
        color: theme?.formHeaderFontColor || "#333",
        fontFamily: theme?.formHeaderFontFamily || "Arial, sans-serif",
        mb: 3,
        border: "1px solid black",
        borderRadius: "20px",
        boxShadow: "2px 2px 3px grey",
        px: 2,
        py: 0.5,
        ...sx, // allow overriding styles
      }}
    >
      {title}
    </Typography>
  );
};

export default SubHeaderLabel;
