import { useState, useEffect } from "react";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTimetable = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    course_id: "",
    day_of_week: "Monday",
    start_time: "",
    end_time: "",
    room_number: "",
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/courses", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setCourses(response.data.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
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
        "http://localhost:4000/api/timetables/Createtimetable",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      navigate("/timetables");
    } catch (error) {
      console.error("Error creating timetable:", error);
      alert(error.response?.data?.message || "Failed to create timetable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Timetable Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            label="Day of Week"
            name="day_of_week"
            value={formData.day_of_week}
            onChange={handleChange}
            options={[
              { label: "Monday", value: "Monday" },
              { label: "Tuesday", value: "Tuesday" },
              { label: "Wednesday", value: "Wednesday" },
              { label: "Thursday", value: "Thursday" },
              { label: "Friday", value: "Friday" },
              { label: "Saturday", value: "Saturday" },
              { label: "Sunday", value: "Sunday" },
            ]}
            required
          />

          <InputField
            label="Start Time"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />

          <InputField
            label="End Time"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />

          <InputField
            label="Room Number"
            name="room_number"
            value={formData.room_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            onClick={() => navigate("/timetables")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {loading ? "Creating..." : "Create Timetable"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTimetable;
