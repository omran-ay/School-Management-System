import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../common/Button";
import { Link } from "react-router-dom";

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState({});
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const [enrollmentsRes, studentsRes, coursesRes] = await Promise.all([
        axios.get("http://localhost:4000/api/enrollments", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
        axios.get("http://localhost:4000/api/students", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
        axios.get("http://localhost:4000/api/courses", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
      ]);

      // console.log("studentsRes.data.data", studentsRes.data.data);

      const studentsDict = {};
      studentsRes.data.data.forEach((student) => {
        studentsDict[student.student_id] =
          `${student.first_name} ${student.last_name}`;
      });
      // console.log("coursesRes.data.data", coursesRes.data.data);
      const coursesDict = {};
      coursesRes.data.data.forEach((course) => {
        coursesDict[course.course_id] =
          `${course.subject_name} - ${course.classroom_name}`;
      });

      setStudents(studentsDict);
      setCourses(coursesDict);
      setEnrollments(enrollmentsRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
      // console.log("Omrannnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
    }
  };

  const handleDelete = async (enrollmentId) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/enrollments/${enrollmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      setEnrollments((prev) =>
        prev.filter((e) => e.enrollment_id !== enrollmentId),
      );
    } catch (error) {
      console.error("Failed to delete enrollment:", error);
      alert(error.response?.data?.message || "Failed to delete enrollment");
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div className="p-4 mt-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Enrollments</h2>
        <Link
          to="/adminDashboard/enrollStudent"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
        >
          New Enrollment
        </Link>
      </div>

      {loading ? (
        <p>Loading enrollments...</p>
      ) : enrollments.length === 0 ? (
        <p>No enrollments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-teal-100">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Student</th>
                <th className="px-4 py-2 border">Course</th>
                <th className="px-4 py-2 border">Enrollment Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment, index) => (
                <tr
                  key={enrollment.enrollment_id}
                  className="text-center hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">
                    {students[enrollment.student_id] || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {courses[enrollment.course_id] || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(enrollment.enrollment_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <Link
                      to={`/adminDashboard/updateEnrollment/${enrollment.enrollment_id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                    >
                      Edit
                    </Link>
                    <Button
                      className="bg-red-500 hover:bg-red-600 w-auto px-3 py-1 text-sm"
                      onClick={() => handleDelete(enrollment.enrollment_id)}
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

export default EnrollmentList;
