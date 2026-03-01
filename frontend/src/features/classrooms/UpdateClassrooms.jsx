import { useState, useEffect } from "react";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import Button from "../../common/Button";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateClassroom = () => {
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const { id } = useParams();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classroomRes, gradesRes, teachersRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/classrooms/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
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

        const classroomData = classroomRes.data.data;
        setFormData({
          ...classroomData,
          grade_id: classroomData.grade_id.toString(),
          teacher_id: classroomData.teacher_id?.toString() || "",
        });

        setGrades(gradesRes.data.data);
        setTeachers(teachersRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      await axios.patch(
        `http://localhost:4000/api/classrooms/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      navigate("/adminDashboard/classrooms");
    } catch (error) {
      console.error("Error updating classroom:", error);
      alert(error.response?.data?.message || "Failed to update classroom");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 my-6 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Update Classroom</h2>

      <form onSubmit={handleSubmit}>
        {/* Classroom Information */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Classroom Details
          </h3>
          <div className="flex flex-wrap justify-between ">
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
              options={[
                { label: "No Teacher", value: "" },
                ...grades.map((grade) => ({
                  label: grade.name_ar,
                  value: grade.grade_id.toString(),
                })),
              ]}
              required
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
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Capacity & Teacher
          </h3>
          <div className="flex flex-wrap justify-between">
            <SelectField
              label="Teacher"
              name="teacher_id"
              value={formData.teacher_id}
              onChange={handleChange}
              options={[
                { label: "No Teacher", value: "" },
                ...teachers.map((teacher) => ({
                  label: `${teacher.first_name} ${teacher.last_name}`,
                  value: teacher.teacher_id.toString(),
                })),
              ]}
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
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
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
            onClick={() => navigate("/adminDashboard/classrooms")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Classroom"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateClassroom;
