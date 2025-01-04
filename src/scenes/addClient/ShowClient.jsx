import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Switch,
  IconButton,
  TextField,
  Pagination
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios";
import Header from "../../components/Header";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function ShowClient() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("token");
  const url = process.env.REACT_APP_URL;
  const userRole = localStorage.getItem("userRole");

  const [rows, setRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [clientStatusToChange, setClientStatusToChange] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [page, setPage] = useState(1); // State for pagination
  const [totalCount, setTotalCount] = useState(0); // Total count of records for pagination
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${url}client/allclient`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: searchTerm, // Pass search term in query params
            page: page, // Pass current page
            size: 10, // Set page size to 10
          },
        });
        // Add serial number (SR No.) to each row
        const clientsWithSerial = response.data.data.clientList.map((client, index) => ({
          ...client,
          srNo: (page - 1) * 10 + (index + 1), // Calculate SR No. considering pagination
        }));
        setRows(clientsWithSerial);
        setTotalCount(response.data.data.totalCount); // Set total count for pagination
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, [url, token, searchTerm, page]);

  const columns = [
    { field: "srNo", headerName: "SR No.", width: 70 }, // Display SR No. column
    { field: "name", headerName: "Client", width: 200 },
    { field: "firmName", headerName: "Firm Name", width: 150 },
    { field: "panNo", headerName: "PAN Card", width: 120 },
    { field: "gstNo", headerName: "GST Number", width: 120 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "mobile", headerName: "Mobile", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 70,
      renderCell: (params) => (
        <Typography color={params.row.status ? "textPrimary" : "textSecondary"}>
          {params.row.status ? "Active" : "Inactive"}
        </Typography>
      ),
    },
    {
      field: "switch",
      headerName: "Switch",
      width: 70,
      renderCell: (params) => (
        <Switch
          checked={params.row.status}
          onChange={() => handleStatusChangeClick(params.row.id, !params.row.status)}
          color="primary"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <strong>
          <IconButton color="secondary" onClick={() => handleShow(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          {userRole !== "ROLE_USER" && (
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <Delete />
            </IconButton>
          )}
        </strong>
      ),
    },
  ];

  const handleShow = (row) => {
    navigate(`/showClientDetails/${row.id}`);
  };

  const handleEdit = (row) => {
    navigate(`/editClient/${row.id}`);
  };

  const handleDeleteClick = (clientId) => {
    setClientIdToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${url}client/deleteclient/${clientIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.statusCode === 200) {
        // Refresh the data
        const updatedResponse = await axios.get(`${url}client/allclient`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRows(updatedResponse.data.data.clientList);
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleStatusChangeClick = (clientId, status) => {
    setClientStatusToChange({ clientId, status });
    setStatusChangeDialogOpen(true);
  };

  const handleStatusChange = async () => {
    try {
      const response = await axios.put(
        `${url}/api/client/statuschange/${clientStatusToChange.clientId}`,
        { status: clientStatusToChange.status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.statusCode === 200) {
        const updatedResponse = await axios.get(`${url}client/allclient`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRows(updatedResponse.data.data.clientList);
        setStatusChangeDialogOpen(false);
      }
    } catch (error) {
      console.error("Error changing client status:", error);
    }
  };

  const handleAddUser = () => {
    navigate("/addClient");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box m="20px">
      <Header title="CLIENTS" subtitle="List of Clients" />
      <Box mb="20px" display="flex" justifyContent="space-between" alignItems="center">
        


<TextField
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            width: "40%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px", // Optional: Round corners
              "& fieldset": {
                borderColor: "rgba(241, 241, 241, 0.23)", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "#fff", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fff", // Border color when focused
              },
            },
          }}
        />




        <Button color="secondary" variant="contained" onClick={handleAddUser}>
          Add CLIENTS
        </Button>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          pagination
        />
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(totalCount / 10)}
          page={page}
          onChange={handlePageChange}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete this client?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            No
          </Button>
          <Button onClick={handleDelete} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={statusChangeDialogOpen}
        onClose={() => setStatusChangeDialogOpen(false)}
      >
        <DialogTitle>Are you sure you want to change the status?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setStatusChangeDialogOpen(false)} color="secondary">
            No
          </Button>
          <Button onClick={handleStatusChange} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ShowClient;
