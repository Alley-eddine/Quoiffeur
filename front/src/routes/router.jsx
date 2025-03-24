import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home';
import RegisterPage from '../pages/register';
import PrivateRoute from '../components/protectedRoute';
import LoginPage from '../pages/login';
import AppointmentPage from '../pages/appointment';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/appointment" element={<PrivateRoute><AppointmentPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;