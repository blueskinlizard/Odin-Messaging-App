const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const env = require("node:process");
/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunction */ 

const app = express();

app.use(session({
    secret: env("SECRET_PASSWORD"),
    resave: false,
    saveUninitialized: false
}));
