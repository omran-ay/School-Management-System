const { pool } = require("../../config/index");
const bcrypt = require("bcryptjs");
const generateJWT = require("../../utils/generateJWT");
const asyncWrapper = require("../../middlewares/asyncWrapper");
const httpStatusText = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");
const { validationResult } = require("express-validator");

const getAllTeachers = asyncWrapper(async (req, res) => {
  const teachers = await pool.query(`
    SELECT
      u.user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.password,
      u.created_at,

      t.teacher_id,
      t.birth_date,
      t.gender,
      t.marital_status,
      t.nationality,
      t.teacher_code,
      t.specialization,
      t.years_of_experience,
      t.highest_qualification,
      t.date_of_hire,
      t.salary_grade,
      t.phone_number,
      t.email AS teacher_email,
      t.address,
      t.hashedPassword,
      t.profile_picture,
      t.qualifications_file,
      t.cv_file

    FROM teachers t
    JOIN users u ON t.user_id = u.user_id;
  `);
  res.status(200).json({
    message: "Get All Teachers Successfully",
    status: httpStatusText.SUCCESS,
    data: teachers.rows,
  });
});

const GetSingleTeacher = asyncWrapper(async (req, res, next) => {
  const teacherId = req.params.teacherId;

  const teacher = await pool.query(
    `
    SELECT
      u.user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.password,
      u.created_at,

      t.teacher_id,
      t.birth_date,
      t.gender,
      t.marital_status,
      t.nationality,
      t.teacher_code,
      t.specialization,
      t.years_of_experience,
      t.highest_qualification,
      t.date_of_hire,
      t.salary_grade,
      t.phone_number,
      t.email AS teacher_email,
      t.address,
      t.hashedPassword,
      t.profile_picture,
      t.qualifications_file,
      t.cv_file

    FROM teachers t
    JOIN users u ON t.user_id = u.user_id
    WHERE t.teacher_id = $1;
  `,
    [teacherId],
  );
  if (teacher.rows.length === 0) {
    const error = appError.create(
      "teacher Not Found!",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  res.status(201).json({
    message: "Get teacher Successfully",
    status: httpStatusText.SUCCESS,
    data: teacher.rows[0],
  });
});

const addNewTeacher = asyncWrapper(async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    password,
    birth_date,
    gender,
    marital_status,
    nationality,
    teacher_code,
    specialization,
    years_of_experience,
    highest_qualification,
    date_of_hire,
    salary_grade,
    phone_number,
    address,
    profile_picture,
    qualifications_file,
    cv_file,
  } = req.body;

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
    "SELECT * FROM teachers WHERE teacher_code = $1",
    [teacher_code],
  );

  if (existing.rows.length > 0) {
    const error = appError.create(
      "Teacher alredy exists",
      400,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const roleResult = await pool.query(
    "SELECT role_id FROM roles WHERE role_name = $1",
    ["Teacher"],
  );
  if (roleResult.rows.length === 0) {
    const error = appError.create(
      "Role 'Teacher' not found",
      500,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  const role_id = roleResult.rows[0].role_id;

  const insertUserQuery = `
    INSERT INTO users (first_name, last_name, email, password,role_id)
    VALUES ($1, $2, $3, $4,$5)
    RETURNING user_id;
  `;

  const userResult = await pool.query(insertUserQuery, [
    first_name,
    last_name,
    email,
    hashedPassword,
    role_id,
  ]);
  const user_id = userResult.rows[0].user_id;

  const insertTeacherQuery = `
    INSERT INTO teachers (
      user_id, birth_date, gender, marital_status, nationality,
      teacher_code, specialization, years_of_experience, highest_qualification,
      date_of_hire, salary_grade, phone_number, address,
      hashedPassword, profile_picture, qualifications_file, cv_file
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9,
      $10, $11, $12, $13, $14,
      $15, $16, $17
    ) RETURNING *;
  `;

  const values = [
    user_id,
    birth_date,
    gender,
    marital_status,
    nationality,
    teacher_code,
    specialization,
    years_of_experience,
    highest_qualification,
    date_of_hire,
    salary_grade,
    phone_number,
    address,
    hashedPassword,
    profile_picture,
    qualifications_file,
    cv_file,
  ];
  const newTeacherResult = await pool.query(insertTeacherQuery, values);
  newTeacher = newTeacherResult.rows[0];
  res.json({
    status: httpStatusText.SUCCESS,
    message: "Add new teacher successfully",
    data: [userResult.rows[0], newTeacher],
  });
});

const UpdateTeacher = asyncWrapper(async (req, res, next) => {
  const teacherId = req.params.teacherId;
  const {
    first_name,
    last_name,
    email,
    password,
    birth_date,
    gender,
    marital_status,
    nationality,
    teacher_code,
    specialization,
    years_of_experience,
    highest_qualification,
    date_of_hire,
    salary_grade,
    phone_number,
    address,
    profile_picture,
    qualifications_file,
    cv_file,
  } = req.body;
  // console.log(teacherId);

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

  const result = await pool.query(
    "SELECT * FROM teachers WHERE teacher_id = $1",
    [teacherId],
  );

  if (result.rows.length === 0) {
    const error = appError.create(
      "teacher not found",
      404,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  const userId = result.rows[0].user_id;

  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const updatedUser = await pool.query(
    `
    UPDATE users SET
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name),
      email = COALESCE($3, email),
      password = COALESCE($4, password)
    WHERE user_id = $5
      RETURNING *

  `,
    [
      first_name || null,
      last_name || null,
      email || null,
      hashedPassword || null,
      userId,
    ],
  );

  const query = `
    UPDATE teachers SET
      birth_date = COALESCE($1, birth_date),
      gender = COALESCE($2, gender),
      marital_status = COALESCE($3, marital_status),
      nationality = COALESCE($4, nationality),
      teacher_code = COALESCE($5, teacher_code),
      specialization = COALESCE($6, specialization),
      years_of_experience = COALESCE($7, years_of_experience),
      highest_qualification = COALESCE($8, highest_qualification),
      date_of_hire = COALESCE($9, date_of_hire),
      salary_grade = COALESCE($10, salary_grade),
      phone_number = COALESCE($11, phone_number),
      address = COALESCE($12, address),
      hashedPassword = COALESCE($13, hashedPassword),
      profile_picture = COALESCE($14, profile_picture),
      qualifications_file = COALESCE($15, qualifications_file),
      cv_file = COALESCE($16, cv_file)
    WHERE teacher_id = $17
    RETURNING *;
`;

  const values = [
    birth_date || null,
    gender || null,
    marital_status || null,
    nationality || null,
    teacher_code || null,
    specialization || null,
    years_of_experience || null,
    highest_qualification || null,
    date_of_hire || null,
    salary_grade || null,
    phone_number || null,
    address || null,
    hashedPassword || null,
    profile_picture || null,
    qualifications_file || null,
    cv_file || null,
    teacherId,
  ];

  const updatedTeacher = await pool.query(query, values);

  res.status(200).json({
    message: "Teacher updated successfully",
    status: httpStatusText.SUCCESS,
    data: [updatedUser.rows[0], updatedTeacher.rows[0]],
  });
});

const DeleteTeacher = asyncWrapper(async (req, res, next) => {
  const teacherId = req.params.teacherId;

  const result = await pool.query(
    "SELECT * FROM teachers WHERE teacher_id = $1",
    [teacherId],
  );

  if (result.rows.length === 0) {
    const error = appError.create(
      "Teacher not found",
      404,
      httpStatusText.FAIL,
    );
    return next(error);
  }

  const userId = result.rows[0].user_id;

  await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);

  res.status(200).json({
    message: "teacher deleted successfully",
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

const getTeacherStudentsGrades = asyncWrapper(async (req, res, next) => {
  const { teacherId } = req.params;

  const result = await pool.query(
    `
    SELECT 
      CONCAT(su.first_name, ' ', su.last_name) AS student_name,
      subjects.name AS subject_name,
      grades.evaluation_type,
      grades.score,
      grades.graded_on
    FROM grades
    JOIN students ON grades.student_id = students.student_id
    JOIN users su ON students.user_id = su.user_id
    JOIN courses ON grades.course_id = courses.course_id
    JOIN subjects ON courses.subject_id = subjects.subject_id
    JOIN teachers ON courses.teacher_id = teachers.teacher_id
    WHERE teachers.teacher_id = $1
    ORDER BY grades.graded_on DESC;
    `,
    [teacherId],
  );

  if (result.rows.length === 0) {
    return next(
      appError.create(
        "No grades found for this teacher",
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

const getTeacherAttendance = asyncWrapper(async (req, res, next) => {
  const { teacherId } = req.params;

  const result = await pool.query(
    `
    SELECT 
      attendance.attendance_date,
      attendance.status,
      CONCAT(su.first_name, ' ', su.last_name) AS student_name,
      subjects.name AS subject_name,
      classrooms.name AS classroom_name
    FROM attendance
    JOIN students ON attendance.student_id = students.student_id
    JOIN users AS su ON students.user_id = su.user_id
    JOIN courses ON attendance.course_id = courses.course_id
    JOIN subjects ON courses.subject_id = subjects.subject_id
    JOIN classrooms ON courses.classroom_id = classrooms.classroom_id
    WHERE courses.teacher_id = $1
    ORDER BY attendance.attendance_date DESC
    `,
    [teacherId],
  );

  res.json({
    status: httpStatusText.SUCCESS,
    data: result.rows,
  });
});

module.exports = {
  GetSingleTeacher,
  getAllTeachers,
  addNewTeacher,
  UpdateTeacher,
  DeleteTeacher,
  getTeacherStudentsGrades,
  getTeacherAttendance,
};
