// hooks/usePrint.js
import { useState, useRef } from "react";

export const usePrint = (printDelay = 300) => {
  const [printMode, setPrintMode] = useState(false);
  const printRef = useRef(null);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, printDelay);
  };

  return { printMode, printRef, handlePrint };
};
