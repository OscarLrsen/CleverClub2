import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";
import adminRoute from "./routes/adminRoute.js";
import User from "./models/user.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/admin", adminRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));

const createAdminUser = async () => {
  const existingAdmin = await User.findOne({ username: "admin" });
  if (!existingAdmin) {
    const admin = new User({
      username: "admin",
      email: "admin@a.com",
      password: "admin123",
      role: "admin",
    });
    await admin.save();
    console.log("Adminkonto skapat");
  } else {
    console.log("Admin finns redan");
  }
};

createAdminUser();
