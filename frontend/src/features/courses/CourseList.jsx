import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../common/Button";
import { Link } from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState({});
  const [teachers, setTeachers] = useState({});
  const [classrooms, setClassrooms] = useState({});

  const fetchCourses = async () => {
    try {
      const [coursesRes, subjectsRes, teachersRes, classroomsRes] =
        await Promise.all([
          axios.get("http://localhost:4000/api/courses", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
          axios.get("http://localhost:4000/api/subjects", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
          axios.get("http://localhost:4000/api/teachers", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
          axios.get("http://localhost:4000/api/classrooms", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
        ]);

      const subjectsDict = {};
      subjectsRes.data.data.forEach((subject) => {
        subjectsDict[subject.subject_id] = subject.name;
      });

      const teachersDict = {};
      teachersRes.data.data.forEach((teacher) => {
        teachersDict[teacher.teacher_id] =
          `${teacher.first_name} ${teacher.last_name}`;
      });

      const classroomsDict = {};
      classroomsRes.data.data.forEach((classroom) => {
        classroomsDict[classroom.classroom_id] = classroom.name;
      });

      setSubjects(subjectsDict);
      setTeachers(teachersDict);
      setClassrooms(classroomsDict);
      setCourses(coursesRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:4000/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert(error.response?.data?.message || "Failed to delete course");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-4 mt-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Courses</h2>
        <Link
          to="/adminDashboard/addCourse"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          Add New Course
        </Link>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-indigo-100">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Teacher</th>
                <th className="px-4 py-2 border">Classroom</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={course.course_id}
                  className="text-center hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">
                    {subjects[course.subject_id] || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {teachers[course.teacher_id] || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {classrooms[course.classroom_id] || "N/A"}
                  </td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <Link
                      to={`/adminDashboard/detailsCourse/${course.course_id}`}
                      className="bg-blue-500 hover:bg-blue-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                    >
                      View
                    </Link>
                    <Link
                      to={`/adminDashboard/updateCourse/${course.course_id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                    >
                      Edit
                    </Link>
                    <Button
                      className="bg-red-500 hover:bg-red-600 w-auto py-2 text-sm"
                      onClick={() => handleDelete(course.course_id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseList;
