import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../common/Button";
import { Link } from "react-router-dom";

const TimetableList = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimetables = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/timetables", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      // console.log("response", response.data);
      setTimetables(response.data);
    } catch (error) {
      console.error("Failed to fetch timetables:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (timetableId) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/timetables/${timetableId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setTimetables((prev) =>
        prev.filter((t) => t.timetable_id !== timetableId)
      );
    } catch (error) {
      console.error("Failed to delete timetable:", error);
      alert(error.response?.data?.message || "Failed to delete timetable");
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  return (
    <div className="p-4 mt-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Timetable Management</h2>
        <Link
          to="/adminDashboard/addTimetable"
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md"
        >
          Add New Entry
        </Link>
      </div>

      {loading ? (
        <p>Loading timetables...</p>
      ) : timetables.length === 0 ? (
        <p>No timetable entries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-violet-100">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Teacher</th>
                <th className="px-4 py-2 border">Day</th>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">Room</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timetables.map((timetable, index) => (
                <tr
                  key={timetable.timetable_id}
                  className="text-center hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{timetable.subject_name}</td>
                  <td className="px-4 py-2 border">{timetable.teacher_name}</td>
                  <td className="px-4 py-2 border">{timetable.day_of_week}</td>
                  <td className="px-4 py-2 border">
                    {timetable.start_time} - {timetable.end_time}
                  </td>
                  <td className="px-4 py-2 border">{timetable.room_number}</td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <Link
                      to={`/adminDashboard/updateTimetable/${timetable.timetable_id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 rounded-full text-white text-sm font-bold w-auto px-3 py-2"
                    >
                      Edit
                    </Link>
                    <Button
                      className="bg-red-500 hover:bg-red-600 w-auto px-3 py-1 text-sm"
                      onClick={() => handleDelete(timetable.timetable_id)}
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

export default TimetableList;
