const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const env = require("node:process");

const app = express();

app.use(session({
    secret: env("SECRET_PASSWORD"),
    resave: false,
    saveUninitialized: false
}));
