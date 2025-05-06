import React from "react";
import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";
import "./top-bar.css"; // Importing the external CSS file
import { useSelector } from "react-redux";

const Topbar = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <AppBar
      position='fixed'
      className='topbar-appbar'
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "white",
        color: "#000",
        width: `calc(100% - 292px)`, // Subtracting the sidebar width
        marginLeft: "300px", // Aligned with the sidebar width
        marginRight: "20px", // Aligned with the sidebar width
        marginTop: "6px",
        boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)", // Correct the boxShadow value
      }}
    >
      <Toolbar>
        <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar alt='Profile' src='/images/person.png' className='profile-avatar' />
          <Typography className='topbar-username'>{user?.username}</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
