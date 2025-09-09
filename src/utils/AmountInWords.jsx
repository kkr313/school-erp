// AmountInWords.jsx
import React from "react";

// Convert number to words in Indian numbering system
const numberToWords = (num) => {
  if (num === 0) return "Zero";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const numberToWordsRecursive = (n) => {
    if (n === 0) return "";
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + numberToWordsRecursive(n % 100) : "")
      );
    if (n < 100000)
      return (
        numberToWordsRecursive(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + numberToWordsRecursive(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        numberToWordsRecursive(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + numberToWordsRecursive(n % 100000) : "")
      );
    return (
      numberToWordsRecursive(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + numberToWordsRecursive(n % 10000000) : "")
    );
  };

  return numberToWordsRecursive(num).trim().replace(/\s+/g, " ");
};

// Format as Rupees
const formatRupees = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "Invalid Amount";
  if (num < 0) return "Minus " + formatRupees(Math.abs(num));
  return `Rupees ${numberToWords(num)} Only /-`;
};

/**
 * Props:
 *   amount: number (required)
 *   className: string (optional)
 */
const AmountInWords = ({ amount, className }) => {
  return (
    <div className={`p-2 border border-black ${className || ""}`}>
      <strong>Amount in Words:</strong> {formatRupees(amount)}
    </div>
  );
};

export default AmountInWords;
