import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, FormControl } from '@mui/material';
import { useApi } from '../../../../utils/useApi.jsx';
import { API_ENDPOINTS } from '../../../../api/endpoints';

const Session = ({ onSessionChange }) => {
  const [sessionOptions, setSessionOptions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchSessions = async () => {
      try {        // Use school-web-app compatible API call
        const response = await callApi(API_ENDPOINTS.MASTERS.GET_SESSION_DETAILS, { 
          taskType: 'select' 
        });

        if (response && Array.isArray(response) && response.length >= 2) {
          const startYear = new Date(response[0].date).getFullYear();
          const endYear = new Date(response[1].date).getFullYear();
          const formatted = [`${startYear}-${endYear}`];
          setSessionOptions(formatted);
        }
      } catch (error) {
        console.error('Error loading session data:', error);
      }
    };

    fetchSessions();
  }, [callApi]);

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
