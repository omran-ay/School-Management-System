// src/components/teachers/TeacherForm.jsx
import { useState } from "react";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import FileUploader from "../../common/FileUploader";
import Button from "../../common/Button";
import axios from "axios";

const AddTeacher = () => {
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit teacher:", formData);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/teachers/addNewTeacher",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      console.log("Teacher created:", response.data);
    } catch (error) {
      console.error("Error creating teacher:", error);
      console.error("Error response data:", error.response?.data);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Teacher</h2>
      <form onSubmit={handleSubmit}>
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
              type="password"
              value={formData.password}
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

        {/* Professional Details */}
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
          <div className="flex flex-wrap  gap-4">
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

        <Button type="submit">Register Teacher</Button>
      </form>
    </div>
  );
};

export default AddTeacher;
