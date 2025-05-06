import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, IconButton } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link, useLocation } from "react-router-dom";
import "./side-bar.css";
import CloseIcon from "@mui/icons-material/Close";
import CustomDialog from "../../../common/customDialog";
import Logout from "../../logout/logout";

const expandedWidth = 255; // Full width for larger screens

const Sidebar = ({ setIsSidebarCollapsed }) => {
  const location = useLocation(); // Get the current route
  const isActive = (path) => location.pathname === path; // Check if the route matches
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  return (
    <Drawer
      variant='permanent'
      anchor='left'
      sx={{
        padding: "5px",
        width: expandedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          margin: "10px",
          padding: "5px",
          width: expandedWidth,
          boxSizing: "border-box",
          backgroundColor: "rgba(255, 255, 255, 0.98)", // Slight transparency
        },
      }}
    >
      <Box p={2}>
        {window.innerWidth < 1024 && (
          <>
            <IconButton onClick={() => setIsSidebarCollapsed?.(true)}>
              <CloseIcon />
            </IconButton>
            <br />
          </>
        )}
        <img src='/images/logo.png' alt='task' className='sidebar-logo' />
      </Box>
      <List>
        <ListItem
          button
          component={Link}
          to='/tasks'
          onClick={() => window.innerWidth < 1024 && setIsSidebarCollapsed?.(true)}
          sx={{
            backgroundColor: isActive("/tasks") ? "#e3f2fd" : "transparent",
            color: isActive("/tasks") ? "#1976d2" : "inherit",
          }}
        >
          <ListItemIcon>
            <VerifiedUserIcon fontSize='small' sx={{ color: isActive("/tasks") ? "#1976d2" : "inherit" }} />
          </ListItemIcon>
          <ListItemText primary='Tasks' className='sidebar-text' />
        </ListItem>

        <Typography ml={2} mt={55}></Typography>
        <ListItem
          button
          onClick={() => {
            setLogoutDialogOpen(true); // open dialog
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Log Out' className='sidebar-text' />
        </ListItem>
      </List>
      <CustomDialog
        isOpen={logoutDialogOpen}
        onClose={() => {
          setLogoutDialogOpen(false);
        }}
        title={"Confirm logout?"}
      >
        <Logout
          onClose={() => {
            setLogoutDialogOpen(false);
          }}
        />
      </CustomDialog>
    </Drawer>
  );
};

export default Sidebar;
