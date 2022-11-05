const morgan = require("morgan");
const express = require("express");
const helmet = require("helmet");
const mongosanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
const xss = require("xss-clean");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");

// Global Error Handler
const globalErrorHandler = require('./Controller/errController')

// Router 
const authRoute = require("./Routes/auth");
const blogRoute = require("./Routes/blog");

const app = express();

app.use(
  cors({
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());

// Setup express response and body parser configurations
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    proxy: true,
    resave: true,
    saveUnintialized: true,
    cookie: {
      secure: false,
    },
  })
);

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(mongosanitize());

app.use(xss());

app.use("/auth", authRoute);
app.use("/blog", blogRoute);

app.use(globalErrorHandler);

module.exports = app;
