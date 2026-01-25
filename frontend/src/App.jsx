import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';
import Admin from './pages/Admin';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/doctors" element={<Doctors />} />

                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/appointments"
                                element={
                                    <ProtectedRoute>
                                        <Appointments />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/book-appointment/:doctorId"
                                element={
                                    <ProtectedRoute>
                                        <BookAppointment />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/doctor-dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DoctorDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <Admin />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
