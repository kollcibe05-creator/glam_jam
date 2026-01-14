// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Houses from "./components/Houses";
import HouseDetail from "./pages/HouseDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Favorites from "./pages/Favorites";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";

import "./styles/main.css";
import "./styles/anotherstyle.css";  {/*######need removal testing only*/}



function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login on page load
  useEffect(() => {
    fetch("/check_session")
      .then((res) => {
        if (res.ok) {
          res.json().then((userData) => setUser(userData));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="App">
      <Navbar user={user} setUser={setUser} />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/houses" element={<HouseGalleryWithRating />} />
          <Route path="/houses/:id" element={<HouseDetail user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />

          {/* User Protected Routes */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute user={user}>
                <MyBookings user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute user={user}>
                <Favorites user={user} />
              </ProtectedRoute>
            }
          />

          {/* Admin Only Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} adminOnly={true}>
                <AdminDashboard user={user} />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<p className="container">404 | Page Not Found</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
