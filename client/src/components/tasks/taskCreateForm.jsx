import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import axios from "axios";

const initialValues = {
  title: "",
  status: "pending",
  description: "",
};

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const TaskCreateForm = ({ onClose, setRefresh }) => {
  const handleSubmit = async (values) => {
    setRefresh(true); // Set refresh state before making the requests
    try {
      await axios.post("/api/todo/task", {
        title: values.title,
        status: "pending",
        description: values.description,
      });

      onClose();
    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
      } else {
        console.error("Request error:", error.message);
      }
    }
    setRefresh(false); // Set refresh state afeter making the requests
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, errors, touched, handleChange }) => (
        <Form>
          <Box ml={2} mr={2}>
            <Typography sx={{ fontSize: "14px", color: "black", fontWeight: "bold" }}>Task Title</Typography>
            <TextField
              fullWidth
              label='Title'
              name='title'
              value={values.title}
              onChange={handleChange}
              error={touched.title && Boolean(errors.title)}
              helperText={touched.title && errors.title}
              margin='normal'
            />

            <Typography sx={{ fontSize: "14px", color: "black", fontWeight: "bold" }} mt={1}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label='Description'
              name='description'
              value={values.description}
              onChange={handleChange}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
              margin='normal'
            />

            <Box display='flex' justifyContent='flex-end' gap={2} mt={3}>
              <Button type='button' variant='outlined' sx={{ textTransform: "none" }} onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='primary' sx={{ textTransform: "none" }}>
                Add
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default TaskCreateForm;
