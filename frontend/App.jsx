import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HouseGalleryWithRating from "./HouseGalleryWithRating";
import HouseDetail from "./HouseDetail";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import MyBookings from "./MyBookings";
import Favorites from "./Favorites";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);

  // Auto-login: Check if user session exists on refresh
  useEffect(() => {
    fetch("/check_session").then((res) => {
      if (res.ok) {
        res.json().then((user) => setUser(user));
      }
    });
  }, []);

  return (
    <div className="App">
      <Navbar user={user} setUser={setUser} />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HouseGalleryWithRating />} />
          <Route path="/houses/:id" element={<HouseDetail user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />

          {/* User Protected Routes */}
          <Route path="/my-bookings" element={
            <ProtectedRoute user={user}>
              <MyBookings user={user} />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute user={user}>
              <Favorites user={user} />
            </ProtectedRoute>
          } />

          {/* Admin Only Route */}
          <Route path="/admin" element={
            <ProtectedRoute user={user} adminOnly={true}>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;