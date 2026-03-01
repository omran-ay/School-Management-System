import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function EnrollmentDetails() {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [enrollment, setEnrollment] = useState({});
  const [student, setStudent] = useState({});
  const [course, setCourse] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrollmentRes = await axios.get(
          `http://localhost:4000/api/enrollments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );

        const enrollmentData = enrollmentRes.data.data;
        setEnrollment(enrollmentData);

        const [studentRes, courseRes] = await Promise.all([
          axios.get(
            `http://localhost:4000/api/students/${enrollmentData.student_id}`,
          ),
          axios.get(
            `http://localhost:4000/api/courses/${enrollmentData.course_id}`,
          ),
        ]);

        setStudent(studentRes.data.data);
        setCourse(courseRes.data.data);
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 text-white">
          <h1 className="text-3xl font-bold">Enrollment Details</h1>
          <p className="text-teal-100">
            Student: {student.first_name} {student.last_name}
          </p>
          <p className="text-teal-100">Course: {course.subject_name}</p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <DetailItem
              label="Student"
              value={`${student.first_name} ${student.last_name} (${student.student_number})`}
            />
            <DetailItem
              label="Course"
              value={`${course.subject_name} - ${course.classroom_name}`}
            />
            <DetailItem label="Teacher" value={course.teacher_name} />
            <DetailItem
              label="Enrollment Date"
              value={new Date(enrollment.enrollment_date).toLocaleDateString()}
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
          <Link to={`/adminDashboard/updateEnrollment/${id}`}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Edit Enrollment
            </button>
          </Link>
          <Link to="/adminDashboard/enrollments">
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

export default EnrollmentDetails;
