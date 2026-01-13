<Routes>
  <Route path="/" element={<HouseList user={user} />} />
  <Route path="/houses/:id" element={<HouseDetail user={user} />} />
  <Route path="/signup" element={<SignupForm setUser={setUser} />} />
  <Route path="/login" element={<Login setUser={setUser} />} />
  
  {/* Protected Routes */}
  <Route path="/admin" element={
    <ProtectedRoute user={user} adminOnly={true}>
      <AdminDashboard user={user} />
    </ProtectedRoute>
  } />
  <Route path="/my-bookings" element={
    <ProtectedRoute user={user}>
      <MyBookings />
    </ProtectedRoute>
  } /> 
  <Route path="/favorites" element={
    <ProtectedRoute user={user}>
      <Favorites />
    </ProtectedRoute>
  } />
</Routes>