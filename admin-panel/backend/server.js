const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
// const Damage = require("../model/damages");
const Report = require("../model/damages");
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "your-government-secret-key-change-in-production";

// Middleware
app.use(cors());
app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://ronakparmar2428_db_user:abc%40123@staticdetection.z53q1az.mongodb.net/StaticDetection?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(console.error);


app.get("/api/damages", async (req, res) => {
  try {
    // const damages = await Damage.find();
    const damages = await Report.find();
    // console.log(damages);
    res.json(damages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Static user credentials (in production, use a proper database)
const STATIC_USERS = [
  {
    id: 1,
    username: "admin",
    password: "$2b$10$gG9AA3ay2hfKLzdkIcEry.LdnYXJgxRCZqfeNM5jVXCWN8fXO9ryq", // government123
    name: "Administrator",
    role: "admin",
    department: "System Administration",
  },
  {
    id: 2,
    username: "officer",
    password: "$2b$10$oA4YewNVMnhI/reNaDf9iOqQ3yLLqz8r.CF5wt6PvCZbm05q0X5XS", // officer456
    name: "John Officer",
    role: "officer",
    department: "Public Services",
  },
];

// Helper function to find user by username
const findUserByUsername = (username) => {
  return STATIC_USERS.find((user) => user.username === username);
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Government Portal API is running",
    timestamp: new Date().toISOString(),
  });
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find user
    const user = findUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user info and token (excluding password)
    const { password: userPassword, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get current user endpoint
app.get("/api/user", authenticateToken, (req, res) => {
  const user = STATIC_USERS.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { password, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.get("api/damages", (req, res) => {
  res.json([
    { id: 1, type: "Flood", location: "Area A", severity: "High" },
    { id: 2, type: "Earthquake", location: "Area B", severity: "Medium" },
    { id: 3, type: "Fire", location: "Area C", severity: "Low" },
  ]);
});

// Protected dashboard data endpoint
app.get("/api/dashboard/stats", authenticateToken, (req, res) => {
  res.json({
    totalUsers: 1247,
    activeServices: 23,
    pendingRequests: 156,
    systemHealth: "Operational",
    lastUpdated: new Date().toISOString(),
  });
});

// Logout endpoint (for token blacklisting if needed)
app.post("/api/logout", authenticateToken, (req, res) => {
  // In a real application, you might want to blacklist the token
  res.json({ message: "Logged out successfully" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Government Portal API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/login`);
  console.log("");
  console.log("📋 Available test credentials:");
  console.log("   Username: admin, Password: government123");
  console.log("   Username: officer, Password: officer456");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});
