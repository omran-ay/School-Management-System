import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    console.log(data);
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:4000/api/users/register",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("result", result.data);

      if (result?.data?.status === "success") {
        navigate("/adminDashboard");
      }
    } catch (error) {
      console.log(error.data);
      console.log("error.respons?.data", error.response?.data);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <container className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          SHCOOL MANAGMENT SYSTEM
        </h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          Hell, Welcome To Shcool
        </p>
        <form onSubmit={handleSubmitData}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name:{" "}
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="text"
              name="first_name"
              value={data.first_name}
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name:{" "}
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="text"
              name="last_name"
              value={data.last_name}
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email:{" "}
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="email"
              name="email"
              value={data.email}
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password:{" "}
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="password"
              name="password"
              value={data.password}
              required
              onChange={handleChange}
            />
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
            Sign Up
          </button>
        </form>
      </container>
    </div>
  );
}

export default Register;
