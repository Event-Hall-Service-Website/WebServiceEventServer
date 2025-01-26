import express from "express";
// import connectDB from "./db"; // Uncomment and set up database connection
import morgan from "morgan";

// server setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.all("*", (req, res) => {
  res.send("Welcome to Event Hall Services.");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start Server
app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
  // connectDB(); // Uncomment when database is ready
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
  });
});
