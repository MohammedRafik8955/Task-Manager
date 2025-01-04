import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack,
  Alert,
  AlertTitle,
  Select,
  Checkbox,
  ListItemText,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  InputLabel,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddTask() {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const url = process.env.REACT_APP_URL;
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const userName = localStorage.getItem("name");
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resMessage, setResMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [client, setClient] = useState([]);
  const [assignName, setAssignName] = useState([]);
  const [selectedWorkCategory, setSelectedWorkCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // API endpoint URL

  // category pop

  const [openCategoryPopup, setOpenCategoryPopup] = useState(false);
  const [categoryFormValues, setCategoryFormValues] = useState({
    categoryName: "",
  });

  const handleAddMoreCategoryClick = () => setOpenCategoryPopup(true);
  const handleCategoryPopupClose = () => setOpenCategoryPopup(false);

  const handleCategoryInputChange = (event) => {
    const { name, value } = event.target;
    setCategoryFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySave = async (event) => {
    event.preventDefault();

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      console.error("No auth token found");
      return;
    }

    try {
      const response = await axios.post(
        `${url}category/add`,
        { name: categoryFormValues.categoryName },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      console.log("Category added successfully:", response.data);
      setCategories((prev) => [...prev, response.data]); // Update categories list
      setCategoryFormValues({ categoryName: "" }); // Reset form
      setOpenCategoryPopup(false); // Close popup
      // NO navigate or redirection logic here
    } catch (error) {
      console.error("Error adding category:", error);
    }

    fetchWorkCategories();
  };

  const [formValues, setFormValues] = useState({
    workCategory: "",
    taskDescription: "",
    notes: "",
    taskEndDate: "",
    subCategory: "",
    client: "",
    assignName: "",
    coWork: [],
    status: "pending",
    paymentStatus: "pending",
    createdBy: "",
    updateBy: "",
    updateOn: "",
    deleted: false,
  });

  const { id } = useParams(); // Get the task id from the URL if available
  const [roles, setRoles] = useState([]);
  console.log("l", roles);
  const [userOpenPopup, setUserOpenPopup] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${url}role/allrole`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        const filteredRoles = response.data.data.filter(
          (role) => role.id !== 1
        );
        setRoles(filteredRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, [url, token]);
  // State for form values inside the popup
  const [userFormValues, setUserFormValues] = useState({
    userName: "",
    userEmail: "",
    userMobile: "",
    userPassword: "",
    userRole: "",
  });

  const [userApiError, setUserApiError] = useState(null);

  // Function to handle input changes
  const userHandleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Function to handle "Add More" button click
  const userHandleAddMoreClick = () => {
    setUserOpenPopup(true); // Show the popup
  };

  // Function to close the popup
  const userHandlePopupClose = () => {
    setUserOpenPopup(false); // Hide the popup
  };

  // Function to handle form submission (e.g., save new co-worker)
  // Function to handle form submission (e.g., save new co-worker)
  const userHandleSave = async (event) => {
    console.log("djjdj");
    event.preventDefault(); // Prevent the default form submission

    // Get the token from localStorage
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      console.error("No auth token found");
      setUserApiError("No auth token found");
      return;
    }

    // Prepare the form data to send in the request body
    const data = {
      name: userFormValues.userName,
      email: userFormValues.userEmail,
      mobile: userFormValues.userMobile,
      password: userFormValues.userPassword,
      role: userFormValues.userRole,
    };

    try {
      // Send POST request to the API
      const response = await axios.post(`${url}user/addUser`, data, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Passing token in the Authorization header
        },
      });

      // Handle successful response
      console.log("User added successfully:", response.data);
      setUserOpenPopup(false); // Close the popup after successful save
      setUserApiError(null); // Clear any previous errors

      // Reset the form to initial values
      setUserFormValues({
        userName: "",
        userEmail: "",
        userMobile: "",
        userPassword: "",
        userRole: "",
      });

      // Optionally, show a success message using a toaster
      toast.success("User added successfully!");

      // Refresh the assign names or relevant list
      fetchAssignName(); // Replace with your actual function to refresh data
    } catch (error) {
      // Handle error response
      console.error("Error adding user:", error.response || error.message);
      setUserApiError(error.response?.data?.message || "An error occurred");

      // Optionally, show an error message using a toaster
      toast.error("Error adding user. Please try again.");
    }
  };

  useEffect(() => {
    const fetchTaskData = async () => {
      if (id) {
        try {
          const response = await axios.get(`${url}task/singleTask/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const taskData = response.data.data;

          // Set form values based on the response
          setFormValues({
            workCategory: taskData.workCategory.workCategoryId || "", // Use the nested workCategoryId
            taskDescription: taskData.description || "",
            notes: taskData.notes || "",
            taskEndDate: taskData.taskEndDate || "",
            subCategory: taskData.subCategory.subCategoryId || "", // Use the nested subCategoryId
            client: taskData.client.id || "", // Use the client id
            assignName: taskData.assignName.id || "", // Assign to id
            coWork: taskData.coWork.map((coWorker) => coWorker.id) || [], // Extract coWork IDs
            status: taskData.status || "pending",
            paymentStatus: taskData.paymentStatus || "pending",
            deleted: taskData.deleted || false, // Handle deleted status
          });
        } catch (error) {
          console.error("Error fetching task data:", error);
        }
      }
    };
    fetchTaskData();
  }, [id, url, token]);

  const [validationErrors, setValidationErrors] = useState({});


  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}subcategory/subCategoryList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const categories = response.data.data.map((category) => ({
        id: category.subCategoryId,
        name: category.name,
        workCategoryId: category.workCategory
          ? category.workCategory.id
          : null,
      }));
      setSubcategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    
    fetchCategories();
  }, [url, token]);


  const fetchWorkCategories = async () => {
    try {
      const response = await axios.get(`${url}category/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
   
    fetchWorkCategories();
  }, [url, token]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        if (selectedWorkCategory) {
          const selectedCategory = categories.find(
            (category) => category.workCategoryId === selectedWorkCategory
          );
          if (selectedCategory) {
            const response = await axios.get(`${url}subcategory/workcategory`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                workCategoryId: selectedCategory.workCategoryId,
              },
            });
            setSubcategories(response.data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubcategories();
  }, [url, token, categories, selectedWorkCategory]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`${url}client/allclient?size=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClient(response.data.data.clientList);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClient();
  }, [url, token]);

  const fetchAssignName = async () => {
    try {
      const response = await axios.get(
        `${url}user/allusers?search=&page=&size=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if data exists and map correctly
      const filteredUsers = response.data.data.content
        .map((user) => ({
          id: user.id,
          name: user.name,
          roleId: user.role.id,
        }))
        .filter((user) => user.roleId !== 1); // Filter out users with role ID 1

      setAssignName(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAssignName();
    setLoading(false);
  }, [url, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.workCategory)
      errors.workCategory = "Work category is required.";
    if (!formValues.subCategory)
      errors.subCategory = "Subcategory is required.";
    if (!formValues.client) errors.client = "Client is required.";
    if (!formValues.assignName) errors.assignName = "Assign name is required.";
    if (!formValues.taskDescription)
      errors.taskDescription = "Task description is required.";
    if (!formValues.taskEndDate)
      errors.taskEndDate = "Task end date is required.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formValues.taskDescription || "",
      workCategoryId: formValues.workCategory || null,
      subCategoryId: formValues.subCategory || null,
      clientId: formValues.client || null,
      description: formValues.taskDescription || "",
      assignNameId: formValues.assignName || null,
      coWorkIds: formValues.coWork || [], // Multiple selected IDs for co-work
      status: formValues.status || "pending",
      notes: formValues.notes || "",
      taskEndDate: formValues.taskEndDate || "",
      paymentStatus: formValues.paymentStatus || "pending",
      updatedById: userId || null, // assuming `userId` is the user performing the update
      updatedOn: new Date().toISOString(),
      deleted: formValues.deleted || false,
    };

    try {
      const response = id
        ? await axios.put(`${url}task/updatetask/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post(`${url}task/createTask`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });

      setResMessage(response.data.message);
      if (response.data.statusCode === 200) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/tasklist");
        }, 1000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 1000);
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
    }
    
  };


  // sub cat
  const [openSubCategoryPopup, setOpenSubCategoryPopup] = useState(false);
