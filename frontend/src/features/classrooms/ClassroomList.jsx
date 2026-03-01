// src/components/classrooms/ClassroomList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../common/Button";
import { Link } from "react-router-dom";

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState({});
  const [teachers, setTeachers] = useState({});

  const fetchClassrooms = async () => {
    try {
      const [classroomsRes, gradesRes, teachersRes] = await Promise.all([
        axios.get("http://localhost:4000/api/classrooms", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
        axios.get("http://localhost:4000/api/grades", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
        axios.get("http://localhost:4000/api/teachers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
      ]);

      // Create lookup dictionaries
      const gradesDict = {};
      gradesRes.data.data.forEach((grade) => {
        gradesDict[grade.grade_id] = grade.name;
      });

      const teachersDict = {};
      teachersRes.data.data.forEach((teacher) => {
        teachersDict[
          teacher.teacher_id
        ] = `${teacher.first_name} ${teacher.last_name}`;
      });

      setGrades(gradesDict);
      setTeachers(teachersDict);
      setClassrooms(classroomsRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classroomId) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/classrooms/${classroomId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setClassrooms((prev) =>
        prev.filter((c) => c.classroom_id !== classroomId)
      );
    } catch (error) {
      console.error("Failed to delete classroom:", error);
      alert(error.response?.data?.message || "Failed to delete classroom");
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  return (
    <div className="p-4 mt-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Classrooms</h2>
      </div>

      {loading ? (
        <p>Loading classrooms...</p>
      ) : classrooms.length === 0 ? (
        <p>No classrooms found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Section</th>
                <th className="px-4 py-2 border">Teacher</th>
                <th className="px-4 py-2 border">Academic Year</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map((classroom, index) => (
                <tr
                  key={classroom.classroom_id}
                  className="text-center hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{classroom.name}</td>

                  <td className="px-4 py-2 border">
                    {classroom.section || "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {classroom.teacher_id
                      ? teachers[classroom.teacher_id]
                      : "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {classroom.academic_year}
                  </td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        classroom.status === "active"
                          ? "bg-green-100 text-green-800"
                          : classroom.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {classroom.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <Link
                      to={`/adminDashboard/detailsClassroom/${classroom.classroom_id}`}
                      className="bg-blue-500 hover:bg-blue-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                    >
                      View
                    </Link>
                    <Link
                      to={`/adminDashboard/updateClassroom/${classroom.classroom_id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                    >
                      Edit
                    </Link>
                    <Button
                      className="bg-red-500 hover:bg-red-600 w-auto px-3 py-1 text-sm"
                      onClick={() => handleDelete(classroom.classroom_id)}
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

export default ClassroomList;
