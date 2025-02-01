// want to vrify the user token before they can access the protected routes
//first steps
import jsonwebtoken from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  // Get the token from the request
  const token = req.cookies.token;

  // If there is no token, return an error
  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied" });
  }

  try {
    // Verify the token
    const verified = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      return res.status(401).json({ success: false, message: "Access Denied" });
    }
    // Set the userId in the request object
    req.userId = verified.userId;
    next();
  } catch (error) {
    console.log("Error in verifyToken", error);
    res.status(401).json({ sucess: false, message: "" });
  }
};
