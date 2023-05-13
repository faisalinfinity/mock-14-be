require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connection } = require("./connection/connection");
const { userRoute } = require("./routes/userRoute");
const { blogRoute } = require("./routes/blogRoute");
app.use(cors());
app.use(express.json());
app.use("/",userRoute)
app.use("/",blogRoute)

let port = process.env.PORT;

app.listen(port, async () => {
  await connection;
  console.log(`Connected to mongoDb on port ${port}`);
});
