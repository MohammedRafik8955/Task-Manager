import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios";
import Header from "../../components/Header";
import { Edit, Delete } from "@mui/icons-material";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("token");
  const url = process.env.REACT_APP_URL;
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [editFormData, setEditFormData] = useState({ id: "", name: "" });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}/api/category/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(">>>>>>",response);
        const categories = response.data.data.map(category => ({
          id: category.workCategoryId,
          name: category.name,
          workCategoryId: category.workCategoryId,
        }));
        setRows(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [url, token]);

  useEffect(() => {
    const columns = [
      { field: "id", headerName: "ID", width: 90 },
      { field: "name", headerName: "Category", width: 200 },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
          <strong>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEdit(params.row)}
              startIcon={<Edit />}
            >
              
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(params.row.id)}
              startIcon={<Delete />}
            >
              
            </Button>
          </strong>
        )
      },
    ];
    setColumns(columns);
  }, []);

  const handleEdit = (row) => {
    console.log("Edit category with ID:", row.id);
    setEditFormData({ id: row.id, name: row.name });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (workCategoryId) => {
    console.log("Delete category with ID:", workCategoryId);
    try {
      const response = await axios.delete(`${url}/api/category/delete/${workCategoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("delete success", response);
      if (response.data.statusCode === 200) {
        const updatedResponse = await axios.get(`${url}/api/category/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const updatedCategories = updatedResponse.data.data.map(category => ({
          id: category.workCategoryId,
          name: category.name,
          workCategoryId: category.workCategoryId,
        }));
        setRows(updatedCategories);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEditFormSubmit = async () => {
    try {
      const response = await axios.put(`${url}/api/category/update/${editFormData.id}`, {
        name: editFormData.name
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("edit success", response.data.statusCode);
      if (response.data.statusCode === 200) {
        // If edit is successful, close the form
        setIsEditDialogOpen(false);
        // Optionally, you can refresh the data here
        const updatedResponse = await axios.get(`${url}/api/category/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const updatedCategories = updatedResponse.data.data.map(category => ({
          id: category.workCategoryId,
          name: category.name,
          workCategoryId: category.workCategoryId,
        }));
        setRows(updatedCategories);
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="CATEGORY" subtitle="List of CATEGORY " />
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
        <DataGrid checkboxSelection rows={rows} columns={columns} />
      </Box>
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditFormSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices;
