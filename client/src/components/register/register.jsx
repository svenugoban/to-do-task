import React from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./register.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

// Common Input Styles
const inputStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    marginBottom: "5px",
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "15px",
  },
};

const Register = () => {
  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // API call
      await axios.post(
        "/api/user/register",
        { username: values.username, email: values.email, password: values.password },
        { headers: { "Content-Type": "application/json" } }
      );

      resetForm();
      navigate("/login");
    } catch (error) {
      if (error.response) {
        console.error("Server responded with error:", error.response.data);
        alert(`Registration failed: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        alert("Registration failed: No response from server");
      } else {
        console.error("Error setting up request:", error.message);
        alert(`Registration failed: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Grid className='register-container'>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleSubmit, errors, touched, isSubmitting }) => (
          <Form className='register-form' onSubmit={handleSubmit}>
            <Grid item xs={12} sm={8} md={4}>
              <img src='/images/logo.png' alt='event' className='logo' />
              <Typography variant='h4' align='center' gutterBottom>
                Register Form
              </Typography>
              <Typography variant='body1' align='center' gutterBottom>
                Register to Access my personalized dashboard
                <br />
                and perform ToDo task within the system
              </Typography>

              <Grid item xs={12}>
                <Typography sx={{ fontSize: "14px", color: "black", fontWeight: "bold" }} align='left' mt={2}>
                  User Name
                </Typography>
                <TextField
                  fullWidth
                  name='username'
                  variant='outlined'
                  placeholder='Enter your username'
                  value={values.username}
                  onChange={handleChange}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: "14px", color: "black", fontWeight: "bold" }} align='left' mt={1}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  name='email'
                  type='email'
                  variant='outlined'
                  placeholder='Enter your email'
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: "14px", color: "black", fontWeight: "bold" }} align='left' mt={1}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  variant='outlined'
                  placeholder='Enter your password'
                  name='password'
                  type='password'
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={inputStyle}
                />
              </Grid>

              <Grid mt={3}>
                <Button
                  fullWidth
                  variant='contained'
                  type='submit'
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "#54BBE3",
                    "&:hover": {
                      backgroundColor: "#47A7CC",
                    },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textTransform: "none",
                  }}
                >
                  {isSubmitting ? (
                    "Registering in..."
                  ) : (
                    <>
                      Register
                      <FaArrowRightLong style={{ marginLeft: 8 }} />
                    </>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Grid>
  );
};

export default Register;
