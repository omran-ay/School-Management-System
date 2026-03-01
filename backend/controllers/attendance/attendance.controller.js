const { pool } = require("../../config/index");
const asyncWrapper = require("../../middlewares/asyncWrapper");
const httpStatusText = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");
const { validationResult } = require("express-validator");

const markAttendance = asyncWrapper(async (req, res, next) => {
  const { student_id, course_id, attendance_date, status } = req.body;

  if (!student_id || !course_id || !attendance_date || !status) {
    return next(
      appError.create("All fields are required", 400, httpStatusText.FAIL),
    );
  }

  const result = await pool.query(
    `INSERT INTO attendance (student_id, course_id, attendance_date, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [student_id, course_id, attendance_date, status],
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const getAllAttendance = asyncWrapper(async (req, res) => {
  const result = await pool.query(`SELECT * FROM attendance`);
  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows,
  });
});

const getAttendanceById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query(
    `SELECT * FROM attendance WHERE attendance_id = $1`,
    [id],
  );

  if (result.rows.length === 0) {
    return next(
      appError.create("Attendance not found", 404, httpStatusText.FAIL),
    );
  }

  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const updateAttendance = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { student_id, course_id, attendance_date, status } = req.body;

  const result = await pool.query(
    `UPDATE attendance
     SET student_id = COALESCE($1, student_id),
         course_id = COALESCE($2, course_id),
         attendance_date = COALESCE($3, attendance_date),
         status = COALESCE($4, status)
     WHERE attendance_id = $5
     RETURNING *`,
    [student_id, course_id, attendance_date, status, id],
  );

  if (result.rows.length === 0) {
    return next(
      appError.create("Attendance not found", 404, httpStatusText.FAIL),
    );
  }

  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const deleteAttendance = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM attendance WHERE attendance_id = $1 RETURNING *`,
    [id],
  );

  if (result.rows.length === 0) {
    return next(
      appError.create("Attendance not found", 404, httpStatusText.FAIL),
    );
  }

  res.json({
    status: httpStatusText.SUCCESS,
    message: "Attendance deleted successfully",
  });
});

module.exports = {
  markAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};
