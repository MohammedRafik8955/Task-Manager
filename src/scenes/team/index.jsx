import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";
import axios from "axios";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Fetch the role from localStorage
  const url = process.env.REACT_APP_URL;
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // State to manage the dialog
  const [deleteUserId, setDeleteUserId] = useState(null); // Store the user ID to delete
  const [searchQuery, setSearchQuery] = useState(""); // For search functionality
  const [page, setPage] = useState(0); // For pagination
  const [pageSize, setPageSize] = useState(10); // For pagination size

  const columns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      valueGetter: (params) => params.api.getRowIndex(params.id) + 1, // Calculate the index and add 1 for Sr. No.
      flex: 0.5, // Adjust width as needed
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "mobile",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          backgroundColor={
            access === "admin"
              ? colors.greenAccent[600]
              : access === "manager"
              ? colors.greenAccent[700]
              : colors.greenAccent[700]
          }
          borderRadius="4px"
        >
          {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
          {access === "manager" && <SecurityOutlinedIcon />}
          {access === "user" && <LockOpenOutlinedIcon />}
          <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
            {access}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        const handleEdit = async () => {
          const id = row.id;
          try {
            const response = await axios.get(`${url}user/getuserbyid/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("Edit successful:", response.data.data);
            if (response.data.statusCode === 200) {
              localStorage.setItem("user", JSON.stringify(response.data.data));
              navigate("/editForm");
            }
          } catch (error) {
            console.error("Edit error:", error);
          }
        };

        const handleDeleteClick = (id) => {
          setDeleteUserId(id); // Set the user ID to be deleted
          setOpenDialog(true);  // Open the dialog
        };

        return (
          <Box display="flex" justifyContent="space-around">
            <IconButton
              aria-label="edit"
              color="error"
              className="total-edit"
              onClick={handleEdit}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => handleDeleteClick(row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData(page, pageSize, searchQuery);
  }, [page, pageSize, searchQuery]);

  const fetchData = async (page, pageSize, searchQuery) => {
    try {
      const response = await axios.get(
        `${url}user/allusers?search=${searchQuery}&page=${page + 1}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeamData(response.data.data.content);
      setFilteredData(response.data.data.content);
      console.log(response.data.data.content);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const handleAddUser = () => {
    navigate("/form");
  };

  // Function to handle the delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteUserId) {
      axios
        .delete(`${url}user/deleteuser/${deleteUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Delete successful:", response.data.statusCode);
          if (response.data.statusCode === 200) {
            fetchData(page, pageSize, searchQuery);
          }
        })
        .catch((error) => {
          console.error("Delete error:", error);
        });
      setOpenDialog(false);  // Close the dialog after confirmation
    }
  };

  // Function to handle the cancel action of delete
  const handleDeleteCancel = () => {
    setOpenDialog(false);  // Close the dialog if "No" is clicked
  };

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box display="flex" justifyContent="flex-end" mb="20px">
        {/* Show Add User button only if the user is an admin */}
        {userRole === "1" && (
          <Button color="secondary" variant="contained" onClick={handleAddUser}>
            Add User
          </Button>
        )}
      </Box>

      {/* Search Bar */}
      <Box mb="20px" display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Search by Name or Email"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
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
          rows={filteredData}
          columns={columns}
          pageSize={pageSize}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 25]}
          pagination
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Team;
