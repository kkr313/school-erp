import React from "react";
import { Typography } from "@mui/material";

const HeaderLabel = ({
  title = "Header Title",
  variant = "h5",
  align = "center",
  sx = {},
  theme,
}) => {
  return (
    <Typography
      variant={variant}
      align={align}
      display={"inline-block"}
      sx={{
        fontWeight: 600,
        color: theme?.formHeaderFontColor || "#333",
        fontFamily: theme?.formHeaderFontFamily || "Arial, sans-serif",
        mb: 3,
        px: 3,
        py: 0.5,
        backgroundColor: "#f5f5f5",
        boxShadow: "5px 5px 6px rgba(0,0,0,.5)",
        ...sx, // Allow overriding styles
      }}
    >
      {title}
    </Typography>
  );
};

export default HeaderLabel;
