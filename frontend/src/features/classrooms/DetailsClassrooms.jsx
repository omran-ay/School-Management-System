import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

function DetailsClassroom() {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    grade_id: "",
    section: "",
    academic_year: "",
    teacher_id: "",
    max_students: "",
    min_students: "",
    status: "active",
  });
  const [gradeName, setGradeName] = useState("");
  const [teacherName, setTeacherName] = useState("");

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/classrooms/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
          },
        );

        const classroomData = response.data.data;
        setFormData(classroomData);

        // Fetch grade name
        if (classroomData.grade_id) {
          const gradeRes = await axios.get(
            `http://localhost:4000/api/grades/${classroomData.grade_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            },
          );
          setGradeName(gradeRes.data.data.name);
        }

        // Fetch teacher name
        if (classroomData.teacher_id) {
          const teacherRes = await axios.get(
            `http://localhost:4000/api/teachers/${classroomData.teacher_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            },
          );
          setTeacherName(
            `${teacherRes.data.data.first_name} ${teacherRes.data.data.last_name}`,
          );
        }
      } catch (error) {
        console.error("Error fetching classroom data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
          <h1 className="text-3xl font-bold">{formData.name}</h1>
          <p className="text-green-100">Grade: {gradeName || "N/A"}</p>
          <p className="text-green-100">
            Teacher: {teacherName || "Not assigned"}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Classroom Information
              </h2>
              <DetailItem label="Classroom Name" value={formData.name} />
              <DetailItem label="Grade" value={gradeName} />
              <DetailItem label="Section" value={formData.section} />
              <DetailItem
                label="Academic Year"
                value={formData.academic_year}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Capacity & Status
              </h2>
              <DetailItem label="Max Students" value={formData.max_students} />
              <DetailItem label="Min Students" value={formData.min_students} />
              <DetailItem
                label="Status"
                value={
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      formData.status === "active"
                        ? "bg-green-100 text-green-800"
                        : formData.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {formData.status}
                  </span>
                }
              />
            </div>

            {teacherName && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Teacher Information
                </h2>
                <DetailItem label="Assigned Teacher" value={teacherName} />
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
          <Link to={`/adminDashboard/updateClassroom/${id}`}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Edit Classroom
            </button>
          </Link>
          <Link to="/adminDashboard/classrooms">
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
      <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
        {value || <span className="text-gray-400">Not provided</span>}
      </div>
    </div>
  );
}

export default DetailsClassroom;
