const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
var cors = require("cors");

const DB_URL = "mongodb://127.0.0.1:27017/INotesDb";
const PORT = 3005;
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const notesRoutes = require("./routes/notes");

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });
app.use(morgan("dev"));

// use cors
app.use(cors());

// pass json data to the server
app.use(express.json());

// application routes
app.use(authRoutes);
app.use(userRoutes);
app.use(notesRoutes);

app.listen(PORT, () => {
  console.log(`INoteBook Server Running on Port http://localhost:${PORT}`);
}); 