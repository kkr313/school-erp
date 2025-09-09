// src/utils/useApi.js
import { useState, useCallback } from "react";

const API_BASE = "https://teo-vivekanadbihar.co.in/TEO-School-API";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (endpoint, body = {}) => {
    setLoading(true);
    setError(null);

    try {
      const schoolCode = sessionStorage.getItem("schoolCode");
      const authToken = sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
          "BS-SchoolCode": schoolCode,
          "BS-UserToken": "e6b2d3f0-2e3c-4f3a-9c1d-bb1b5e5ab7fa", // static
          "BS-AuthorizationToken": authToken,
        },
        body: JSON.stringify({
          trackingID: "string", // common field
          ...body,              // form se jo bhi bhejna ho
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // 🔹 dependency empty → function stable रहेगा

  return { callApi, loading, error };
};
