require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Anslut till MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB ansluten"))
  .catch((err) => console.error("❌ Fel vid anslutning:", err.message));

// Testroute
app.get("/", (req, res) => {
  res.send("MongoDB-backend är igång");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server körs på port ${PORT}`));
