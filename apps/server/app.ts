const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const passportConfig = require('./src/auth/passportLogin')
const dotenv = require('dotenv');
const PORT = 8080;
dotenv.config();
const app = express();
app.use(session({
    secret: process.env.SECRET_PASSWORD || "default secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.listen(PORT, () =>{console.log("App running on port 8080")})