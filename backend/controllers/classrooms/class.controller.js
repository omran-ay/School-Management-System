const { pool } = require("../../config/index");
const bcrypt = require("bcryptjs");
const generateJWT = require("../../utils/generateJWT");
const asyncWrapper = require("../../middlewares/asyncWrapper");
const httpStatusText = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");
const { validationResult } = require("express-validator");

const getAllClassrooms = asyncWrapper(async (req, res) => {
  const classrooms = await pool.query("SELECT * FROM classrooms");
  res.status(200).json({
    message: "Get All Classrooms Successfully",
    status: httpStatusText.SUCCESS,
    data: classrooms.rows,
  });
});

const GetSingleClassroom = asyncWrapper(async (req, res, next) => {
  const classId = req.params.classId;

  const classroom = await pool.query(
    `SELECT * FROM classrooms WHERE classroom_id = $1`,
    [classId],
  );
  if (classroom.rows.length === 0) {
    const error = appError.create(
      "classroom Not Found!",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  res.status(201).json({
    message: "Get classroom Successfully",
    status: httpStatusText.SUCCESS,
    data: classroom.rows[0],
  });
});

const addNewClassrooms = asyncWrapper(async (req, res, next) => {
  const {
    name,
    grade_id,
    section,
    academic_year,
    teacher_id,
    max_students,
    min_students,
    status,
  } = req.body;

  if (!grade_id) {
    return next(
      appError.create("Intermediate level required", 400, httpStatusText.FAIL),
    );
  }

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

  if (!name) {
    return next(
      appError.create("calss name required", 400, httpStatusText.FAIL),
    );
  }

  const insertQuery = `
    INSERT INTO classrooms 
      (name, grade_id, section, academic_year, teacher_id, max_students, min_students, status)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const existing = await pool.query(
    "SELECT * FROM classrooms WHERE name = $1",
    [name],
  );

  if (existing.rows.length > 0) {
    const error = appError.create(
      "Classrooms alredy exists",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  const result = await pool.query(insertQuery, [
    name,
    grade_id,
    section || null,
    academic_year,
    teacher_id || null,
    max_students || null,
    min_students || null,
    status || "active",
  ]);

  newClassrooms = result.rows[0];
  res.json({
    status: httpStatusText.SUCCESS,
    message: "Add new classrooms successfully",
    data: newClassrooms,
  });
});

const UpdateClassrooms = asyncWrapper(async (req, res, next) => {
  const classroomId = req.params.classId;
  console.log(classroomId);
  const {
    name,
    grade_id,
    section,
    academic_year,
    teacher_id,
    max_students,
    min_students,
    status,
  } = req.body;

  const checkResult = await pool.query(
    "SELECT * FROM classrooms WHERE classroom_id = $1",
    [classroomId],
  );
  if (checkResult.rows.length === 0) {
    const error = appError.create(
      "classrooms -------------------- not found",
      404,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(
      errors.array()[0].msg,
      422,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  if (name) {
    const existing = await pool.query(
      "SELECT * FROM classrooms WHERE name = $1 AND classroom_id != $2",
      [name, classroomId],
    );
    if (existing.rows.length > 0) {
      const error = appError.create(
        "Classroom name already exists",
        400,
        httpStatusText.FAIL,
      );
      return next(error);
    }
  }

  const query = `
   UPDATE classrooms
    SET 
      name = COALESCE($1, name),
      grade_id = COALESCE($2, grade_id),
      section = COALESCE($3, section),
      academic_year = COALESCE($4, academic_year),
      teacher_id = COALESCE($5, teacher_id),
      max_students = COALESCE($6, max_students),
      min_students = COALESCE($7, min_students),
      status = COALESCE($8, status),
      updated_at = NOW()
    WHERE classroom_id = $9
    RETURNING *;
`;

  const result = await pool.query(query, [
    name || null,
    grade_id || null,
    section || null,
    academic_year || null,
    teacher_id || null,
    max_students || null,
    min_students || null,
    status || null,
    classroomId,
  ]);

  res.status(200).json({
    message: "Classrooms updated successfully",
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const DeleteClassrooms = asyncWrapper(async (req, res, next) => {
  const classId = req.params.classId;

  const result = await pool.query(
    "SELECT * FROM classrooms WHERE classroom_id = $1",
    [classId],
  );

  if (result.rows.length === 0) {
    const error = appError.create(
      "Teacher not found",
      404,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  await pool.query("DELETE FROM classrooms WHERE classroom_id = $1", [classId]);

  res.status(200).json({
    message: "classrooms deleted successfully",
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

module.exports = {
  GetSingleClassroom,
  getAllClassrooms,
  addNewClassrooms,
  UpdateClassrooms,
  DeleteClassrooms,
};
