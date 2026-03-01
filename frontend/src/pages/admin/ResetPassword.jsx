import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [data, setData] = useState({
    password: "",
  });

  const { user_id, token } = useParams();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    console.log(data);
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `http://localhost:4000/api/users/reset-password/${user_id}/${token}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("result", result?.data);
      navigate("/login");
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <container className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>

        <form onSubmit={handleSubmitData}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password:{" "}
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

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Reset Password
          </button>
        </form>
        <Link to="/login" className="hover:text-red-600 underline">
          Login
        </Link>
      </container>
    </div>
  );
}

export default ResetPassword;
