import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function GradeDetails() {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [grade, setGrade] = useState({});
  const [student, setStudent] = useState({});
  const [course, setCourse] = useState({});

  useEffect(() => {
    const fetchGradeData = async () => {
      try {
        const gradeRes = await axios.get(
          `http://localhost:4000/api/grades/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );

        const gradeData = gradeRes.data.data;
        setGrade(gradeData);

        const [studentRes, courseRes] = await Promise.all([
          axios.get(
            `http://localhost:4000/api/students/${gradeData.student_id}`,
          ),
          axios.get(`http://localhost:4000/api/courses/${gradeData.course_id}`),
        ]);

        setStudent(studentRes.data.data);
        setCourse(courseRes.data.data);
      } catch (error) {
        console.error("Error fetching grade data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGradeData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-6 text-white">
          <h1 className="text-3xl font-bold">Grade Details</h1>
          <p className="text-amber-100">
            {student.first_name} {student.last_name} - {course.subject_name}
          </p>
          <p className="text-amber-100 text-xl font-bold mt-2">
            Score: {grade.score}%
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <DetailItem
                label="Student"
                value={`${student.first_name} ${student.last_name} (${student.student_number})`}
              />
              <DetailItem label="Course" value={course.subject_name} />
              <DetailItem label="Classroom" value={course.classroom_name} />
            </div>

            <div className="space-y-4">
              <DetailItem
                label="Evaluation Type"
                value={grade.evaluation_type}
              />
              <DetailItem label="Score" value={`${grade.score}%`} />
              <DetailItem
                label="Graded On"
                value={new Date(grade.graded_on).toLocaleDateString()}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
          <Link to={`/adminDashboard/updateGrade/${id}`}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Edit Grade
            </button>
          </Link>
          <Link to="/adminDashboard/grades">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
              Back to List
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 min-h-10">
        {value || <span className="text-gray-400">Not provided</span>}
      </div>
    </div>
  );
}

export default GradeDetails;
