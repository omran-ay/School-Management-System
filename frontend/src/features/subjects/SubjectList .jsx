import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../common/Button";
import { Link } from "react-router-dom";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/subjects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setSubjects(res.data.data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subjectId) => {
    try {
      await axios.delete(`http://localhost:4000/api/subjects/${subjectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setSubjects((prev) => prev.filter((s) => s.subject_id !== subjectId));
    } catch (error) {
      console.error("Failed to delete subject:", error);
      alert(error.response?.data?.message || "Failed to delete subject");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="p-4 mt-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Subjects</h2>
      </div>

      {loading ? (
        <p>Loading subjects...</p>
      ) : subjects.length === 0 ? (
        <p>No subjects found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-purple-100">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr
                  key={subject.subject_id}
                  className="text-center hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{subject.name}</td>
                  <td className="px-4 py-2 border">
                    {subject.description || "-"}
                  </td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <Link
                      to={`/adminDashboard/detailsSubject/${subject.subject_id}`}
                      className="bg-blue-500 hover:bg-blue-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                    >
                      View
                    </Link>
                    <Link
                      to={`/adminDashboard/updateSubject/${subject.subject_id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                    >
                      Edit
                    </Link>
                    <Button
                      className="bg-red-500 hover:bg-red-600 w-auto px-3 py-1 text-sm"
                      onClick={() => handleDelete(subject.subject_id)}
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

export default SubjectList;
