import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../common/Button";
import { Link } from "react-router-dom";

const GradeList = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState({});
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchGrades = async () => {
    try {
      const [gradesRes, studentsRes, coursesRes] = await Promise.all([
        axios.get("http://localhost:4000/api/grades", {
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

      const studentsDict = {};
      studentsRes.data.data.forEach((student) => {
        studentsDict[student.student_id] =
          `${student.first_name} ${student.last_name}`;
      });

      const coursesDict = {};
      coursesRes.data.data.forEach((course) => {
        coursesDict[course.course_id] = course.subject_name;
      });

      setStudents(studentsDict);
      setCourses(coursesDict);
      setGrades(gradesRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gradeId) => {
    try {
      await axios.delete(`http://localhost:4000/api/grades/${gradeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setGrades((prev) => prev.filter((g) => g.grade_id !== gradeId));
    } catch (error) {
      console.error("Failed to delete grade:", error);
      alert(error.response?.data?.message || "Failed to delete grade");
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  return (
    <div className="p-4 mt-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Grades</h2>
        <Link
          to="/adminDashboard/addGrade"
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
        >
          Add New Grade
        </Link>
      </div>

      {loading ? (
        <p>Loading grades...</p>
      ) : grades.length === 0 ? (
        <p>No grades found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-amber-100">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Student</th>
                <th className="px-4 py-2 border">Course</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Score</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => (
                <tr
                  key={grade.grade_id}
                  className="text-center hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">
                    {students[grade.student_id] || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {courses[grade.course_id] || "N/A"}
                  </td>
                  <td className="px-4 py-2 border capitalize">
                    {grade.evaluation_type}
                  </td>
                  <td className="px-4 py-2 border font-medium">
                    {grade.score}%
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(grade.graded_on).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <Link
                      to={`/adminDashboard/updateGrade/${grade.grade_id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                    >
                      Edit
                    </Link>
                    <Button
                      className="bg-red-500 hover:bg-red-600 w-auto px-3 py-1 text-sm"
                      onClick={() => handleDelete(grade.grade_id)}
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

export default GradeList;
