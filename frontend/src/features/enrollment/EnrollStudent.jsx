import { useState, useEffect } from "react";
import SelectField from "../../common/SelectField";
import Button from "../../common/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EnrollStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
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
      await axios.post("http://localhost:4000/api/enrollments", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      navigate("/enrollments");
    } catch (error) {
      console.error("Error enrolling student:", error);
      alert(error.response?.data?.message || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Enroll Student in Course</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
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
              label: `${course.subject_name} - ${course.classroom_name} (${course.teacher_name})`,
              value: course.course_id,
            }))}
            required
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            onClick={() => navigate("/enrollments")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {loading ? "Enrolling..." : "Enroll Student"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnrollStudent;
