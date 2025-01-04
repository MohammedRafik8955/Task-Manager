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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";
import axios from "axios";
import { tokens } from "../../theme";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import './datagrid.css';

const TaskList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("token");
  const url = process.env.REACT_APP_URL;
  const userId = localStorage.getItem("id");
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = location.state || {};

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState(""); // Status filter value
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [page, setPage] = useState(0); // Pagination: current page
  const [pageSize, setPageSize] = useState(10); // Pagination: number of rows per page

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Dialog visibility
  const [selectedTaskId, setSelectedTaskId] = useState(null); // Task to delete

  const columns = [
    { field: "srNo", headerName: "Sr. No", width: 30  }, // Display serial number
    { field: "name", headerName: "Task Name", width: 390  },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: ({ row }) => {
        return (
          <FormControl fullWidth>
            <Select
              value={row.status}
              onChange={(e) => handleStatusChange(row.taskId, e.target.value)}
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="ONGOING">ONGOING</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
            </Select>
          </FormControl>
        );
      },
    },
    { field: "assignName", headerName: "Assigned Name", width: 180  },
    { field: "assignDate", headerName: "Assign Date", width: 120  },
    { field: "taskEndDate", headerName: "End Date", width: 120  },
    // { field: "notes", headerName: "Notes", flex: 1 },
    // { field: "updateBy", headerName: "Updated By", flex: 1 },
    { field: "updateOn", headerName: "Updated On", width: 100  },
    {
      field: "actions",
      headerName: "Actions",
      width: 90 ,
      sortable: false,
      renderCell: ({ row }) => {
        const handleEdit = () => navigate(`/editTask/${row.taskId}`);
        
        const handleDeleteClick = () => {
          setSelectedTaskId(row.taskId); // Set the task ID for deletion
          setOpenDeleteDialog(true); // Open the delete confirmation dialog
        };

        return (
          <Box display="flex" justifyContent="space-around">
            <IconButton aria-label="edit" color="secondary" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            {userRole !== "ROLE_USER" && (
              <IconButton
                aria-label="delete"
                color="error"
                onClick={handleDeleteClick}
              >
                <DeleteIcon />
              </IconButton>
            )}
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
      const response = await axios.get(`${url}task/allTaskList`, {
        params: {
          page: page + 1,
          size: pageSize,
          userId: userId,
          status: filter || status, // Apply status filter
          search: searchQuery || "", // Apply search query
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const tasks = response.data.data.map((item , index) => ({
          srNo: index + 1, // Serial number based on the index
          id: item.taskId,
          taskId: item.taskId,
          name: item.name,
          status: item.status,
          assignDate: item.assignDate,
          taskEndDate: item.taskEndDate,
          notes: item.notes,
          updateBy: item.updateBy,
          updateOn: item.updateOn,
          assignName: item.assignName ? item.assignName.name : "N/A",
          client: item.client ? item.client.name : "N/A",
          workCategory: item.workCategory ? item.workCategory.name : "N/A",
          subCategory: item.subCategory ? item.subCategory.name : "N/A",
        }));
        setTasks(tasks);
        setFilteredTasks(tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = () => navigate("/addTask");
  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newPageSize) => setPageSize(newPageSize);

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${url}task/deleteTask/${selectedTaskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setOpenDeleteDialog(false); // Close the dialog
        fetchData(); // Refresh the task list
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false); // Close the dialog without deleting
  };

  // Handle status update on dropdown change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Make sure that you send the headers at the correct level
      const response = await axios.put(
        `${url}task/update-status/${taskId}?status=${newStatus}`,
        null, // No body is required, just the URL with the status as a query parameter
        {
          headers: {
            Authorization: `Bearer ${token}`, // Correctly place Authorization header here
          },
        }
      );
  
      if (response.status === 200) {
        // Successfully updated the status, refresh the task list
        fetchData();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  

  return (
    <Box m="20px">
      <Header title="TASKS" subtitle="Managing the Task List" />
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
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="ONGOING">ONGOING</MenuItem>
            <MenuItem value="COMPLETED">COMPLETED</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          placeholder="Search tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

        <Button color="secondary" variant="contained" onClick={handleAddTask}>
          Add Task
        </Button>
      </Box>

      <Box
  m="40px 0 0 0"
  height="75vh"
  
  
>
  <DataGrid
    rows={filteredTasks}
    columns={columns}
    pageSize={pageSize}
    page={page}
    onPageChange={handlePageChange}
    onPageSizeChange={handlePageSizeChange}
    rowsPerPageOptions={[10, 25, 50]}
    pagination
  />
</Box>


      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Are you sure you want to delete this task?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;
