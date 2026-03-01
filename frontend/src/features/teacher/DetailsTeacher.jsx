import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

function DetailsTeacher() {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birth_date: "",
    gender: "",
    marital_status: "",
    nationality: "",
    teacher_code: "",
    specialization: "",
    years_of_experience: "",
    highest_qualification: "",
    date_of_hire: "",
    salary_grade: "",
    phone_number: "",
    address: "",
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/teachers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
          },
        );

        const teacherData = response.data.data;
        if (teacherData.birth_date) {
          teacherData.birth_date = teacherData.birth_date.split("T")[0];
        }
        if (teacherData.date_of_hire) {
          teacherData.date_of_hire = teacherData.date_of_hire.split("T")[0];
        }

        setFormData(teacherData);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h1 className="text-3xl font-bold">
            {formData.first_name} {formData.last_name}
          </h1>
          <p className="text-blue-100">Teacher Code: {formData.teacher_code}</p>
          <p className="text-blue-100">{formData.specialization}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Personal Information
              </h2>
              <DetailItem label="First Name" value={formData.first_name} />
              <DetailItem label="Last Name" value={formData.last_name} />
              <DetailItem label="Date of Birth" value={formData.birth_date} />
              <DetailItem label="Gender" value={formData.gender} />
              <DetailItem
                label="Marital Status"
                value={formData.marital_status}
              />
              <DetailItem label="Nationality" value={formData.nationality} />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Professional Information
              </h2>
              <DetailItem label="Teacher Code" value={formData.teacher_code} />
              <DetailItem
                label="Specialization"
                value={formData.specialization}
              />
              <DetailItem
                label="Years of Experience"
                value={formData.years_of_experience}
              />
              <DetailItem
                label="Highest Qualification"
                value={formData.highest_qualification}
              />
              <DetailItem label="Date of Hire" value={formData.date_of_hire} />
              <DetailItem label="Salary Grade" value={formData.salary_grade} />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Contact Information
              </h2>
              <DetailItem label="Email" value={formData.email} />
              <DetailItem label="Phone Number" value={formData.phone_number} />
              <DetailItem label="Address" value={formData.address} />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Account Information
              </h2>
              <div className="grid grid-cols-1 gap-1">
                <label className="text-sm font-medium text-gray-500">
                  Password
                </label>
                <div className="flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    readOnly
                    className="bg-gray-100 border border-gray-300 rounded-l-md px-3 py-2 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-r-md"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
          <Link to={`/adminDashboard/updateTeacher/${id}`}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Edit Profile
            </button>
          </Link>
          <Link to="/adminDashboard/teachers">
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

export default DetailsTeacher;
