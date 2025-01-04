import React, { useState } from 'react';
import { Alert, AlertTitle, Box, Button, Stack, TextField } from "@mui/material";
import Header from '../../components/Header';
import { Formik } from 'formik';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function AddCategory() {
    const url = process.env.REACT_APP_URL;
    const token = localStorage.getItem("token");
    const [showPopup, setShowPopup] = useState(false);
    const [showError, setShowError] = useState(false);
    const [resMessage, setResMessage] = useState();
    const navigate = useNavigate(); // Initialize navigate function

    const handleFormSubmit = async (values) => {
        console.log("API response:", values);
        try {
            // Make the API request to "/api/category/add"
            const response = await axios.post(`${url}category/add`, values, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in request headers
                }
            });
            console.log("API response:", response);
            setResMessage(response.data.message);
            
            if (response.data.statusCode === 200) {
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    navigate("/catogery"); // Navigate to /tasklist after the popup closes
                }, 1000); // Close the popup after 1 second
            } else {
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 1000); // Hide error after 1 second
            }
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    return (
        <>
            <Box m="20px">
                <Header title="CREATE CATEGORY" subtitle="Create a New Category" />

                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={{
                        name: "", // Initialize with empty string
                    }}
                    // You need to define validationSchema here
                    // validationSchema={checkoutSchema}
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
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Create New Category
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
                            <AlertTitle>{resMessage}</AlertTitle>
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
}

export default AddCategory;
