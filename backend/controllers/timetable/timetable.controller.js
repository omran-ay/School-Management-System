// GET /dashboard/student/timetable/:studentId
const { pool } = require("../../config/index");

const getTimetableByStudentId = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        timetable.day_of_week,
        timetable.start_time,
        timetable.end_time,
        subjects.name AS subject_name,
        CONCAT(users.first_name, ' ', users.last_name) AS teacher_name,
        classrooms.name AS classroom_name,
        timetable.room_number
      FROM enrollment
      JOIN courses ON enrollment.course_id = courses.course_id
      JOIN timetable ON courses.course_id = timetable.course_id
      JOIN subjects ON courses.subject_id = subjects.subject_id
      JOIN teachers ON courses.teacher_id = teachers.teacher_id
           JOIN users ON teachers.user_id = users.user_id  
      JOIN classrooms ON courses.classroom_id = classrooms.classroom_id
      WHERE enrollment.student_id = $1
      ORDER BY 
        CASE
          WHEN timetable.day_of_week = 'Monday' THEN 1
          WHEN timetable.day_of_week = 'Tuesday' THEN 2
          WHEN timetable.day_of_week = 'Wednesday' THEN 3
          WHEN timetable.day_of_week = 'Thursday' THEN 4
          WHEN timetable.day_of_week = 'Friday' THEN 5
          WHEN timetable.day_of_week = 'Saturday' THEN 6
          WHEN timetable.day_of_week = 'Sunday' THEN 7
        END,
        timetable.start_time
    `,
      [studentId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching student timetable:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /dashboard/teacher/timetable/:teacherId
const getTimetableByTeacherId = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        timetable.day_of_week,
        timetable.start_time,
        timetable.end_time,
        subjects.name AS subject_name,
        classrooms.name AS classroom_name,
        timetable.room_number
      FROM courses
      JOIN timetable ON courses.course_id = timetable.course_id
      JOIN subjects ON courses.subject_id = subjects.subject_id
      JOIN classrooms ON courses.classroom_id = classrooms.classroom_id
      WHERE courses.teacher_id = $1
      ORDER BY 
        CASE
          WHEN timetable.day_of_week = 'Monday' THEN 1
          WHEN timetable.day_of_week = 'Tuesday' THEN 2
          WHEN timetable.day_of_week = 'Wednesday' THEN 3
          WHEN timetable.day_of_week = 'Thursday' THEN 4
          WHEN timetable.day_of_week = 'Friday' THEN 5
          WHEN timetable.day_of_week = 'Saturday' THEN 6
          WHEN timetable.day_of_week = 'Sunday' THEN 7
        END,
        timetable.start_time
    `,
      [teacherId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching teacher timetable:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createTimetable = async (req, res) => {
  const { course_id, day_of_week, start_time, end_time, room_number } =
    req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO timetable (course_id, day_of_week, start_time, end_time, room_number)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [course_id, day_of_week, start_time, end_time, room_number],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating timetable:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllTimetables = async (req, res) => {
  console.log("Hello, I'm ");
  try {
    const result = await pool.query(`
      SELECT 
        timetable.*,
        subjects.name AS subject_name,
        CONCAT(users.first_name, ' ', users.last_name) AS teacher_name,
        classrooms.name AS classroom_name
      FROM timetable
      JOIN courses ON timetable.course_id = courses.course_id
      JOIN subjects ON courses.subject_id = subjects.subject_id
      JOIN teachers ON courses.teacher_id = teachers.teacher_id
     JOIN users ON teachers.user_id = users.user_id  
      JOIN classrooms ON courses.classroom_id = classrooms.classroom_id
      ORDER BY day_of_week, start_time
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching timetables:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTimetableById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        timetable.*,
        subjects.name AS subject_name,
        CONCAT(users.first_name, ' ', users.last_name) AS teacher_name,
        classrooms.name AS classroom_name
      FROM timetable
      JOIN courses ON timetable.course_id = courses.course_id
      JOIN subjects ON courses.subject_id = subjects.subject_id
      JOIN teachers ON courses.teacher_id = teachers.teacher_id
           JOIN users ON teachers.user_id = users.user_id  

      JOIN classrooms ON courses.classroom_id = classrooms.classroom_id
      WHERE timetable.timetable_id = $1
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching timetable:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTimetable = async (req, res) => {
  const { id } = req.params;
  const { day_of_week, start_time, end_time, room_number } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE timetable
      SET day_of_week = $1,
          start_time = $2,
          end_time = $3,
          room_number = $4
      WHERE timetable_id = $5
      RETURNING *
    `,
      [day_of_week, start_time, end_time, room_number, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating timetable:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTimetable = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM timetable WHERE timetable_id = $1 RETURNING *
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.json({ message: "Timetable deleted successfully" });
  } catch (err) {
    console.error("Error deleting timetable:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getTimetableByStudentId,
  getTimetableByTeacherId,
  createTimetable,
  getAllTimetables,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
};
