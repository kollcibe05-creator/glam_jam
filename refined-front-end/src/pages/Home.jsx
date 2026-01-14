// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Sweet Homes</h1>
      <p>Find your perfect getaway, from cozy cottages to luxury villas.</p>
      <button className="btn-primary" onClick={() => navigate("/houses")}>
        Get Started
      </button>
    </div>
  );
}

export default Home;
