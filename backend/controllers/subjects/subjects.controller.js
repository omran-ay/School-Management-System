const { pool } = require("../../config/index");
const bcrypt = require("bcryptjs");
const generateJWT = require("../../utils/generateJWT");
const asyncWrapper = require("../../middlewares/asyncWrapper");
const httpStatusText = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");
const { validationResult } = require("express-validator");

const createSubject = asyncWrapper(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name) {
    return next(
      appError.create("Subject name is required", 400, httpStatusText.FAIL),
    );
  }

  const result = await pool.query(
    "INSERT INTO subjects (name, description) VALUES ($1, $2) RETURNING *",
    [name, description || null],
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const getAllSubjects = asyncWrapper(async (req, res, next) => {
  const result = await pool.query("SELECT * FROM subjects ORDER BY subject_id");

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: result.rows,
  });
});

const getSubjectById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT * FROM subjects WHERE subject_id = $1",
    [id],
  );

  if (result.rows.length === 0) {
    return next(appError.create("Subject not found", 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const updateSubject = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const result = await pool.query(
    `
    UPDATE subjects SET
      name = COALESCE($1, name),
      description = COALESCE($2, description)
    WHERE subject_id = $3
    RETURNING *
    `,
    [name, description, id],
  );

  if (result.rows.length === 0) {
    return next(appError.create("Subject not found", 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const deleteSubject = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM subjects WHERE subject_id = $1 RETURNING *",
    [id],
  );

  if (result.rows.length === 0) {
    return next(appError.create("Subject not found", 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Subject deleted successfully",
    data: result.rows[0],
  });
});

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
