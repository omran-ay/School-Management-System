import { useState } from "react";
import InputField from "../../common/InputField";
import TextAreaField from "../../common/TextAreaField ";
import Button from "../../common/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddSubject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

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
      await axios.post(
        "http://localhost:4000/api/subjects/addNewSubject",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      navigate("/adminDashboard/subjects");
    } catch (error) {
      console.error("Error adding subject:", error);
      alert(error.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Subject</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <InputField
            label="Subject Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" onClick={() => navigate("/subjects")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Subject"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSubject;
