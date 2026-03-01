// src/components/students/StudentForm.jsx
import { useState } from "react";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import FileUploader from "../../components/common/FileUploader";
import Button from "../../components/common/Button";
import axios from "axios";
import useApi from "../../hooks/useApi";
import studentService from "../../services/studentService";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
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
  const navigate = useNavigate();
  const { data, loading, error, request } = useApi(
    studentService.addNewStudent
  );
  // console.log("loading", loading);

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
      const response = await request(formData);
      // console.log("Student created:", response.data);
      // console.log("response.data.status", response.data.status);

      if (response.data.status === "success") {
        navigate("/adminDashboard");
      }
    } catch (err) {
      console.error("Error creating student:", err);
      console.log("error**********", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
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

        {/* Attachments */}
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

        <Button type="submit">Register Student</Button>
      </form>
    </div>
  );
};

export default AddStudent;
