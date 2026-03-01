// src/components/teachers/TeacherList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../common/Button";
import { Link } from "react-router-dom";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/teachers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setTeachers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teacherId) => {
    try {
      await axios.delete(`http://localhost:4000/api/teachers/${teacherId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setTeachers((prev) => prev.filter((t) => t.teacher_id !== teacherId));
    } catch (error) {
      console.error("Failed to delete teacher:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="p-4 mt-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">All Registered Teachers</h2>

      {loading ? (
        <p>Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <p>No teachers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-green-100">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Specialization</th>
                <th className="px-4 py-2 border">Teacher Code</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr
                  key={teacher.teacher_id}
                  className="text-center hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">
                    {teacher.first_name} {teacher.last_name}
                  </td>
                  <td className="px-4 py-2 border">{teacher.email}</td>
                  <td className="px-4 py-2 border">{teacher.specialization}</td>
                  <td className="px-4 py-2 border">{teacher.teacher_code}</td>
                  <td className="px-4 py-2 border">{teacher.phone_number}</td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <Link
                      to={`/adminDashboard/detailsTeacher/${teacher.teacher_id}`}
                      className="bg-blue-500 hover:bg-blue-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                    >
                      View
                    </Link>
                    <Link
                      to={`/adminDashboard/updateTeacher/${teacher.teacher_id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                    >
                      Edit
                    </Link>
                    <Button
                      className="bg-red-500 hover:bg-red-600 w-auto px-3 py-1 text-sm"
                      onClick={() => handleDelete(teacher.teacher_id)}
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

export default TeacherList;
