import jwt from "jsonwebtoken";

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REF_JWT_EXPIRES_IN,
  });
};
export default generateRefreshToken;
