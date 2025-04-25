const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");

const loginRoutes = require("./src/routes/loginRoutes.ts");
const messageRoutes = require("./src/routes/messageRoutes.ts");
const userRoutes = require("./src/routes/userRoutes.ts");

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SECRET_PASSWORD || "default secret",
  resave: false,
  saveUninitialized: false,
}));

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};
app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/', loginRoutes);
app.use('/api/', messageRoutes);
app.use('/api/', userRoutes);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
