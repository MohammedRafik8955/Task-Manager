import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";
import axios from "axios";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";


const ShoeRef = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("token");
  const url = process.env.REACT_APP_URL;
  const navigate = useNavigate();

  const [references, setReferences] = useState([]);
  const [filteredReferences, setFilteredReferences] = useState([]);
  const [filter, setFilter] = useState(""); // Status filter value
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [page, setPage] = useState(0); // Pagination: current page
  const [pageSize, setPageSize] = useState(10); // Pagination: number of rows per page
  const [openDialog, setOpenDialog] = useState(false); // For delete confirmation dialog
  const [selectedReferenceId, setSelectedReferenceId] = useState(null); // To store the referenceId to delete

  const columns = [
    { 
      field: "srNo", 
      headerName: "Sr. No.", 
      flex: 1, 
      renderCell: (params) => params.row.id + 1 // Generate Sr. No. (1-based index)
    },
    { field: "referenceName", headerName: "Reference Name", flex: 1 },
    { field: "mobileNo", headerName: "Mobile Number", flex: 1 },
    // { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => {
        const handleEdit = () => navigate(`/addRefrence/${row.id}`);
        const handleDelete = () => {
          setSelectedReferenceId(row.id);
          setOpenDialog(true); // Open confirmation dialog
        };

        return (
          <Box display="flex" justifyContent="space-around">
            <IconButton aria-label="edit" color="primary" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filter, searchQuery]); // Trigger fetchData on filter, page, pageSize, or searchQuery change

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}reference/all`, {
        params: {
          page: page + 1,
          size: pageSize,
          status: filter || "",
          search: searchQuery || "",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        const references = response.data.data.content.map((item) => ({
          id: item.referenceId, // Use referenceId instead of id
          referenceName: item.referenceName,
          mobileNo: item.mobileNo,
          status: item.status || "ACTIVE", // You might want to adjust status based on your API response
        }));
        setReferences(references);
        setFilteredReferences(references);
      }
    } catch (error) {
      console.error("Error fetching references:", error);
    }
  };
  

  const handleAddReference = () => navigate("/addRefrence");
  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newPageSize) => setPageSize(newPageSize);

  const handleDeleteConfirmation = async () => {
    try {
      const response = await axios.delete(`${url}reference/delete/${selectedReferenceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        fetchData();
        setOpenDialog(false); // Close the dialog after successful deletion
      }
    } catch (error) {
      console.error("Delete error:", error);
      setOpenDialog(false); // Close the dialog if error occurs
    }
  };

  const handleDialogClose = () => setOpenDialog(false);

  return (
    <Box m="20px">
      <Header title="REFERENCES" subtitle="Managing the Reference List" />
      <Box display="flex" justifyContent="space-between" mb="20px">
        <FormControl
          variant="outlined"
          sx={{
            width: "30%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px", // Optional: Rounded corners
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.23)", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "#fff", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fff", // Border color when focused
              },
            },
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Status"
            defaultValue=""
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          placeholder="Search references"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: "40%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px", // Optional: Rounded corners
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
        <Button color="secondary" variant="contained" onClick={handleAddReference}>
          Add Reference
        </Button>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
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
        }}
      >
        <DataGrid
          rows={filteredReferences}
          columns={columns}
          pageSize={pageSize}
          page={page}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          rowsPerPageOptions={[10, 25, 50]}
          pagination
        />
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this reference?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteConfirmation} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShoeRef;
