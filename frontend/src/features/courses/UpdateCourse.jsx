import { useState, useEffect } from "react";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject_id: "",
    teacher_id: "",
    classroom_id: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, subjectsRes, teachersRes, classroomsRes] =
          await Promise.all([
            axios.get(`http://localhost:4000/api/courses/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
            axios.get("http://localhost:4000/api/subjects", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
            axios.get("http://localhost:4000/api/teachers", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
            axios.get("http://localhost:4000/api/classrooms", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
          ]);

        setFormData(courseRes.data.data);
        setSubjects(subjectsRes.data.data);
        setTeachers(teachersRes.data.data);
        setClassrooms(classroomsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.patch(`http://localhost:4000/api/courses/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      navigate("/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      alert(error.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Update Course</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <SelectField
            label="Subject"
            name="subject_id"
            value={formData.subject_id}
            onChange={handleChange}
            options={subjects.map((subject) => ({
              label: subject.name,
              value: subject.subject_id,
            }))}
            required
          />

          <SelectField
            label="Teacher"
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleChange}
            options={teachers.map((teacher) => ({
              label: `${teacher.first_name} ${teacher.last_name}`,
              value: teacher.teacher_id,
            }))}
            required
          />

          <SelectField
            label="Classroom"
            name="classroom_id"
            value={formData.classroom_id}
            onChange={handleChange}
            options={classrooms.map((classroom) => ({
              label: classroom.name,
              value: classroom.classroom_id,
            }))}
            required
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            onClick={() => navigate("/courses")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loading ? "Updating..." : "Update Course"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;
