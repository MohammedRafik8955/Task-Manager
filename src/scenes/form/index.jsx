import { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, Stack, Alert, AlertTitle } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Form = () => {
  const navigate = useNavigate(); // Initialize navigate
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = process.env.REACT_APP_URL;
  const token = localStorage.getItem("token");
  const [roles, setRoles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false); // Fixed naming convention
  const [resMessage, setResMessage] = useState();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${url}role/allrole`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data.data);
        const filteredRoles = response.data.data.filter(role => role.id !== 1);
        setRoles(filteredRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, [url, token]);

  const handleFormSubmit = async (values) => {
    console.log("values", values);
    console.log("token", token);
    try {
      const response = await axios.post(`${url}user/addUser`, values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("User added successfully:", response);
      setResMessage(response.data.message);
      
      if (response.data.statusCode === 200) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false); // Hide the popup after 4 seconds
          navigate("/team"); // Navigate after popup is hidden
        }, 4000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <>
      <Box m="20px">
        <Header title="CREATE USER" subtitle="Create a New User Profile" />
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            name: "", email: "", mobile: "", password: "", role: "",
          }}
          validationSchema={checkoutSchema}
        >
          {({
            values, errors, touched, handleBlur, handleChange, handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 2" }}
                />
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
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Mobile"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.mobile}
                  name="mobile"
                  error={!!touched.mobile && !!errors.mobile}
                  helperText={touched.mobile && errors.mobile}
                  sx={{ gridColumn: "span 4" }}
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
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  select
                  label="Role"
                  value={values.role}
                  onChange={handleChange}
                  name="role"
                  error={!!touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                  sx={{ gridColumn: "span 4" }}
                >
                  {Array.isArray(roles) && roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Create New User
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      {showPopup && (
        <div className="warning-message">
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="success">
              <AlertTitle>Log In successfully</AlertTitle>
            </Alert>
          </Stack>
        </div>
      )}

      {showError && (
        <div className="warning-message">
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="error">
              <AlertTitle>{resMessage}</AlertTitle>
            </Alert>
          </Stack>
        </div>
      )}
    </>
  );
};

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  mobile: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  role: yup.string().required("required"),
  password: yup.string().required("required"),
});

export default Form;
