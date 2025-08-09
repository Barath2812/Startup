const express = require("express");
const { registerUser , login , isAuth , logout } = require("../controllers/userController");
const authUser = require("../middlewares/authUser");

const userRouter = express.Router();

userRouter.post("/register", registerUser); // changed endpoint to /register
userRouter.post("/login", login);
userRouter.get("/is-auth",  authUser , isAuth);
userRouter.post("/logout", authUser , logout);
module.exports = userRouter;
