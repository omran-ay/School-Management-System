const { pool } = require("../../config/index");

const getStudentFullProfile = async (req, res) => {
  const studentId = req.params.id;

  try {
    const { rows: userInfo } = await pool.query(
      `
      SELECT u.user_id, u.first_name, u.last_name, u.email, s.*
      FROM students s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.student_id = $1
    `,
      [studentId],
    );

    if (userInfo.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { rows: courses } = await pool.query(
      `
      SELECT c.course_id, sub.name AS subject_name, t.teacher_id, 
             u.first_name || ' ' || u.last_name AS teacher_name,
             cl.name AS classroom_name
      FROM enrollment e
      JOIN courses c ON e.course_id = c.course_id
      JOIN subjects sub ON c.subject_id = sub.subject_id
      JOIN teachers t ON c.teacher_id = t.teacher_id
      JOIN users u ON t.user_id = u.user_id
      JOIN classrooms cl ON c.classroom_id = cl.classroom_id
      WHERE e.student_id = $1
    `,
      [studentId],
    );

    const { rows: grades } = await pool.query(
      `
      SELECT g.course_id, sub.name AS subject_name, g.evaluation_type, g.score, g.graded_on
      FROM grades g
      JOIN courses c ON g.course_id = c.course_id
      JOIN subjects sub ON c.subject_id = sub.subject_id
      WHERE g.student_id = $1
    `,
      [studentId],
    );

    const { rows: attendance } = await pool.query(
      `
      SELECT a.attendance_date, a.status, sub.name AS subject_name
      FROM attendance a
      JOIN courses c ON a.course_id = c.course_id
      JOIN subjects sub ON c.subject_id = sub.subject_id
      WHERE a.student_id = $1
    `,
      [studentId],
    );

    return res.json({
      student: userInfo[0],
      courses,
      grades,
      attendance,
    });
  } catch (error) {
    console.error("Error in getStudentFullProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTeacherFullProfile = async (req, res) => {
  const teacherId = req.params.id;

  try {
    const { rows: teacherInfo } = await pool.query(
      `
      SELECT u.user_id, u.first_name, u.last_name, u.email, t.*
      FROM teachers t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.teacher_id = $1
    `,
      [teacherId],
    );

    if (teacherInfo.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const { rows: courses } = await pool.query(
      `
      SELECT c.course_id, s.name AS subject_name, cl.name AS classroom_name
      FROM courses c
      JOIN subjects s ON c.subject_id = s.subject_id
      JOIN classrooms cl ON c.classroom_id = cl.classroom_id
      WHERE c.teacher_id = $1
    `,
      [teacherId],
    );

    const { rows: studentsPerCourse } = await pool.query(
      `
      SELECT c.course_id, s.name AS subject_name,
             stu.student_id, u.first_name || ' ' || u.last_name AS student_name
      FROM courses c
      JOIN subjects s ON c.subject_id = s.subject_id
      JOIN enrollment e ON e.course_id = c.course_id
      JOIN students stu ON e.student_id = stu.student_id
      JOIN users u ON stu.user_id = u.user_id
      WHERE c.teacher_id = $1
      ORDER BY c.course_id
    `,
      [teacherId],
    );

    return res.json({
      teacher: teacherInfo[0],
      courses,
      students: studentsPerCourse,
    });
  } catch (error) {
    console.error("Error in getTeacherFullProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getClassroomFullProfile = async (req, res) => {
  const classroomId = req.params.id;

  try {
    const { rows: classroomRows } = await pool.query(
      `
      SELECT * FROM classrooms WHERE classroom_id = $1
    `,
      [classroomId],
    );

    if (classroomRows.length === 0) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const classroom = classroomRows[0];

    const { rows: courseDetails } = await pool.query(
      `
      SELECT 
        c.course_id,
        s.name AS subject_name,
        t.teacher_id,
        u.first_name || ' ' || u.last_name AS teacher_name
      FROM courses c
      JOIN subjects s ON c.subject_id = s.subject_id
      JOIN teachers t ON c.teacher_id = t.teacher_id
      JOIN users u ON t.user_id = u.user_id
      WHERE c.classroom_id = $1
    `,
      [classroomId],
    );

    const { rows: students } = await pool.query(
      `
      SELECT DISTINCT stu.student_id, u.first_name || ' ' || u.last_name AS student_name
      FROM enrollment e
      JOIN courses c ON e.course_id = c.course_id
      JOIN students stu ON e.student_id = stu.student_id
      JOIN users u ON stu.user_id = u.user_id
      WHERE c.classroom_id = $1
    `,
      [classroomId],
    );

    return res.json({
      classroom,
      courses: courseDetails,
      students,
    });
  } catch (error) {
    console.error("Error in getClassroomFullProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getStudentFullProfile,
  getTeacherFullProfile,
  getClassroomFullProfile,
};
