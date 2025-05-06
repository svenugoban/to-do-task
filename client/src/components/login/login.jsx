import React, { useContext } from "react";
import "./login.css";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, Typography, Grid, Box, InputAdornment } from "@mui/material";
import { GoShieldLock } from "react-icons/go";
import { MdOutlineMail } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/actions/authActions";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.post(
        "/api/user/login",
        { email: values.email, password: values.password },
        { headers: { "Content-Type": "application/json" } }
      );
      dispatch(setUser(response.data.user));
      login(response.data.token);
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.msg;

        if (errorMessage.includes("User not found")) {
          setFieldError("email", "Incorrect Email");
        } else if (errorMessage.includes("Invalid credentials")) {
          setFieldError("password", "Incorrect Password");
        }
      } else {
        setFieldError("email", "Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-form'>
        <Grid item xs={12} sm={8} md={4}>
          <Box p={4}>
            <img src='/images/logo.png' alt='event' className='logo' />
            <Typography align='center' sx={{ fontSize: "38px", color: "black" }}>
              Welcome back
            </Typography>
            <Typography align='center' sx={{ fontSize: "16px", color: "black" }}>
              Sign in to Access my personalized dashboard
              <br />
              and perform ToDo task within the system
            </Typography>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, isSubmitting, errors, touched }) => (
                <Form className='form-details'>
                  <Typography sx={{ fontSize: "14px", color: "black", fontWeight: "bold" }} align='left' mt={2}>
                    Email
                  </Typography>
                  <Box>
                    <TextField
                      fullWidth
                      name='email'
                      type='email'
                      variant='outlined'
                      placeholder='Enter your Email'
                      onChange={handleChange}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Box mr={1}>
                              <MdOutlineMail size={"20px"} />
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                      className='text-field'
                    />
                  </Box>

                  <Typography sx={{ fontSize: "14px", color: "black", fontWeight: "bold" }} align='left' mt={2}>
                    Password
                  </Typography>
                  <Box>
                    <TextField
                      fullWidth
                      name='password'
                      type='password'
                      variant='outlined'
                      placeholder='Enter your Password'
                      onChange={handleChange}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Box mr={1}>
                              <GoShieldLock size={"20px"} />
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                      className='text-field'
                    />
                  </Box>

                  <Grid mt={3} mb={2}>
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
                        "Signing in..."
                      ) : (
                        <>
                          Login
                          <FaArrowRightLong style={{ marginLeft: 8 }} />
                        </>
                      )}
                    </Button>
                  </Grid>
                  <a href='/Register' className='register'>
                    Create your account
                  </a>
                </Form>
              )}
            </Formik>
          </Box>
        </Grid>
      </div>
    </div>
  );
};

export default Login;
