import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert, AlertTitle, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios";
import Header from "../../components/Header";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Category() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const token = localStorage.getItem("token");
    const url = process.env.REACT_APP_URL;
    const userRole = localStorage.getItem("userRole"); 
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [editFormData, setEditFormData] = useState({ id: "", name: "" });
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);  // State for delete confirmation
    const [categoryToDelete, setCategoryToDelete] = useState(null); // Store category to be deleted
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await axios.get(`${url}category/all`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log(">>>>>>",response.data.statusCode);
          
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

              {userRole !== "ROLE_USER" && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => openDeleteDialog(params.row.id)}
                  startIcon={<Delete />}
                >
                  
                </Button>
              )}
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
  
    const openDeleteDialog = (categoryId) => {
      setCategoryToDelete(categoryId);
      setIsDeleteDialogOpen(true);
    };
  
    const handleDelete = async () => {
      console.log("Delete category with ID:", categoryToDelete);
      try {
        const response = await axios.delete(`${url}category/delete/${categoryToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("delete success", response);
        if (response.data.statusCode === 200) {
          const updatedResponse = await axios.get(`${url}category/all`, {
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
          setIsDeleteDialogOpen(false);  // Close the delete confirmation dialog
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    };
  
    const handleEditFormSubmit = async () => {
      try {
        const response = await axios.put(`${url}category/update/${editFormData.id}`, {
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
          const updatedResponse = await axios.get(`${url}category/all`, {
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

    const handleAddUser = () => {
      navigate('/addCategory'); // Change '/addUserForm' to the path of your add user form
    };

    return (
      <>
        <Box m="20px">
          <Header title="CATEGORY" subtitle="List of CATEGORY " />
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleAddUser}>Add CATEGORY</Button>
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
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>

          {/* Edit Category Dialog */}
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
              <Button color="secondary" onClick={handleEditFormSubmit} color="primary">Save</Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete this category?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDeleteDialogOpen(false)} color="secondary">No</Button>
              <Button onClick={handleDelete} color="error">Yes</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    );
}

export default Category;
