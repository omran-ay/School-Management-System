// src/components/teachers/UpdateTeacher.jsx
import { useState, useEffect } from "react";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import FileUploader from "../../components/common/FileUploader";
import Button from "../../components/common/Button";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const UpdateTeacher = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
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
    profile_picture: null,
    qualifications_file: null,
    cv_file: null,
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/teachers/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      console.log("Teacher updated:", response.data);
    } catch (error) {
      console.error("Error updating teacher:", error);
      console.error("Error response data:", error.response?.data);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Teacher</h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
          <div className="flex flex-wrap justify-between">
            <InputField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              icon={
                showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )
              }
              onIconClick={() => setShowPassword(!showPassword)}
            />
            <InputField
              label="Date of Birth"
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              required
            />
            <SelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              required
            />
            <InputField
              label="Marital Status"
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
            />
            <InputField
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Professional Details</h3>
          <div className="flex flex-wrap justify-between">
            <InputField
              label="Teacher Code"
              name="teacher_code"
              value={formData.teacher_code}
              onChange={handleChange}
              required
            />
            <InputField
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
            <InputField
              label="Years of Experience"
              name="years_of_experience"
              type="number"
              value={formData.years_of_experience}
              onChange={handleChange}
            />
            <InputField
              label="Highest Qualification"
              name="highest_qualification"
              value={formData.highest_qualification}
              onChange={handleChange}
            />
            <InputField
              label="Date of Hire"
              name="date_of_hire"
              type="date"
              value={formData.date_of_hire}
              onChange={handleChange}
            />
            <InputField
              label="Salary Grade"
              name="salary_grade"
              value={formData.salary_grade}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          <div className="flex flex-wrap justify-between">
            <InputField
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
            <InputField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Attachments</h3>
          <div className="flex flex-wrap gap-4">
            <FileUploader
              label="Profile Picture"
              name="profile_picture"
              onChange={handleChange}
            />
            <FileUploader
              label="Qualifications File"
              name="qualifications_file"
              onChange={handleChange}
            />
            <FileUploader
              label="CV File"
              name="cv_file"
              onChange={handleChange}
            />
          </div>
        </section>

        <Button type="submit">Update Teacher</Button>
        <Link to="/adminDashboard/teachers">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
            Back to List
          </button>
        </Link>
      </form>
    </div>
  );
};

export default UpdateTeacher;
