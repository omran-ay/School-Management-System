import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function DetailsSubject() {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [subject, setSubject] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/subjects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );
        setSubject(response.data.data);
      } catch (error) {
        console.error("Error fetching subject:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
          <h1 className="text-3xl font-bold">{subject.name}</h1>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <DetailItem label="Subject Name" value={subject.name} />
            <DetailItem label="Description" value={subject.description} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
          <Link to={`/adminDashboard/updateSubject/${id}`}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Edit Subject
            </button>
          </Link>
          <Link to="/adminDashboard/subjects">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
              Back to List
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 min-h-10">
        {value || <span className="text-gray-400">Not provided</span>}
      </div>
    </div>
  );
}

export default DetailsSubject;
