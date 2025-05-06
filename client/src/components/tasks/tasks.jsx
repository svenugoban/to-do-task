import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Card, CardContent, Divider } from "@mui/material";
import TaskCreateForm from "./taskCreateForm";
import CustomDialog from "../../common/customDialog";
import axios from "axios";
import { useSelector } from "react-redux";

const Tasks = () => {
  const user = useSelector((state) => state.auth.user);
  const [openCreate, setOpenCreate] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [refresh, setRefresh] = useState(false);

  const handleComplete = async (task) => {
    setRefresh(true); // Set refresh state before making the requests
    try {
      await axios.put(`/api/todo/task/${task?.id}`, {
        completedBy: user.username,
        status: "completed",
      });
    } catch (error) {
      console.error("Registration failed", error);
    }
    setRefresh(false); // Set refresh state before making the requests
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/todo/taskAll");
        setTasks(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [refresh]); // re-fetch when filters change

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography sx={{ fontSize: "24px", fontWeight: "bold", color: "black" }} align='left'>
        Tasks
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2} alignItems='center' justifyContent='flex-end' mb={2} mt={2}>
        <Grid item xs={12} sm='auto' mt={2}>
          <Button
            sx={{ textTransform: "none" }}
            variant='contained'
            onClick={() => {
              setOpenCreate(true);
            }}
          >
            + Create Task
          </Button>
        </Grid>
      </Grid>

      <Box>
        {tasks?.map((task, idx) => (
          <Box mt={2}>
            <Card>
              <CardContent>
                <Box display='flex' alignItems='center' mt={1}>
                  <Typography fontWeight='bold'>{task.title}</Typography>
                </Box>
                <Typography sx={{ fontSize: "14px", color: "black" }} mt={1}>
                  {task.description}
                </Typography>

                <Box display='flex' justifyContent='flex-end' gap={2} mt={3}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      handleComplete(task); // Store the selected task
                    }}
                    sx={{ textTransform: "none" }}
                  >
                    Done
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <CustomDialog
        isOpen={openCreate}
        onClose={() => {
          setOpenCreate(false);
        }}
        title={"Add A Task"}
      >
        <TaskCreateForm
          onClose={() => {
            setOpenCreate(false);
          }}
          setRefresh={setRefresh}
        />
      </CustomDialog>
    </Box>
  );
};

export default Tasks;
