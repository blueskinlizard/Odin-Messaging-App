const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require('dotenv');
const cors = require("cors");
const PORT = 8080;
dotenv.config();
const app = express();
app.use(session({
    secret: process.env.SECRET_PASSWORD || "default secret",
    resave: false,
    saveUninitialized: false
}));
const corsOptions = {
    origin: 'http://localhost:5173'
}
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());


app.listen(PORT, () =>{console.log("App running on port 8080")})