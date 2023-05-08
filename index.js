// imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import API ENDPOINTS ROUTES
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const warehouseRouter = require("./routes/warehouse");
const authRouter = require("./routes/auth");
const reqRouter = require("./routes/stockreq");

// Create App
const app = express();
const port = process.env.PORT || 4000;
const host = process.env.HOST || "localhost";

app.use(cors());

// Parse request body data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to db
const db = require("./config/database");
const admin = require("./middlewares/role");
const verifyToken = require("./middlewares/token-verfiy");
const role = require("./middlewares/role");

// Middlewares (Send request to specific endpoints)
app.use("/api/product", productRouter);
app.use("/api/warehouse", verifyToken, role("admin"), warehouseRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/stockreq", reqRouter);

// Listen to requests
app.listen(port, host, (res) => {
  console.log("Server is running");
});