const [subCategoryFormValues, setSubCategoryFormValues] = useState({
  subCategoryName: "",
});

const handleAddMoreSubCategoryClick = () => {
  setOpenSubCategoryPopup(true);
};

const handleCloseSubCategoryPopup = () => {
  setOpenSubCategoryPopup(false);
  setSubCategoryFormValues({ subCategoryName: "" }); // Reset form when closed
};

const handleSubCategorySave = async (event) => {
  event.preventDefault();
  const authToken = localStorage.getItem("token");
  if (!authToken) {
    console.error("No auth token found");
    return;
  }

  try {
    const response = await axios.post(
      `${url}subcategory/saveSubCategories`, // Replace with your API endpoint
      [{
        name: subCategoryFormValues.subCategoryName,
        workCategory: {
          workCategoryId :subCategoryFormValues.workCategory,
        }
      }],
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    console.log("Subcategory added successfully:", response.data);
    setSubcategories((prev) => [...prev, response.data]); // Update subcategories list
    setSubCategoryFormValues({ subCategoryName: "", workCategory: "" }); // Reset form
    setOpenSubCategoryPopup(false); // Close popup
  } catch (error) {
    console.error("Error adding subcategory:", error);
  }
};



  return (
    <>
      <Box m="20px">
        <Header title="CREATE TASK" subtitle="Create a New Task" />
        {showPopup && (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            {resMessage}
          </Alert>
        )}

        {showError && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            There was an issue creating the task.
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(4, 1fr)" // Four-column layout for better flexibility
          >
            {/* Client Field */}
            <Box gridColumn="span 4">
              <Autocomplete
                fullWidth
                options={client}
                getOptionLabel={(option) => option.name}
                value={client.find((cl) => cl.id === formValues.client) || null}
                onChange={(event, newValue) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    client: newValue ? newValue.id : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client"
                    variant="filled"
                    error={!!validationErrors.client}
                    helperText={validationErrors.client}
                  />
                )}
              />
            </Box>

            {/* Notes Field */}
            <Box gridColumn="span 4">
              <TextField
                fullWidth
                variant="filled"
                label="Notes"
                onChange={handleInputChange}
                value={formValues.notes}
                name="notes"
                multiline
                rows={6}
                error={!!validationErrors.notes}
                helperText={validationErrors.notes}
              />
            </Box>

            {/* Task Description Field */}
            <Box gridColumn="span 4">
              <TextField
                fullWidth
                variant="filled"
                label="Task Description"
                onChange={handleInputChange}
                value={formValues.taskDescription}
                name="taskDescription"
                multiline
                rows={6}
                error={!!validationErrors.taskDescription}
                helperText={validationErrors.taskDescription}
              />
            </Box>

            {/* Task coworker */}
            <Box gridColumn="span 2">
              <Autocomplete
                multiple
                id="coWork"
                value={assignName.filter((user) =>
                  formValues.coWork.includes(user.id)
                )}
                onChange={(event, newValue) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    coWork: newValue.map((coWorker) => coWorker.id), // Only store ids
                  }));
                }}
                options={assignName.concat({ id: "addMore", name: "Add More" })} // Add "Add More" option
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Co Workers"
                    variant="filled"
                    error={!!validationErrors.coWork}
                    helperText={validationErrors.coWork}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.id === "addMore" ? (
                      <Button
                        onClick={userHandleAddMoreClick}
                        fullWidth
                        variant="outlined"
                      >
                        Add More
                      </Button>
                    ) : (
                      <>
                        <Checkbox
                          checked={formValues.coWork.includes(option.id)}
                        />
                        <ListItemText primary={option.name} />
                      </>
                    )}
                  </li>
                )}
              />

              {/* Add More Popup */}
              <Dialog open={userOpenPopup} onClose={userHandlePopupClose}>
                <DialogTitle>Add More Co-Workers</DialogTitle>
                <form onSubmit={userHandleSave}>
                  <div style={{ padding: "16px" }}>
                    {/* Name Field */}
                    <TextField
                      fullWidth
                      label="Co-Worker Name"
                      variant="filled"
                      margin="normal"
                      name="userName"
                      value={userFormValues.userName}
                      onChange={userHandleInputChange}
                    />

                    {/* Email Field */}
                    <TextField
                      fullWidth
                      label="Email"
                      variant="filled"
                      margin="normal"
                      name="userEmail"
                      value={userFormValues.userEmail}
                      onChange={userHandleInputChange}
                    />

                    {/* Mobile Field */}
                    <TextField
                      fullWidth
                      label="Mobile"
                      variant="filled"
                      margin="normal"
                      name="userMobile"
                      value={userFormValues.userMobile}
                      onChange={userHandleInputChange}
                    />

                    {/* Password Field */}
                    <TextField
                      fullWidth
                      label="Password"
                      variant="filled"
                      margin="normal"
                      name="userPassword"
                      type="password"
                      value={userFormValues.userPassword}
                      onChange={userHandleInputChange}
                    />

                    {/* Role Field */}
                    <FormControl fullWidth variant="filled" margin="normal">
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="userRole"
                        value={userFormValues.userRole} // Ensure this is set to the selected role id
                        onChange={userHandleInputChange}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {" "}
                            {/* Use role.id as value */}
                            {role.name.replace("ROLE_", "")}{" "}
                            {/* Display the role name without "ROLE_" */}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Dialog Actions */}
                  <DialogActions>
                    <Button onClick={userHandlePopupClose} color="primary">
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={userHandleSave}
                      color="primary"
                    >
                      Save
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </Box>

            {/* Work Category  */}
            <Box gridColumn="span 2">
              {categories.length > 0 && (
                <Autocomplete
                  fullWidth
                  options={categories.concat({
                    workCategoryId: "addMore",
                    name: "Add More",
                  })} // Add "Add More" option
                  getOptionLabel={(option) => option.name}
                  value={
                    categories.find(
                      (cat) => cat.workCategoryId === formValues.workCategory
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    if (newValue?.workCategoryId === "addMore") {
                      handleAddMoreCategoryClick(); // Open popup for "Add More"
                    } else {
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        workCategory: newValue ? newValue.workCategoryId : "",
                      }));
                      setSelectedWorkCategory(
                        newValue ? newValue.workCategoryId : ""
                      );
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Work Category"
                      variant="filled"
                      error={!!validationErrors.workCategory}
                      helperText={validationErrors.workCategory}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      {option.workCategoryId === "addMore" ? (
                        <Button
                          onClick={handleAddMoreCategoryClick}
                          fullWidth
                          variant="outlined"
                        >
                          Add More
                        </Button>
                      ) : (
                        <ListItemText primary={option.name} />
                      )}
                    </li>
                  )}
                />
              )}
            </Box>

            {/*  Sub Category */}
            <Box gridColumn="span 2">
  <Autocomplete
    fullWidth
    options={subcategories.concat({ id: "addMore", name: "Add More" })} // Add "Add More" option
    getOptionLabel={(option) => option.name}
    value={
      subcategories.find((sub) => sub.id === formValues.subCategory) || null
    }
    onChange={(event, newValue) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        subCategory: newValue ? newValue.id : "",
      }));
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Sub Category"
        variant="filled"
        error={!!validationErrors.subCategory}
        helperText={validationErrors.subCategory}
      />
    )}
    renderOption={(props, option) => (
      <li {...props}>
        {option.id === "addMore" ? (
          <Button
            onClick={handleAddMoreSubCategoryClick}
            fullWidth
            variant="outlined"
          >
            Add More
          </Button>
        ) : (
          <span>{option.name}</span>
        )}
      </li>
    )}
  />

  {/* Add More Sub-Category Popup */}
  <Dialog open={openSubCategoryPopup} onClose={handleCloseSubCategoryPopup}>
  <DialogTitle>Add New Sub-Category</DialogTitle>
  <form onSubmit={handleSubCategorySave}>
    <div style={{ padding: "16px" }}>
      {/* Sub-Category Name Field */}
      <TextField
        fullWidth
        label="Sub-Category Name"
        variant="filled"
        margin="normal"
        name="subCategoryName"
        value={subCategoryFormValues.subCategoryName}
        onChange={(event) =>
          setSubCategoryFormValues({
            ...subCategoryFormValues,
            subCategoryName: event.target.value,
          })
        }
      />

      {/* Work Category Dropdown */}
      <FormControl fullWidth variant="filled" margin="normal">
        <InputLabel>Work Category</InputLabel>
        <Select
          name="workCategory"
          value={subCategoryFormValues.workCategory || ""}
          onChange={(event) =>
            setSubCategoryFormValues({
              ...subCategoryFormValues,
              workCategory: event.target.value,
            })
          }
        >
          {categories.map((category) => (
            <MenuItem key={category.workCategoryId} value={category.workCategoryId}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>

    {/* Dialog Actions */}
    <DialogActions>
      <Button onClick={handleCloseSubCategoryPopup} color="primary">
        Cancel
      </Button>
      <Button type="button" onClick={handleSubCategorySave} color="primary">
        Save
      </Button>
    </DialogActions>
  </form>
</Dialog>

</Box>


            {/* Assign Name Field */}
            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                options={assignName.concat({ id: "addMore", name: "Add More" })} // Add "Add More" option
                getOptionLabel={(option) => option.name}
                value={
                  assignName.find(
                    (user) => user.id === formValues.assignName
                  ) || null
                }
                onChange={(event, newValue) => {
                  if (newValue?.id === "addMore") {
                    userHandleAddMoreClick(); // Open the popup
                  } else {
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      assignName: newValue ? newValue.id : "",
                    }));
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign Name"
                    variant="filled"
                    error={!!validationErrors.assignName}
                    helperText={validationErrors.assignName}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.id === "addMore" ? (
                      <Button
                        onClick={userHandleAddMoreClick}
                        fullWidth
                        variant="outlined"
                      >
                        Add More
                      </Button>
                    ) : (
                      <ListItemText primary={option.name} />
                    )}
                  </li>
                )}
              />
            </Box>

            {/* Status and Payment Status */}
            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                options={[
                  { value: "PENDING", label: "PENDING" },
                  { value: "ONGOING", label: "ONGOING" },
                  { value: "COMPLETED", label: "COMPLETED" },
                ]}
                getOptionLabel={(option) => option.label}
                value={
                  [
                    { value: "PENDING", label: "PENDING" },
                    { value: "ONGOING", label: "ONGOING" },
                    { value: "COMPLETED", label: "COMPLETED" },
                  ].find((status) => status.value === formValues.status) || null
                }
                onChange={(event, newValue) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    status: newValue ? newValue.value : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Status" variant="filled" />
                )}
              />
            </Box>
            <Box gridColumn="span 2">
              <Autocomplete
                fullWidth
                options={[
                  { value: "PENDING", label: "PENDING" },
                  { value: "PAID", label: "PAID" },
                ]}
                getOptionLabel={(option) => option.label}
                value={
                  [
                    { value: "PENDING", label: "PENDING" },
                    { value: "PAID", label: "PAID" },
                  ].find(
                    (status) => status.value === formValues.paymentStatus
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    paymentStatus: newValue ? newValue.value : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Payment Status"
                    variant="filled"
                  />
                )}
              />
            </Box>

            <Box gridColumn="span 2">
              <TextField
                fullWidth
                variant="filled"
                label="Task End Date"
                type="date" // Set the input type to date
                onChange={handleInputChange}
                value={formValues.taskEndDate}
                name="taskEndDate"
                InputLabelProps={{
                  shrink: true, // Ensures the label shrinks when displaying a selected date
                }}
                error={!!validationErrors.taskEndDate}
                helperText={validationErrors.taskEndDate}
              />
            </Box>
          </Box>

          <Button
            color="secondary"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Create Task
          </Button>
        </form>
      </Box>

      {/* Add More Category Popup */}
      <Dialog open={openCategoryPopup} onClose={handleCategoryPopupClose}>
        <DialogTitle>Add New Work Category</DialogTitle>
        <form onSubmit={handleCategorySave}>
          <div style={{ padding: "16px" }}>
            {/* Work Category Name Field */}
            <TextField
              fullWidth
              label="Category Name"
              variant="filled"
              margin="normal"
              name="categoryName"
              value={categoryFormValues.categoryName}
              onChange={handleCategoryInputChange}
            />
          </div>

          {/* Dialog Actions */}
          <DialogActions>
            <Button onClick={handleCategoryPopupClose} color="primary">
              Cancel
            </Button>
            <Button type="button" onClick={handleCategorySave} color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default AddTask;
