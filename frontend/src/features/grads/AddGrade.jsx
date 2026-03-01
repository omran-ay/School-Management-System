import { useState, useEffect } from "react";
import SelectField from "../../common/SelectField";
import InputField from "../../common/InputField";
import Button from "../../common/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddGrade = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    evaluation_type: "exam",
    score: "",
    graded_on: new Date().toISOString().split("T")[0],
  });
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          axios.get("http://localhost:4000/api/students", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
          axios.get("http://localhost:4000/api/courses", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
        ]);

        setStudents(studentsRes.data.data);
        setCourses(coursesRes.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:4000/api/grades/addNewGrade",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      navigate("/grades");
    } catch (error) {
      console.error("Error adding grade:", error);
      alert(error.response?.data?.message || "Failed to add grade");
      console.log(
        "error.response?.data?.message",
        error.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Grade</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Student"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            options={students.map((student) => ({
              label: `${student.first_name} ${student.last_name} (${student.student_number})`,
              value: student.student_id,
            }))}
            required
          />

          <SelectField
            label="Course"
            name="course_id"
            value={formData.course_id}
            onChange={handleChange}
            options={courses.map((course) => ({
              label: `${course.subject_name} - ${course.classroom_name}`,
              value: course.course_id,
            }))}
            required
          />

          <SelectField
            label="Evaluation Type"
            name="evaluation_type"
            value={formData.evaluation_type}
            onChange={handleChange}
            options={[
              { label: "Exam", value: "exam" },
              { label: "Quiz", value: "quiz" },
              { label: "Assignment", value: "assignment" },
              { label: "Project", value: "project" },
              { label: "Participation", value: "participation" },
            ]}
            required
          />

          <InputField
            label="Score"
            name="score"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.score}
            onChange={handleChange}
            required
          />

          <InputField
            label="Graded On"
            name="graded_on"
            type="date"
            value={formData.graded_on}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            onClick={() => navigate("/grades")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {loading ? "Adding..." : "Add Grade"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddGrade;
