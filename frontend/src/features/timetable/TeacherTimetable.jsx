import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import React from "react";

const TeacherTimetable = () => {
  const { teacherId } = useParams();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/adminDashboard/timetableTeacher/1`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setTimetable(response.data);
      } catch (error) {
        console.error("Failed to fetch timetable:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 mt-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Weekly Schedule</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-violet-100">
              <th className="px-4 py-2 border">Day</th>
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Subject</th>
              <th className="px-4 py-2 border">Classroom</th>
              <th className="px-4 py-2 border">Room</th>
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day) => {
              const dayClasses = timetable.filter(
                (item) => item.day_of_week === day
              );

              return (
                <React.Fragment key={day}>
                  {dayClasses.length > 0 ? (
                    dayClasses.map((cls, idx) => (
                      <tr key={`${day}-${idx}`} className="hover:bg-gray-50">
                        {idx === 0 && (
                          <td
                            rowSpan={dayClasses.length}
                            className="px-4 py-2 border font-medium"
                          >
                            {day}
                          </td>
                        )}
                        <td className="px-4 py-2 border">
                          {cls.start_time} - {cls.end_time}
                        </td>
                        <td className="px-4 py-2 border">{cls.subject_name}</td>
                        <td className="px-4 py-2 border">
                          {cls.classroom_name}
                        </td>
                        <td className="px-4 py-2 border">{cls.room_number}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 border font-medium">{day}</td>
                      <td
                        colSpan="4"
                        className="px-4 py-2 border text-gray-400 text-center"
                      >
                        No classes scheduled
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherTimetable;
