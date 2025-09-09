import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, FormControl } from '@mui/material';
import { getBaseUrlBySchoolCode } from '../../utils/schoolBaseUrls'

const Session = ({ onSessionChange }) => {
  const [sessionOptions, setSessionOptions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
const schoolCode = localStorage.getItem('schoolCode'); // 👈 Get stored schoolCode
        const baseUrl = getBaseUrlBySchoolCode(schoolCode);   // 👈 Get API base URL

        if (!baseUrl) {
          console.error('Invalid or missing school code');
          return;
        }

        const response = await fetch(`${baseUrl}/api/Session/GetSessionStartEndDetails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskType: 'select' }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length >= 2) {
          const startYear = new Date(data[0].date).getFullYear();
          const endYear = new Date(data[1].date).getFullYear();
          const formatted = [`${startYear}-${endYear}`];
          setSessionOptions(formatted);
        }
      } catch (error) {
        console.error('Error loading session data:', error);
      }
    };

    fetchSessions();
  }, []);

  const handleChange = (e, value) => {
    setSelectedSession(value);
    if (onSessionChange) {
      onSessionChange(value);
    }
  };

  return (
    <div className="w-full mb-4">
      <FormControl fullWidth>
        <Autocomplete
          options={sessionOptions}
          value={selectedSession}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Session"
              placeholder="Select session"
              required
            />
          )}
        />
      </FormControl>
    </div>
  );
};

export default Session;
