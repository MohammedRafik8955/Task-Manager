import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Stack, Alert, AlertTitle } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";

const CreateReference = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL parameters
  const url = process.env.REACT_APP_URL;
  const token = localStorage.getItem("token");

  const [referenceData, setReferenceData] = useState({
    referenceName: "",
    mobileNo: ""
  });
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resMessage, setResMessage] = useState();

  // Fetch the reference data if we're editing (using reference ID)
  useEffect(() => {
    if (id) {
      axios
        .get(`${url}reference/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setReferenceData({
            referenceName: response.data.data.referenceName,
            mobileNo: response.data.data.mobileNo,
          });
        })
        .catch((error) => {
          console.error("Error fetching reference data:", error);
          setShowError(true);
        });
    }
  }, [id, url, token]);

  const handleFormSubmit = async (values) => {
  try {
    const endpoint = id
      ? `${url}reference/update/${id}` // Use PUT for updating
      : `${url}reference/create`; // Use POST for creating a new reference

    // Use PUT for update and POST for create
    const method = id ? 'put' : 'post';

    const response = await axios({
      method, // Dynamically choose the HTTP method
      url: endpoint,
      data: values, // Pass form values
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setResMessage(response.data.message);
    if (response.data.statusCode === 200 || response.data.statusCode === 201) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate(-1); // Redirect to the previous page
      }, 1000);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  } catch (error) {
    console.error("Error creating/updating reference:", error);
    setShowError(true);
  }
};

  

  const validationSchema = yup.object().shape({
    referenceName: yup.string().required("Reference Name is required"),
    mobileNo: yup
      .string()
      .matches(
        /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
        "Invalid mobile number format"
      )
      .required("Mobile Number is required"),
  });

  return (
    <Box m="20px">
      <Header
        title={id ? "EDIT REFERENCE" : "CREATE REFERENCE"}
        subtitle={id ? "Update Reference Details" : "Add a New Reference"}
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={referenceData} // Set initial values to fetched reference data
        validationSchema={validationSchema}
        enableReinitialize={true} // Ensure form is reinitialized when referenceData changes
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
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
                label="Reference Name"
                name="referenceName"
                value={values.referenceName}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.referenceName && !!errors.referenceName}
                helperText={touched.referenceName && errors.referenceName}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Mobile Number"
                name="mobileNo"
                value={values.mobileNo}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.mobileNo && !!errors.mobileNo}
                helperText={touched.mobileNo && errors.mobileNo}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {id ? "Update Reference" : "Create Reference"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {showPopup && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            {resMessage || "Reference saved successfully!"}
          </Alert>
        </Stack>
      )}

      {showError && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {resMessage || "An error occurred while saving the reference."}
          </Alert>
        </Stack>
      )}
    </Box>
  );
};

export default CreateReference;
