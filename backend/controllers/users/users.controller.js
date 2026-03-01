const { pool } = require("../../config/index");
const bcrypt = require("bcryptjs");
const generateJWT = require("../../utils/generateJWT");
const asyncWrapper = require("../../middlewares/asyncWrapper");
const httpStatusText = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");
const { validationResult } = require("express-validator");

const GetAllUsers = asyncWrapper(async (req, res) => {
  const users = await pool.query("SELECT * FROM users");
  res.status(200).json({
    message: "Get All data Successfully",
    status: httpStatusText.SUCCESS,
    data: users.rows,
  });
});

const GetSingleUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [
    userId,
  ]);
  console.log(user);
  if (user.rows.length === 0) {
    const error = appError.create("User Not Found!", 400, httpStatusText.FAIL);
    return next(error);
  }

  res.status(201).json({
    message: "Get User Successfully",
    status: httpStatusText.SUCCESS,
    data: user.rows[0],
  });
});

const UpdateUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId;
  const { first_name, last_name, email, password, role_id } = req.body;
  console.log("userId", userId);
  console.log("role_id", role_id);
  console.log("email", email);
  console.log("first_name", first_name);
  console.log("last_name", last_name);

  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    userId,
  ]);

  if (result.rows.length === 0) {
    const error = appError.create("User not found", 404, httpStatusText.FAIL);
    return next(error);
  }

  // let hashedPassword;
  // if (password) {
  //   hashedPassword = await bcrypt.hash(password, 10);
  // }

  let hashedPassword = null;
  if (req.body.hasOwnProperty("password")) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const query = `UPDATE users
     SET
       first_name = COALESCE($1, first_name),
       last_name = COALESCE($2, last_name),
       email = COALESCE($3, email),
       password = COALESCE($4, password),
      role_id  = COALESCE($5, role_id )
     WHERE user_id = $6
     RETURNING *`;

  // const value = [
  //   first_name || null,
  //   last_name || null,
  //   email || null,
  //   hashedPassword || null,
  //   role_id || null,
  //   userId,
  // ];

  const value = [
    req.body.hasOwnProperty("first_name") ? first_name : null,
    req.body.hasOwnProperty("last_name") ? last_name : null,
    req.body.hasOwnProperty("email") ? email : null,
    req.body.hasOwnProperty("password") ? hashedPassword : null,
    req.body.hasOwnProperty("role_id") ? role_id : null,
    userId,
  ];
  const updatedUser = await pool.query(query, value);

  res.status(200).json({
    message: "User updated successfully",
    status: httpStatusText.SUCCESS,
    data: updatedUser.rows[0],
  });
});

const DeleteUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId;

  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    userId,
  ]);

  if (result.rows.length === 0) {
    const error = appError.create("User not found", 404, httpStatusText.FAIL);
    return next(error);
  }

  await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);

  res.status(200).json({
    message: "User deleted successfully",
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

module.exports = {
  GetAllUsers,
  UpdateUser,
  DeleteUser,
  GetSingleUser,
};
