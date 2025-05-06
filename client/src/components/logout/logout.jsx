import React, { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetState } from "../../redux/actions/authActions";
import { Box, Button, Typography } from "@mui/material";

const Logout = ({ onClose }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux dispatch function

  const handleLogoutConfirm = () => {
    // Dispatch Redux reset action to clear the store
    dispatch(resetState());

    // Clear local storage and session storage (if applicable)
    localStorage.clear();
    sessionStorage.clear();

    // Call the existing logout function
    logout();

    // Redirect to login page
    navigate("/login");
  };

  return (
    <Box>
      <Typography sx={{ fontSize: "14px", color: "black" }} mt={1}>
        Unsaved changes will be lost. Please save your work before logging out. Confirm to proceed.
      </Typography>

      <Box display='flex' justifyContent='flex-end' gap={2} mt={3}>
        <Button type='button' variant='outlined' sx={{ textTransform: "none" }} onClick={onClose}>
          Cancel
        </Button>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          sx={{ textTransform: "none" }}
          onClick={handleLogoutConfirm}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Logout;
