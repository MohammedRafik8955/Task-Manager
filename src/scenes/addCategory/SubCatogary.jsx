import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, Alert, AlertTitle, Stack } from '@mui/material';
import axios from 'axios';
import Header from '../../components/Header';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function SubCategory() {
    const url = process.env.REACT_APP_URL;
    const token = localStorage.getItem('token');
    const [showPopup, setShowPopup] = useState(false);
    const [showError, setShowError] = useState(false);
    const [resMessage, setResMessage] = useState();
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const navigate = useNavigate(); // Initialize navigate function

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${url}category/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [url, token]);

    const handleFormSubmit = async (values) => {
        console.log('Form values:', values);
        try {
            const response = await axios.post(`${url}subcategory/saveSubCategories`, [{
                name: values.name,
                workCategory: {
                    workCategoryId: selectedCategoryId
                }
            }], {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('API response:', response);
            // Handle success
            setResMessage(response.data.message);
            console.log(response.data.statusCode);
            if (response.data.statusCode === 200) {
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    navigate("/showsubcatogery"); // Navigate to /tasklist after the popup closes
                }, 1000); // Close the popup after 1 second
            } else {
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 1000); // Hide error after 1 second
            }
        } catch (error) {
            console.error('Error adding subcategory:', error);
        }
    };

    return (
        <>
            <Box m="20px">
                <Header title="CREATE SUBCATEGORY" subtitle="Create a New Subcategory" />

                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={{
                        name: ''
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box display="grid" gap="30px">
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Name"
                                    onBlur={handleBlur('name')}
                                    onChange={handleChange('name')}
                                    value={values.name}
                                    name="name"
                                    error={!!touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                />
                                {/* Dropdown for selecting category */}
                                <TextField
                                    select
                                    fullWidth
                                    variant="filled"
                                    label="Select Category"
                                    value={selectedCategoryId || ''}
                                    onChange={(event) => setSelectedCategoryId(event.target.value)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.workCategoryId} value={category.workCategoryId}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Create New Subcategory
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

export default SubCategory;
