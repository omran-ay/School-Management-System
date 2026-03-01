const { pool } = require("../../config/index");
const asyncWrapper = require("../../middlewares/asyncWrapper");
const httpStatusText = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");
const { validationResult } = require("express-validator");

const enrollStudent = asyncWrapper(async (req, res, next) => {
  const { student_id, course_id } = req.body;

  if (!student_id || !course_id) {
    return next(
      appError.create(
        "student_id and course_id are required",
        400,
        httpStatusText.FAIL,
      ),
    );
  }
  const checkStudent = await pool.query(
    "SELECT student_id FROM students WHERE student_id = $1",
    [student_id],
  );

  if (checkStudent.rows.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Student not found",
    });
  }

  const result = await pool.query(
    `INSERT INTO enrollment (student_id, course_id)
     VALUES ($1, $2)
     RETURNING *`,
    [student_id, course_id],
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const getAllEnrollments = asyncWrapper(async (req, res) => {
  const result = await pool.query(`SELECT * FROM enrollment`);
  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows,
  });
});

const getEnrollmentById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query(
    `SELECT * FROM enrollment WHERE enrollment_id = $1`,
    [id],
  );

  if (result.rows.length === 0) {
    return next(
      appError.create("Enrollment not found", 404, httpStatusText.FAIL),
    );
  }

  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const updateEnrollment = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { student_id, course_id } = req.body;

  const result = await pool.query(
    `UPDATE enrollment
     SET student_id = COALESCE($1, student_id),
         course_id = COALESCE($2, course_id)
     WHERE enrollment_id = $3
     RETURNING *`,
    [student_id, course_id, id],
  );

  if (result.rows.length === 0) {
    return next(
      appError.create("Enrollment not found", 404, httpStatusText.FAIL),
    );
  }

  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const deleteEnrollment = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM enrollment WHERE enrollment_id = $1 RETURNING *`,
    [id],
  );

  if (result.rows.length === 0) {
    return next(
      appError.create("Enrollment not found", 404, httpStatusText.FAIL),
    );
  }

  res.json({
    status: httpStatusText.SUCCESS,
    message: "Enrollment deleted successfully",
  });
});

module.exports = {
  enrollStudent,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};
