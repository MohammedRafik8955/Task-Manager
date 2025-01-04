import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";

import {
  PeopleOutlined as PeopleOutlinedIcon,
  ContactsOutlined as ContactsOutlinedIcon,
  ReceiptOutlined as ReceiptOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  CalendarTodayOutlined as CalendarTodayOutlinedIcon,
  HelpOutlineOutlined as HelpOutlineOutlinedIcon,
  Category as CategoryIcon,
  Add,
  Group,
  GroupAdd,
  Task,
  AddCircle,
} from "@mui/icons-material";

const Item = ({ title, to, icon, selected, setSelected, subMenus }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (subMenus) {
    return (
      <SubMenu
        title={title}
        icon={icon}
        style={{ color: colors.grey[100] }}
        defaultOpen={true}
      >
        {subMenus.map((submenu, index) => (
          <MenuItem key={index} onClick={() => setSelected(submenu.title)}>
            <Typography>{submenu.title}</Typography>
            <Link to={submenu.to} />
          </MenuItem>
        ))}
      </SubMenu>
    );
  }

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();

  // Retrieve user name and role from local storage
  const userName = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.clear(); // Clears all items in local storage
    navigate("/"); // Redirect to the home page
  };

  // Check if user is logged in
  const isLoggedIn = !!userName;

  return (
    <Box
    sx={{
      "& .pro-sidebar-inner": {
        background: "#202947 !important", // Set background to black
      },
      "& .pro-icon-wrapper": {
        backgroundColor: "transparent !important",
      },
      "& .pro-inner-item": {
        padding: "5px 25px 5px 20px !important",
        color: "#ffffff !important", // Set text color to white
      },
      "& .pro-inner-item:hover": {
        color: "#868dfb !important",
      },
      "& .pro-menu-item.active": {
        color: "#f5f7fa !important",
        background: "#c3cfe2 !important",
      },
    }}
    
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={"#f5f7fa !important"}>
                  Task Management
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && isLoggedIn && (
            <Box mb="25px">
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={"#f5f7fa !important"}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userName}
                </Typography>
              </Box>
            </Box>
          )}

          <Item
            title="Dashboard"
            to="/dashboard"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Add Task"
            to="/taskList"
            icon={<Task />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Add Reference"
            to="/showRef"
            icon={<AddCircle />}
            selected={selected}
            setSelected={setSelected}
          />
          {userRole !== "ROLE_USER" && (
            <Item
              title="User"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              to="/team"
            />
          )}
          <Item
            title="Client"
            icon={<GroupAdd />}
            selected={selected}
            setSelected={setSelected}
            to="/showClient"
          />
          <Item
            title="Category"
            icon={<CategoryIcon />}
            selected={selected}
            setSelected={setSelected}
            to="/catogery"
          />
          <Item
            title="Sub Category"
            icon={<CategoryIcon />}
            selected={selected}
            setSelected={setSelected}
            to="/showsubcatogery"
          />
          <Item
            title="Calendar"
            to="/calendar"
            icon={<CalendarTodayOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <MenuItem
            onClick={handleLogout}
            style={{
              color: colors.grey[100],
              marginTop: "20px",
            }}
            icon={<ExitToAppIcon />}
          >
            <Typography>Logout</Typography>
          </MenuItem>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;