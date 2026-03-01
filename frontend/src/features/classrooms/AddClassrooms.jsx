import { useEffect, useState } from "react";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddClassroom = () => {
  const navigate = useNavigate();
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

  const [grades, setGrades] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradesRes, teachersRes] = await Promise.all([
          axios.get("http://localhost:4000/api/gradeLevelClassrooms", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
          axios.get("http://localhost:4000/api/teachers", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
        ]);
        // console.log("gradesRes", gradesRes.data.data);

        setGrades(gradesRes.data.data);
        setTeachers(teachersRes.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // console.log("grades", grades);
  // console.log("teachers", teachers);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/classrooms/addNewClassroom",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      // console.log("Classroom created:", response.data);
      navigate("/adminDashboard/classrooms"); // Redirect after success
    } catch (error) {
      console.error("Error creating classroom:", error);
      alert(error.response?.data?.message || "Failed to create classroom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Add New Classroom
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            Classroom Information
          </h3>
          <div className="flex flex-wrap justify-between">
            <InputField
              label="Classroom Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <SelectField
              label="Grade"
              name="grade_id"
              value={formData.grade_id}
              onChange={handleChange}
              options={grades.map((grade) => ({
                label: grade.name_ar || grade.name_en,
                value: grade.grade_id,
              }))}
              required
              placeholder="Select Grade"
            />

            <InputField
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
            />

            <InputField
              label="Academic Year (YYYY-YYYY)"
              name="academic_year"
              value={formData.academic_year}
              onChange={handleChange}
              pattern="\d{4}-\d{4}"
              title="Format: YYYY-YYYY"
            />
          </div>
        </section>

        {/* Capacity & Teacher */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            Capacity & Teacher
          </h3>
          <div className="flex flex-wrap justify-between">
            <SelectField
              label="Teacher"
              name="teacher_id"
              value={formData.teacher_id}
              onChange={handleChange}
              options={teachers.map((teacher) => ({
                label: `${teacher.first_name} ${teacher.last_name}`,
                value: teacher.teacher_id,
              }))}
              placeholder="Select Teacher"
            />

            <InputField
              label="Max Students"
              name="max_students"
              type="number"
              min="1"
              value={formData.max_students}
              onChange={handleChange}
            />

            <InputField
              label="Min Students"
              name="min_students"
              type="number"
              min="1"
              value={formData.min_students}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Status */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            Classroom Status
          </h3>
          <div className="flex flex-wrap justify-between">
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Maintenance", value: "maintenance" },
              ]}
            />
          </div>
        </section>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            onClick={() => navigate("/classrooms")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Creating..." : "Create Classroom"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddClassroom;
