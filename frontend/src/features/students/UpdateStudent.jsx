// src/components/students/StudentForm.jsx
import { useState, useEffect } from "react";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import FileUploader from "../../common/FileUploader";
import Button from "../../common/Button";
import axios from "axios";
import { useParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
const UpdateStudent = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    mother_name: "",
    father_name: "",
    gender: "",
    phone_number: "",
    address: "",
    email: "",
    student_number: "",
    password: "",
    // registration_date: "",
    parents_email: "",
    profile_picture: null,
    certificates: null,
  });
  // ==========================================
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/students/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
          },
        );
        console.log("response", response);

        const studentData = response.data.data;
        // console.log("studentData", studentData);
        // console.log("studentData", studentData);
        if (studentData.birth_date) {
          studentData.birth_date = studentData.birth_date.split("T")[0];
        }

        setFormData(studentData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);
  console.log("formData.first_name", formData.first_name);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit student:", formData);
    try {
      const respons = await axios.patch(
        `http://localhost:4000/api/students/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearar ${localStorage.getItem("authToken")} `,
          },
        },
      );
      console.log("craeteStudnet", respons.data);
    } catch (error) {
      console.log("err", error);
      console.error("Full error object:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Student</h2>
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
              label="Date of Birth"
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              required
            />
            <InputField
              label="Mother's Name"
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Father's Name"
              name="father_name"
              value={formData.father_name}
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
          </div>
        </section>

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
            <InputField
              label=" Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Student ID"
              name="student_number"
              value={formData.student_number}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <InputField
              label="parents_email"
              name="parents_email"
              type="email"
              value={formData.parents_email}
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
              label="Certificates"
              name="certificates"
              onChange={handleChange}
            />
          </div>
        </section>

        <Button type="submit">Update Student</Button>
      </form>
    </div>
  );
};

export default UpdateStudent;
