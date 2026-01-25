import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/pages/Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        upcoming: 0,
        completed: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            const data = response.data.data;
            setAppointments(data.slice(0, 5));

            setStats({
                total: data.length,
                upcoming: data.filter(a => a.status === 'confirmed' || a.status === 'pending').length,
                completed: data.filter(a => a.status === 'completed').length,
            });
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div className="header-left">
                        <Link
                            to="/profile"
                            className="profile-avatar"
                            title="View profile"
                        >
                            <span className="avatar-icon">👤</span>
                        </Link>
                        <div>
                            <h1>Welcome back, {user?.name}! 👋</h1>
                            <p>Here's what's happening with your health today</p>
                        </div>
                    </div>
                    {user?.role === 'patient' && (
                        <Link to="/doctors" className="btn btn-primary">
                            Book New Appointment
                        </Link>
                    )}
                </div>

                {/* Dashboard Content */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3>{stats.total}</h3>
                            <p>Total Appointments</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <h3>{stats.upcoming}</h3>
                            <p>Upcoming</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3>{stats.completed}</h3>
                            <p>Completed</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content">
                    <div className="section">
                        <div className="section-header">
                            <h2>Recent Appointments</h2>
                            <Link to="/appointments" className="link">View All</Link>
                        </div>

                        {loading ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                            </div>
                        ) : appointments.length > 0 ? (
                            <div className="appointments-list">
                                {appointments.map((appointment) => (
                                    <div key={appointment._id} className="appointment-item">
                                        <div className="appointment-info">
                                            <h4>{appointment.doctorId?.userId?.name}</h4>
                                            <p>{appointment.doctorId?.specialization}</p>
                                            <p className="date">
                                                {formatDate(appointment.appointmentDate)} at {appointment.timeSlot}
                                            </p>
                                        </div>
                                        <span className={`status-badge status-${appointment.status}`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No appointments yet</p>
                                {user?.role === 'patient' && (
                                    <Link to="/doctors" className="btn btn-outline">
                                        Book Your First Appointment
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <div className="actions-grid">
                            {user?.role === 'patient' && (
                                <Link to="/doctors" className="action-card">
                                    <span className="action-icon">🔍</span>
                                    <span>Find Doctors</span>
                                </Link>
                            )}
                            <Link to="/appointments" className="action-card">
                                <span className="action-icon">📋</span>
                                <span>My Appointments</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
