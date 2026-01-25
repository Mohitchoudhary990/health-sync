import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components/Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo">
                    <img src="/images/healthsync_logo.jpg" alt="HealthSync Logo" className="logo-image" />
                    <span className="logo-text">HealthSync</span>
                </Link>

                <div className="nav-links">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/doctors" className="nav-link">Find Doctors</Link>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary">Get Started</Link>
                        </>
                    ) : (
                        <>
                            {user?.role === 'doctor' ? (
                                <>
                                    <Link to="/doctor-dashboard" className="nav-link">Dashboard</Link>
                                    <Link to="/appointments" className="nav-link">Appointments</Link>
                                </>
                            ) : user?.role === 'patient' && (
                                <>
                                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                    <Link to="/doctors" className="nav-link">Doctors</Link>
                                    <Link to="/appointments" className="nav-link">Appointments</Link>
                                </>
                            )}
                            <div className="user-menu">
                                <span className="user-name">{user?.name}</span>
                                <button onClick={handleLogout} className="btn btn-outline">
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
