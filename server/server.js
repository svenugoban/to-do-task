const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/taskRouter");
const userRoutes = require("./routes/userRouter");
const runMigration = require("./config/migration");

dotenv.config();

const app = express();

runMigration();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/todo", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
