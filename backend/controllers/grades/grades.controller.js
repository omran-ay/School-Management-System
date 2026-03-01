const { pool } = require("../../config/index");
const asyncWrapper = require("../../middlewares/asyncWrapper");
const httpStatusText = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");
const { validationResult } = require("express-validator");
const addGrade = asyncWrapper(async (req, res, next) => {
  const { student_id, course_id, evaluation_type, score, graded_on } = req.body;

  if (!student_id || !course_id || !evaluation_type || score == null) {
    return next(
      appError.create("All fields are required", 400, httpStatusText.FAIL),
    );
  }

  const result = await pool.query(
    `INSERT INTO grades (student_id, course_id, evaluation_type, score, graded_on)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [student_id, course_id, evaluation_type, score, graded_on || new Date()],
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const getAllGrades = asyncWrapper(async (req, res) => {
  const result = await pool.query(`SELECT * FROM grades`);
  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows,
  });
});

const getGradeById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query(`SELECT * FROM grades WHERE grade_id = $1`, [
    id,
  ]);

  if (result.rows.length === 0) {
    return next(appError.create("Grade not found", 404, httpStatusText.FAIL));
  }

  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const updateGrade = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { student_id, course_id, evaluation_type, score, graded_on } = req.body;

  const result = await pool.query(
    `UPDATE grades
     SET student_id = COALESCE($1, student_id),
         course_id = COALESCE($2, course_id),
         evaluation_type = COALESCE($3, evaluation_type),
         score = COALESCE($4, score),
         graded_on = COALESCE($5, graded_on)
     WHERE grade_id = $6
     RETURNING *`,
    [student_id, course_id, evaluation_type, score, graded_on, id],
  );

  if (result.rows.length === 0) {
    return next(appError.create("Grade not found", 404, httpStatusText.FAIL));
  }

  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const deleteGrade = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM grades WHERE grade_id = $1 RETURNING *`,
    [id],
  );

  if (result.rows.length === 0) {
    return next(appError.create("Grade not found", 404, httpStatusText.FAIL));
  }

  res.json({
    status: httpStatusText.SUCCESS,
    message: "Grade deleted successfully",
  });
});

module.exports = {
  getAllGrades,
  getGradeById,
  addGrade,
  updateGrade,
  deleteGrade,
};
