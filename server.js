//Basic Import
const express = require("express");
const next = require("next");
const dotenv = require("dotenv");
dotenv.config();
const router = require("./src/routes/api");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cluster = require("cluster");
const os = require("os");

//Security Middleware

const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

//Database Middleware
const mongoose = require("mongoose");

//Custom Express Server Setup In NextJS

const dev = process.env.NODE_ENV != "production";
const nextApp = next({ dev });

nextApp.prepare().then(() => {
  if (cluster.isMaster) {
    const numCPUs = os.cpus().length; // Get the number of CPU cores

    console.log(`Master process is running on PID ${process.pid}`);
    console.log(`Spawning 4 workers...`);

    // Fork workers for each CPU core
    for (let i = 0; i < 5; i++) {
      cluster.fork(); // Forking a worker for each CPU core
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
    const app = express();
    const expressServer = http.createServer(app);
    const io = new Server(expressServer);
    // Store active socket connections
    const activeSockets = new Set();

    io.on("connection", (socket) => {
      console.log("New user connected");

      // Add the socket to the activeSockets set
      activeSockets.add(socket);

      socket.on("msg", (data) => {
        io.sockets.emit("serverMSG", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");

        // Remove the socket from the activeSockets set
        activeSockets.delete(socket);
      });
    });

    //Middleware Implementation
    app.use(cookieParser());
    app.use(cors());
    app.use(mongoSanitize());
    app.use(xssClean());
    app.use(hpp());

    //Body parser implementation

    app.use(bodyParser.json({ limit: "10mb" }));
    app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

    // Mongo DB Database Connection
    let URI = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.fbrulyl.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

    // let URI = `mongodb://127.0.0.1:27017/${process.env.DATABASE_USERNAME}`;

    let OPTION = {
      autoIndex: true,
    };
    const OPTIONS = {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if no server is selected
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 10000, // Timeout after 10s if initial connection fails
      retryWrites: true,
      retryReads: true,
    };

    let retryAttempts = 0;
    const MAX_RETRIES = 5; // Maximum number of retry attempts
    const BASE_DELAY = 1000; // Initial delay of 1 second

    const connectWithRetry = async () => {
      try {
        await mongoose.connect(URI, OPTIONS);
        console.log("> Mongoose connected to DB");
        retryAttempts = 0; // Reset retry attempts on successful connection
      } catch (err) {
        retryAttempts++;
        if (retryAttempts > MAX_RETRIES) {
          console.error("> Max retries reached. Exiting...");
          process.exit(1); // Exit the process if max retries are reached
        }
        const delay = BASE_DELAY * Math.pow(2, retryAttempts); // Exponential backoff
        console.error(`> Mongoose connection error: ${err.message}`);
        console.log(`> Retrying connection in ${delay / 1000} seconds...`);
        setTimeout(connectWithRetry, delay); // Retry after calculated delay
      }
    };

    // Initial connection attempt
    connectWithRetry();

    // Handle connection events
    mongoose.connection.on("connected", () => {
      console.log("> Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("> Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("> Mongoose disconnected from DB");
      // Retry connection on disconnection
      connectWithRetry();
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("> Mongoose connection closed due to app termination");
      process.exit(0);
    });

    //file upload api endpoint
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public/uploads");
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        const filename = uniqueSuffix + fileExtension;
        cb(null, filename);
      },
    });

    const upload = multer({ storage });

    app.use(express.static("public"));

    app.post("/upload", upload.single("fileInput"), (req, res) => {
      // Get the file pathname based on the destination and filename generated by Multer
      const fileUrl = `/uploads/${req.file.filename}`;

      // Create a JSON response with the file pathname
      const jsonResponse = { message: "File uploaded successfully", fileUrl };

      res.status(200).json(jsonResponse);
    });

    //Routing are done here
    app.use("/apis/v1", router);

    app.all("*", (req, res) => {
      return nextApp.getRequestHandler()(req, res);
    });

    expressServer.listen(process.env.PORT || 5000, () => {
      console.log(">Server Ready on http://localhost:" + process.env.PORT);
    });
  }
});
