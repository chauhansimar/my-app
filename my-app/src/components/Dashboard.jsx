import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // 🔐 not logged in
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/dashboard", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const result = await res.json();

        if (res.ok) {
          setData(result);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };

    fetchDashboard();
  }, [navigate]);

  // 🔥 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    navigate("/login"); // redirect
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Dashboard 🔥</h1>

      {data ? <p>{data.message}</p> : <p>Loading...</p>}

      {/* 🔐 LOGOUT BUTTON */}
      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;