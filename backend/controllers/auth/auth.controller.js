const { pool } = require("../../config/index");
const bcrypt = require("bcryptjs");
const generateJWT = require("../../utils/generateJWT");
const asyncWrapper = require("../../middlewares/asyncWrapper");
const httpStatusText = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { response } = require("express");

const Registration = asyncWrapper(async (req, res, next) => {
  const { first_name, last_name, email, password, role_id = 1 } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(
      errors.array()[0].msg,
      422,
      httpStatusText.FAIL,
    );
    return next(error);
  }
  console.log(errors);

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

  if (existingUser.rows.length > 0) {
    const error = appError.create(
      "user already exists",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUserResult = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password,role_id)
       VALUES ($1, $2, $3, $4,$5) RETURNING *`,
    [first_name, last_name, email, hashedPassword, role_id],
  );

  const newUser = newUserResult.rows[0];

  const roleResult = await pool.query(
    "SELECT role_name FROM roles WHERE role_id = $1",
    [role_id],
  );
  if (roleResult.rows.length === 0) {
    const error = appError.create(
      "Role 'Admin' not found",
      500,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  const role_name = roleResult.rows[0].role_name;
  // ==================================================================
  const token = await generateJWT({
    email: newUser.email,
    id: newUser.user_id,
    role: role_name,
  });
  console.log("newUser.role", role_name);
  console.log("newUser.email", newUser.email);
  console.log(" newUser.user_id", newUser.user_id);

  const tokenOption = {
    httpOnly: true,
    secure: true,
  };

  res.cookie("token", token, tokenOption).status(201).json({
    message: "Registration successfully",
    status: httpStatusText.SUCCESS,
    data: newUser,
  });
});

const Login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = appError.create(
      "Email and password are requird",
      400,
      httpStatusText.FAIL,
    );

    return next(error);
  }

  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = userResult.rows[0];
  if (!user) {
    const error = appError.create("User not found", 400, httpStatusText.FAIL);
    console.log("User not found");
    return next(error);
  }
  role_Id = userResult.rows[0].role_id;
  const matchPassword = await bcrypt.compare(password, user.password);
  const roleResult = await pool.query(
    "SELECT role_name FROM roles WHERE role_id = $1",
    [role_Id],
  );
  if (roleResult.rows.length === 0) {
    const error = appError.create(
      "Role 'Admin' not found",
      500,
      httpStatusText.FAIL,
    );
    return next(error);
  }
  const role_name = roleResult.rows[0].role_name;
  console.log("user.password", user.password);

  if (user && matchPassword) {
    const token = await generateJWT({
      email: user.email,
      id: user.id,
      role: role_name,
    });
    console.log("matchPassword", matchPassword);

    // console.log("newUser.role", role_name);
    // console.log("newUser.email", user.email);
    // console.log(" newUser.user_id", user.user_id);
    const tokenOption = {
      httpOnly: true,
      secure: true,
    };
    return res.cookie("token", token, tokenOption).status(201).json({
      message: "Login successfully",
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    const error = appError.create(
      "The Password Not Correct",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }
});

const ForgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  // console.log("userResult", userResult);

  const user = userResult.rows[0];
  console.log("user", user);

  if (!user) {
    const error = appError.create("user not fount", 400, httpStatusText.FAIL);
    return next(error);
  }
  role_Id = user.role_id;
  console.log("role_Id", role_Id);

  const roleResult = await pool.query(
    "SELECT role_name FROM roles WHERE role_id = $1",
    [role_Id],
  );

  const role_name = roleResult.rows[0].role_name;
  console.log("role_name", role_name);

  const secret = process.env.JWT_SECRET_KEY + user.password;
  const token = jwt.sign(
    {
      email: user.email,
      id: user.user_id,
      role: role_name,
    },
    secret,
    { expiresIn: "10m" },
  );

  const link = `http://localhost:3000/ResetPassword/${user.user_id}/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });
  console.log(process.env.USER_EMAIL);
  console.log(process.env.USER_PASS);

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Reset Password",
    html: `
    <div>
    <h4>
    Click on the link below to reset your password
    </h4>
    <p>${link} </p>
     </div>
    
    `,
  };

  transporter.sendMail(mailOptions, function (success, error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent: " + success.response);
    }
  });

  res.json({ message: "success" });
});

const ResetPassword = asyncWrapper(async (req, res, next) => {
  const { user_id, token } = req.params;
  console.log("user_id", user_id);
  console.log("token", token);
  const userResult = await pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [user_id],
  );
  const user = userResult.rows[0];
  // console.log("userResult", userResult);
  if (!user) {
    const error = appError.create("user not fount", 400, httpStatusText.FAIL);
    return next(error);
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  console.log("user.password", user.password);

  try {
    jwt.verify(token, secret);
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    hashedPassword = req.body.password;
    console.log("hashedPassword", hashedPassword);
    await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [
      hashedPassword,
      user_id,
    ]);
    res.json({ message: "Reset Password Successfully" });
  } catch (err) {
    console.log(err);
    res.json({ message: "Error" });
  }
});

module.exports = {
  Registration,
  Login,
  ForgotPassword,
  ResetPassword,
};
