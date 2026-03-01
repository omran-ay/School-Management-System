const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ConnectionDB } = require("./config");
// const UserModels = require("./models/User.models");
const UserRoute = require("./routers/users.route.js");
const httpStatusText = require("./utils/httpStatusText");
const StudentRoute = require("./routers/student.route");
const TeacherRoute = require("./routers/teacher.route.js");
const ClassroomsRoute = require("./routers/classrooms.route");
const SubjectsRoute = require("./routers/subject.route.js");
const CourseRoute = require("./routers/course.route.js");
const Enrollment = require("./routers/enrollment.route.js");
const AttendanceRoute = require("./routers/attendance.route.js");
const GradeRoute = require("./routers/grade.route.js");
const adminDashboardRoute = require("./routers/dashboard/adminDashboard.route.js");
const studentDashboardRoute = require("./routers/dashboard/studentDashbord.route.js");
const teacherDashboardRoute = require("./routers/dashboard/teacherDashboard.route");
const TimeTabelRoute = require("./routers/timetable.route.js");
const gradeLavelClassRoute = require("./routers/gradesClassrooms.route");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use("/api/users", UserRoute);
app.use("/api/students", StudentRoute);
app.use("/api/teachers", TeacherRoute);
app.use("/api/classrooms", ClassroomsRoute);
app.use("/api/subjects", SubjectsRoute);
app.use("/api/courses", CourseRoute);
app.use("/api/enrollments", Enrollment);
app.use("/api/Attendances", AttendanceRoute);
app.use("/api/grades", GradeRoute);
app.use("/api/adminDashboard", adminDashboardRoute);
app.use("/api/studentDashboard", studentDashboardRoute);
app.use("/api/teacherDashboard", teacherDashboardRoute);
app.use("/api/timetables", TimeTabelRoute);
app.use("/api/gradeLevelClassrooms", gradeLavelClassRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("The Server listning on Port :", process.env.PORT);
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

ConnectionDB();
