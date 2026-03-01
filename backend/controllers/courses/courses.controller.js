const { pool } = require("../../config/index");
const bcrypt = require("bcryptjs");
const generateJWT = require("../../utils/generateJWT");
const asyncWrapper = require("../../middlewares/asyncWrapper");
const httpStatusText = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");
const { validationResult } = require("express-validator");

const createCourse = asyncWrapper(async (req, res, next) => {
  const { subject_id, teacher_id, classroom_id } = req.body;
  console.log("course", [subject_id, teacher_id, classroom_id]);

  if (!subject_id || !teacher_id || !classroom_id) {
    return next(
      appError.create("All fields are required", 400, httpStatusText.FAIL),
    );
  }

  const checkQuery = `
      SELECT * FROM courses
      WHERE subject_id = $1 AND teacher_id = $2 AND classroom_id = $3
      LIMIT 1
    `;
  const checkResult = await pool.query(checkQuery, [
    subject_id,
    teacher_id,
    classroom_id,
  ]);

  if (checkResult.rows.length > 0) {
    return next(
      appError.create(
        "this course already exists with the same teacher, subject, and classroom",
        400,
        httpStatusText.FAIL,
      ),
    );
  }

  const result = await pool.query(
    `INSERT INTO courses (subject_id, teacher_id, classroom_id)
     VALUES ($1, $2, $3) RETURNING *`,
    [subject_id, teacher_id, classroom_id],
  );
  console.log("result.rows[0]", result.rows[0]);

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = `
    SELECT 
      c.course_id,
      s.subject_id,
      s.name AS subject_name,
      cl.classroom_id,
      cl.name AS classroom_name,
      t.teacher_id,
      u.first_name || ' ' || u.last_name AS teacher_name
    FROM courses c
    JOIN subjects s ON c.subject_id = s.subject_id
    JOIN classrooms cl ON c.classroom_id = cl.classroom_id
    JOIN teachers t ON c.teacher_id = t.teacher_id
    JOIN users u ON t.user_id = u.user_id
    ORDER BY c.course_id ASC
  `;
  const result = await pool.query(query);
  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows,
  });
});

const getCourseById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const query = `
    SELECT 
      c.course_id,
      s.subject_id,
      s.name AS subject_name,
      cl.classroom_id,
      cl.name AS classroom_name,
      t.teacher_id,
      u.first_name || ' ' || u.last_name AS teacher_name
    FROM courses c
    JOIN subjects s ON c.subject_id = s.subject_id
    JOIN classrooms cl ON c.classroom_id = cl.classroom_id
    JOIN teachers t ON c.teacher_id = t.teacher_id
    JOIN users u ON t.user_id = u.user_id
    WHERE c.course_id = $1
    LIMIT 1
  `;
  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    return next(appError.create("Course not found", 404, httpStatusText.FAIL));
  }

  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { subject_id, teacher_id, classroom_id } = req.body;

  const checkQuery = `
      SELECT * FROM courses
      WHERE subject_id = $1 AND teacher_id = $2 AND classroom_id = $3
      LIMIT 1
    `;
  const checkResult = await pool.query(checkQuery, [
    subject_id,
    teacher_id,
    classroom_id,
  ]);

  if (checkResult.rows.length > 0) {
    return next(
      appError.create(
        "this course already exists with the same teacher, subject, and classroom",
        400,
        httpStatusText.FAIL,
      ),
    );
  }

  const result = await pool.query(
    `UPDATE courses
     SET subject_id = COALESCE($1, subject_id),
         teacher_id = COALESCE($2, teacher_id),
         classroom_id = COALESCE($3, classroom_id)
     WHERE course_id = $4
     RETURNING *`,
    [subject_id, teacher_id, classroom_id, id],
  );

  if (result.rows.length === 0) {
    return next(appError.create("Course not found", 404, httpStatusText.FAIL));
  }

  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query(
    "DELETE FROM courses WHERE course_id = $1 RETURNING *",
    [id],
  );

  if (result.rows.length === 0) {
    return next(appError.create("Course not found", 404, httpStatusText.FAIL));
  }

  res.json({
    status: httpStatusText.SUCCESS,
    message: "Course deleted successfully",
  });
});

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
