// src/hooks/useApi.js
import { useState } from "react";

export default function useApi(apiFunction) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...args);
      setData(response.data);
      console.log("response.data", response.data);

      return response;
    } catch (err) {
      setError(err.response?.data || err.message);
      console.log("err.response?.data-----------", err.response?.data);
      console.log(loading);
    } finally {
      console.log(loading);

      setLoading(false);
      console.log(loading);
    }
  };

  return { data, error, loading, request };
}
