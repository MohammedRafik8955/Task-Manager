import { Alert, AlertTitle, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css"; // For styling

const AdminForm = () => {
  const navigate = useNavigate();
  const url = process.env.REACT_APP_URL;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [showPopup, setShowPopup] = useState(false);
  const [showerror, setShowError] = useState(false);
  const [resMessage, setResMessage] = useState();

  const handleFormSubmit = (values) => {
    axios
      .post(`${url}user/login`, values)
      .then((response) => {
        setResMessage(response.data.message);
        if (response.data.statusCode === 200) {
          localStorage.setItem("email", response.data.data.USERInfo.email);
          localStorage.setItem("id", response.data.data.USERInfo.id);
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("role", response.data.data.USERInfo.role.id);
          localStorage.setItem("userRole", response.data.data.USERInfo.role.name);

          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate("/Dashboard");
          }, 1000);
        } else {
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="admin-form-container">
      <Box className="form-box">
        <Typography variant="h4" className="form-header">
          Welcome Back
        </Typography>
        <Typography variant="body1" className="form-subheader">
          Please login to continue
        </Typography>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit} className="form-content">
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                className="form-input"
                sx={{
                  backgroundColor: "#f0f4f8", // Soft color for background
                  borderRadius: "8px",
                  '& .MuiInputBase-root': {
                    backgroundColor: "#fff", // White background color for input field
                    color: "#000", // Black text color
                  },
                  '& .MuiInputLabel-root': {
                    color: "#000", // Black label color
                  },
                  '& .Mui-focused': {
                    backgroundColor: "#fff", // White background when focused
                  },
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                className="form-input"
                sx={{
                  backgroundColor: "#f0f4f8", // Soft color for background
                  borderRadius: "8px",
                  '& .MuiInputBase-root': {
                    backgroundColor: "#fff", // White background color for input field
                    color: "#000", // Black text color
                  },
                  '& .MuiInputLabel-root': {
                    color: "#000", // Black label color
                  },
                  '& .Mui-focused': {
                    backgroundColor: "#fff", // White background when focused
                  },
                }}
              />
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained" className="form-button">
                  Login
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      {showPopup && (
        <div className="alert-container">
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity="success">
              <AlertTitle>Login Successful</AlertTitle>
            </Alert>
          </Stack>
        </div>
      )}
      {showerror && (
        <div className="alert-container">
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity="error">
              <AlertTitle>{resMessage}</AlertTitle>
            </Alert>
          </Stack>
        </div>
      )}
    </div>
  );
};

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
});

const initialValues = {
  email: "",
  password: "",
};

export default AdminForm;
