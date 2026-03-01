const { pool } = require("../../config/index");
const bcrypt = require("bcryptjs");
const generateJWT = require("../../utils/generateJWT");
const asyncWrapper = require("../../middlewares/asyncWrapper");
const httpStatusText = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");
const { validationResult } = require("express-validator");

const getAllStudents = asyncWrapper(async (req, res) => {
  let { page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const offset = (page - 1) * limit;

  const studentsResult = await pool.query(
    `
    SELECT
      users.user_id,
      users.first_name,
      users.last_name,
      users.email,
      users.password,
      users.created_at,
      students.student_id,
      students.birth_date,
      students.mother_name,
      students.father_name,
      students.gender,
      students.phone_number,
      students.address,
      students.parents_email,
      students.student_number,
      students.registration_date,
      students.profile_picture,
      students.certificates
    FROM students
    JOIN users ON students.user_id = users.user_id
    ORDER BY users.created_at DESC
    LIMIT $1 OFFSET $2;
  `,
    [limit, offset],
  );

  const totalResult = await pool.query(`
    SELECT COUNT(*) AS total
    FROM students
    JOIN users ON students.user_id = users.user_id;
  `);
  const total = parseInt(totalResult.rows[0].total);

  res.status(200).json({
    message: "Get All Students Successfully",
    status: httpStatusText.SUCCESS,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: studentsResult.rows,
  });
});

const GetSingleStudent = asyncWrapper(async (req, res, next) => {
  const studentId = req.params.studentId;

  const student = await pool.query(
    `SELECT
  s.student_id,
  s.user_id,
  u.first_name,
  u.last_name,
  u.email,
  u.password,
  u.created_at,
  s.birth_date,
  s.mother_name,
  s.father_name,
  s.gender,
  s.phone_number,
  s.address,
  s.parents_email,
  s.student_number,
  s.registration_date,
  s.profile_picture,
  s.certificates
FROM students s
JOIN users u ON s.user_id = u.user_id
WHERE s.student_id = $1;
`,
    [studentId],
  );
  if (student.rows.length === 0) {
    const error = appError.create(
      "student Not Found!",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  res.status(201).json({
    message: "Get student Successfully",
    status: httpStatusText.SUCCESS,
    data: student.rows[0],
  });
});

const addNewStudent = asyncWrapper(async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    password,
    birth_date,
    mother_name,
    father_name,
    gender,
    phone_number,
    address,
    parents_email,
    student_number,
    profile_picture,
    certificates,
  } = req.body;
  // console.log(first_name);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(
      errors.array()[0].msg,
      422,
      httpStatusText.FAIL,
    );
    return next(error);
  }
  // console.log(errors);

  const existing = await pool.query(
    "SELECT * FROM students WHERE student_number = $1",
    [student_number],
  );

  if (existing.rows.length > 0) {
    const error = appError.create(
      "Studnet alredy exists",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const insertUserQuery = `
    INSERT INTO users (first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id;`;

  const userResult = await pool.query(insertUserQuery, [
    first_name,
    last_name,
    email,
    hashedPassword,
  ]);
  const user_id = userResult.rows[0].user_id;

  const insertStudentQuery = `
    INSERT INTO students (
      user_id, birth_date, mother_name, father_name,
      gender, phone_number, address, parents_email,
      student_number, registration_date, profile_picture, certificates
    )
    VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8,
      $9, CURRENT_DATE, $10, $11
    )
    RETURNING *;
  `;

  const studentResult = await pool.query(insertStudentQuery, [
    user_id,
    birth_date,
    mother_name,
    father_name,
    gender,
    phone_number,
    address,
    parents_email,
    student_number,
    profile_picture,
    certificates,
  ]);
  newStudent = studentResult.rows[0];
  res.json({
    status: httpStatusText.SUCCESS,
    message: "Add new student successfully",
    data: newStudent,
  });
});

const UpdateStudnet = asyncWrapper(async (req, res, next) => {
  const studentId = req.params.studentId;
  const {
    first_name,
    last_name,
    email,
    password,
    birth_date,
    mother_name,
    father_name,
    gender,
    phone_number,
    address,
    parents_email,
    student_number,
    registration_date,
    profile_picture,
    certificates,
  } = req.body;
  // console.log("studentId", studentId);

  const result = await pool.query(
    "SELECT * FROM students WHERE student_id = $1",
    [studentId],
  );
  // console.log("result.rows.length", result.rows.length);

  if (result.rows.length === 0) {
    const error = appError.create(
      "Student not found",
      404,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  const student = result.rows[0];
  const userId = student.user_id;
  // console.log("userId", userId);

  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // ==================================================================
  const UpdateUserQuery = `
 UPDATE users
SET
  first_name = COALESCE($1, first_name),
  last_name = COALESCE($2, last_name),
  email = COALESCE($3, email),
  password = COALESCE($4, password)
WHERE user_id = $5
  RETURNING *
;`;

  const userResult = await pool.query(UpdateUserQuery, [
    first_name || null,
    last_name || null,
    email || null,
    hashedPassword || null,
    userId,
  ]);
  // const user_id = userResult.rows[0].userId;

  const query = `
  UPDATE students SET
      birth_date = COALESCE($1, birth_date),
      mother_name = COALESCE($2, mother_name),
      father_name = COALESCE($3, father_name),
      gender = COALESCE($4, gender),
      phone_number = COALESCE($5, phone_number),
      address = COALESCE($6, address),
      parents_email = COALESCE($7, parents_email),
      student_number = COALESCE($8, student_number),
      registration_date = COALESCE($9, registration_date),
      profile_picture = COALESCE($10, profile_picture),
      certificates = COALESCE($11, certificates)
    WHERE student_id = $12
  RETURNING *;
`;

  const values = [
    birth_date || null,
    mother_name || null,
    father_name || null,
    gender || null,
    phone_number || null,
    address || null,
    parents_email || null,
    student_number || null,
    registration_date || null,
    profile_picture || null,
    certificates || null,
    studentId,
  ];

  const updatedStudnet = await pool.query(query, values);

  res.status(200).json({
    message: "Studnt updated successfully",
    status: httpStatusText.SUCCESS,
    data: [userResult.rows[0], updatedStudnet.rows[0]],
  });
});

const DeleteStudnet = asyncWrapper(async (req, res, next) => {
  const studentId = req.params.studentId;

  const result = await pool.query(
    "SELECT * FROM students WHERE student_id = $1",
    [studentId],
  );

  if (result.rows.length === 0) {
    const error = appError.create(
      "Studnet not found",
      404,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  const userId = result.rows[0].user_id;

  await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);

  res.status(200).json({
    message: "Studnet deleted successfully",
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

const getStudentGrades = asyncWrapper(async (req, res, next) => {
  const { studentId } = req.params;

  const result = await pool.query(
    `
    SELECT 
      subjects.name AS subject_name,
      CONCAT(users.first_name, ' ', users.last_name) AS teacher_name,
      grades.evaluation_type,
      grades.score,
      grades.graded_on
    FROM grades
    JOIN courses ON grades.course_id = courses.course_id
    JOIN subjects ON courses.subject_id = subjects.subject_id
    JOIN teachers ON courses.teacher_id = teachers.teacher_id
    JOIN users ON teachers.user_id = users.user_id
    WHERE grades.student_id = $1
    ORDER BY grades.graded_on DESC;
    `,
    [studentId],
  );

  if (result.rows.length === 0) {
    return next(
      appError.create(
        "No grades found for this student",
        404,
        httpStatusText.FAIL,
      ),
    );
  }

  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows,
  });
});

const getStudentAttendance = asyncWrapper(async (req, res, next) => {
  const { studentId } = req.params;

  const result = await pool.query(
    `
    SELECT
      attendance.attendance_date,
      attendance.status,
      subjects.name AS subject_name,
      CONCAT(users.first_name, ' ', users.last_name) AS teacher_name
    FROM attendance
    JOIN courses ON attendance.course_id = courses.course_id
    JOIN subjects ON courses.subject_id = subjects.subject_id
    JOIN teachers ON courses.teacher_id = teachers.teacher_id
    JOIN users ON teachers.user_id = users.user_id
    WHERE attendance.student_id = $1
    ORDER BY attendance.attendance_date DESC
    `,
    [studentId],
  );

  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows,
  });
});

module.exports = {
  GetSingleStudent,
  getAllStudents,
  addNewStudent,
  UpdateStudnet,
  DeleteStudnet,
  getStudentGrades,
  getStudentAttendance,
};
