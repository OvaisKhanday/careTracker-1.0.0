import jwt from "jsonwebtoken";

export default function validateAdmin(req, res, next) {
  if (tokenValidation(req) && req.body.payload.role === "admin") {
    // token is valid
    next();
  } else {
    res.status(403).json({
      is_token_valid: false,
      message: "token invalid",
    });
    return;
  }
}

export function validateParent(req, res, next) {
  if (tokenValidation(req) && req.body.payload.role === "parent") {
    // token is valid
    next();
  } else {
    res.status(403).json({
      is_token_valid: false,
      message: "token invalid",
    });
    return;
  }
}

export function validateDriver(req, res, next) {
  if (tokenValidation(req) && req.body.payload.role === "driver") {
    // token is valid
    next();
  } else {
    res.status(403).json({
      is_token_valid: false,
      message: "token invalid",
    });
    return;
  }
}

function tokenValidation(req) {
  const authorization = req.headers["authorization"];
  // authorization = "Bearer $token"

  let payload;
  try {
    const token = authorization.split(" ")[1];
    payload = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (error) {
    return false;
  }
  // embed the payload in req.body.
  req.body.payload = payload;
  return true;
}
