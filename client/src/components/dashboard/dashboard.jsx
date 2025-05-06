import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import Topbar from "./topBar/top-bar";
import Sidebar from "./sideBar/side-bar";
import { useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Tasks from "../tasks/tasks";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);

  // Function to render forms dynamically based on URL path
  const renderForm = useCallback(() => {
    switch (location.pathname) {
      case "/tasks":
        return <Tasks />;
      default:
        return <Tasks />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    // Handle browser resizing
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === "/login") {
        navigate("/dashboard", { replace: true }); // Redirect to dashboard instead of login
      }
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <Box>
      <Box>
        <Topbar />
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 10,
          zIndex: 1000,
          display: "flex",
          backgroundColor: "white",
        }}
      >
        {isSidebarCollapsed ? (
          <Grid container mt={3} ml={5}>
            <Grid item>
              <IconButton
                onClick={() => {
                  setIsSidebarCollapsed(false);
                }}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Grid>
        ) : (
          <Sidebar setIsSidebarCollapsed={setIsSidebarCollapsed} />
        )}
      </Box>
      <Box mt={10} ml={window.innerWidth < 1024 ? 0 : 35}>
        {renderForm()}
      </Box>
    </Box>
  );
};

export default Dashboard;
