import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { MdPerson, MdLock, MdSchool } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import FilledTextField from "../utils/FilledTextField";

const SESSION_DURATION = 30 * 60 * 1000; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [schoolCodeError, setSchoolCodeError] = useState("");

  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  // ✅ Check session validity on mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const expiry = sessionStorage.getItem("tokenExpiry");

    if (token && expiry && new Date().getTime() < expiry) {
      setIsAuthenticated(true);
      autoLogout(expiry);

      // ✅ Redirect to dashboard only if not already there
      if (window.location.pathname !== "/dashboard") {
        navigate("/dashboard");
      }
    } else {
      // ❌ Don't call handleLogout() here → just clear auth state
      sessionStorage.clear();
      setIsAuthenticated(false);
    }
  }, []);


  // ✅ Auto logout after session expiry
  const autoLogout = (expiry) => {
    const timeLeft = expiry - new Date().getTime();
    setTimeout(() => {
      handleLogout();
    }, timeLeft);
  };
  // ✅ Logout and clear session
  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("schoolMaster");
    localStorage.removeItem("schoolCode");
    sessionStorage.clear();
    setIsAuthenticated(false);
    navigate("/login");
  };

  // ✅ Login API call
  const handleLogin = async (uname, pwd, auto = false) => {
    try {
      
      const loginUrl = `https://teo-vivekanadbihar.co.in/TEO-School-API/api/Login/Login`;

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "BS-SchoolCode": auto
            ? localStorage.getItem("schoolCode")
            : schoolCode,
        },
        body: JSON.stringify({
          username: uname,        // ✅ Match API key exactly
          password: pwd,          // ✅ Match API key exactly
          trackingID: "WEB_APP"   // ✅ Added tracking ID (you can make this dynamic if needed)
        }),
      });

      if (response.ok) {
  const result = await response.json();

  if (result.isValid) {
    // ✅ Store token and expiry in sessionStorage
    sessionStorage.setItem("token", result.userToken);
    const expiry = new Date().getTime() + SESSION_DURATION;
    sessionStorage.setItem("tokenExpiry", expiry);

    // ✅ Always save schoolCode in sessionStorage & localStorage
    const finalSchoolCode = auto ? localStorage.getItem("schoolCode") : schoolCode;
    sessionStorage.setItem("schoolCode", finalSchoolCode);
    localStorage.setItem("schoolCode", finalSchoolCode);

    // ✅ Remember username & password only if rememberMe or auto
    if (rememberMe || auto) {
      localStorage.setItem("username", uname);
      localStorage.setItem("password", pwd);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }    // ✅ Auto logout timer
    autoLogout(expiry);

    // ✅ Set authentication status
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    
    setUsername("");
    setPassword("");
    setSchoolCode(""); // optional: clear input field

    navigate("/dashboard");
  } else {
    if (!auto) setPasswordError("Invalid username or password");
  }
}
else {
        const errorText = await response.text();
        if (!auto) {
          setPasswordError(errorText || "Invalid username or password");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      if (!auto) setPasswordError("Something went wrong. Please try again.");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setPasswordError("");
    setSchoolCodeError("");

    if (!username) {
      setUsernameError("Username is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (!schoolCode) {
      setSchoolCodeError("School Code is required");
      return;
    }

    await handleLogin(username, password);
    setSchoolCode("");
  };

  return (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", borderRadius: 3, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary">
            Please login to your account
          </Typography>

          <Box display="flex" justifyContent="center" mt={2} mb={2}>
            <Avatar sx={{ bgcolor: "#1976d2", width: 60, height: 60 }}>
              <FaUser size={30} />
            </Avatar>
          </Box>

          <form onSubmit={handleSubmit} autoComplete="off">
            <FilledTextField
              fullWidth
              label="User Name"
              type="text"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              error={!!usernameError}
              helperText={usernameError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdPerson />
                  </InputAdornment>
                ),
              }}
            />

            <FilledTextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdLock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FilledTextField
              fullWidth
              label="School Code"
              type="text"
              margin="normal"
              value={schoolCode}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setSchoolCode(value);
                setSchoolCodeError("");
              }}
              required
              error={!!schoolCodeError}
              helperText={schoolCodeError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdSchool />
                  </InputAdornment>
                ),
              }}
            />

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember Me"
              />
              <Typography
                variant="body2"
                sx={{ cursor: "pointer", color: "#1976d2" }}
              >
                Forgot Password?
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
