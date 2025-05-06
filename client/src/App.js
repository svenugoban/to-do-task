import React, { Suspense, lazy, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./AuthContext";

// Lazy-loaded components
const Login = lazy(() => import("./components/login/login"));
const Register = lazy(() => import("./components/register/register"));
const Dashboard = lazy(() => import("./components/dashboard/dashboard"));

// Private route wrapper
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to='/login' />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Secured routes */}
            
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
           
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
