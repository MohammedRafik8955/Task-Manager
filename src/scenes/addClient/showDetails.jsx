import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Grid, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { styled } from '@mui/system';

function ShowDetails() {
  const { id } = useParams(); // Get client ID from route params
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Adjust based on where your token is stored

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        // Get the token from localStorage or sessionStorage (or other source)
        

        // If token is not available, you can handle this situation here (e.g., redirect to login)
        if (!token) {
          setError("Authentication required. Please log in.");
          setLoading(false);
          return;
        }

        // Set Authorization header with Bearer token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${process.env.REACT_APP_URL}client/get/${id}`, config);
        setClientDetails(response.data.data); // Adjust based on API response structure
      } catch (err) {
        setError("Failed to fetch client details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  const CardWrapper = styled(Card)(({ theme }) => ({
    '&:hover': {
      boxShadow: theme.shadows[6],
      transform: 'scale(1.05)',
      transition: 'all 0.3s ease',
    },
    cursor: 'pointer',
  }));

  return (
    <Box m={4} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Client Details
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <CardWrapper sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Personal Information
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Name:</strong> {clientDetails.name || "N/A"}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Firm Name:</strong> {clientDetails.firmName || "N/A"}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>PAN Card:</strong> {clientDetails.panNo || "N/A"}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>GST Number:</strong> {clientDetails.gstNo || "N/A"}
              </Typography>
            </CardContent>
          </CardWrapper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CardWrapper sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Contact Information
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Email:</strong> {clientDetails.email || "N/A"}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Mobile:</strong> {clientDetails.mobile || "N/A"}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Reference:</strong> {clientDetails.reference || "N/A"}
              </Typography>
            </CardContent>
          </CardWrapper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CardWrapper sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Address
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Address:</strong> {clientDetails.address || "N/A"}
              </Typography>
            </CardContent>
          </CardWrapper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ShowDetails;
