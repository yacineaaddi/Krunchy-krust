import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      console.log("no token provided");
      return res.status(401).json({ message: "there is no provided token" });
    }

    const decode = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.user = await User.findById(decode.id).select("-password");

    if (!req.user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Token failed" });
  }
};
