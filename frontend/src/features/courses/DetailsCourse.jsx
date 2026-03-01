import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function DetailsCourse() {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [course, setCourse] = useState({
    subject_id: "",
    teacher_id: "",
    classroom_id: "",
  });
  const [subjectName, setSubjectName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [classroomName, setClassroomName] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/courses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );

        const courseData = response.data.data;
        setCourse(courseData);

        const [subjectRes, teacherRes, classroomRes] = await Promise.all([
          axios.get(
            `http://localhost:4000/api/subjects/${courseData.subject_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            },
          ),
          axios.get(
            `http://localhost:4000/api/teachers/${courseData.teacher_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            },
          ),
          axios.get(
            `http://localhost:4000/api/classrooms/${courseData.classroom_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            },
          ),
        ]);

        setSubjectName(subjectRes.data.data.name);
        setTeacherName(
          `${teacherRes.data.data.first_name} ${teacherRes.data.data.last_name}`,
        );
        setClassroomName(classroomRes.data.data.name);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
          <h1 className="text-3xl font-bold">Course Details</h1>
          <p className="text-indigo-100">Subject: {subjectName}</p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <DetailItem label="Subject" value={subjectName} />
            <DetailItem label="Teacher" value={teacherName} />
            <DetailItem label="Classroom" value={classroomName} />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
          <Link to={`/adminDashboard/updateCourse/${id}`}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Edit Course
            </button>
          </Link>
          <Link to="/adminDashboard/courses">
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

export default DetailsCourse;
