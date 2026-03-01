import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../common/Button";
import { Link } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchStudents = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/students", {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setStudents(res.data.data);
      setPagination({
        page: res.data.page,
        limit: res.data.limit,
        total: res.data.total,
        totalPages: res.data.totalPages,
      });
      // console.log("res.data.limit", res.data.limit);
      // console.log("res.data.page", res.data.page);
      // console.log(" total: res.data.total", res.data.total);
      // console.log("res.data.totalPages", res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`http://localhost:4000/api/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      fetchStudents(pagination.page, pagination.limit);
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchStudents(newPage, pagination.limit);
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    fetchStudents(1, newLimit);
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  // console.log("pagination.limit", pagination.limit);
  // console.log("pagination.page", pagination.page);
  // console.log("pagination.total", pagination.total);
  // console.log(" pagination.totalPages", pagination.totalPages);
  return (
    <div className="p-4 mt-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">All Registered Students</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span>Items per page:</span>
          <select
            value={pagination.limit}
            onChange={handleLimitChange}
            className="border rounded px-2 py-1"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} students
        </div>
      </div>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-green-100">
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Student ID</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={student.student_id}
                    className="text-center hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 border">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-4 py-2 border">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-4 py-2 border">{student.email}</td>
                    <td className="px-4 py-2 border">{student.phone_number}</td>
                    <td className="px-4 py-2 border">
                      {student.student_number}
                    </td>
                    <td className="px-4 py-2 border flex justify-center gap-2">
                      <Link
                        to={`/adminDashboard/detailsStudent/${student.student_id}`}
                        className="bg-blue-500 hover:bg-blue-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                      >
                        View
                      </Link>
                      <Link
                        to={`/adminDashboard/updateStudent/${student.student_id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                      >
                        Edit
                      </Link>
                      <Button
                        className="bg-red-500 hover:bg-red-600 w-auto px-3 py-1 text-sm"
                        onClick={() => handleDelete(student.student_id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 disabled:opacity-50"
            >
              &laquo;
            </Button>
            <Button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 disabled:opacity-50"
            >
              &lsaquo;
            </Button>

            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 ${
                      pagination.page === pageNum
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              },
            )}

            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 disabled:opacity-50"
            >
              &rsaquo;
            </Button>
            <Button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 disabled:opacity-50"
            >
              &raquo;
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;
