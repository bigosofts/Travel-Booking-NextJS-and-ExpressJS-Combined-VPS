const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const expressServer = http.createServer(app); // Create HTTP server using express app

// Enable CORS for Socket.io
const io = new Server(expressServer, {
  cors: {
    origin: ["http://localhost:5000", "https://activeascents.com"], // Allow connections from your frontend (update this if frontend is on a different port)
    methods: ["GET", "POST"],
  },
});

// Store active socket connections
const activeSockets = new Set();

io.on("connection", (socket) => {
  console.log("New user connected");

  // Add the socket to the activeSockets set
  activeSockets.add(socket);

  socket.on("msg", (data) => {
    io.sockets.emit("serverMSG", data); // Broadcast message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");

    // Remove the socket from the activeSockets set
    activeSockets.delete(socket);
  });
});

// Handle HTTP requests separately from WebSocket
app.use("/", (req, res) => {
  res.status(200).send("Socket Server Working"); // This should now work
});

expressServer.listen(3000, () => {
  console.log("> Socket Server Ready on http://localhost:3000");
});
