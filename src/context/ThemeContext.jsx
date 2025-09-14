// src/context/ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

// Helper: check if color is light or dark
const isColorDark = hex => {
  const c = hex.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 140;
};

// Default theme including header font color and font family
export const defaultTheme = {
  navbarBg: '#ffffff',
  sidebarBg: '#ffffff',
  formBg: '#ffffff',
  paperBg: '#ffffff',
  fontFamily: 'Arial',
  formHeaderFontColor: 'blue',
  formHeaderFontFamily: 'Arial',

  // Print header configuration
  printHeaderFontColor: '#000000',
  printHeaderFontFamily: 'Poppins',
  printSubHeaderFontColor: '#444444',
  printSubHeaderFontFamily: 'Poppins',
  printHeaderStyle: 'Style1', // could be: Style1, Style2, Classic, etc.
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  const fontColor = {
    navbar: isColorDark(theme.navbarBg) ? '#ffffff' : '#000000',
    sidebar: isColorDark(theme.sidebarBg) ? '#ffffff' : '#000000',
    form: isColorDark(theme.formBg) ? '#ffffff' : '#000000',
    paper: isColorDark(theme.paperBg) ? '#ffffff' : '#000000',
    formHeader: isColorDark(theme.formHeaderFontColor) ? '#ffffff' : '#000000',
    printHeader: isColorDark(theme.printHeaderFontColor)
      ? '#ffffff'
      : '#000000',
    printSubHeader: isColorDark(theme.printSubHeaderFontColor)
      ? '#ffffff'
      : '#000000',
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontColor, defaultTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
