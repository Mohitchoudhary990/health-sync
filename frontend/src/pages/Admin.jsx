import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/pages/Admin.css';

const Admin = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);

    // Stats
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalDepartments: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
    });

    // Departments
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState({
        name: '',
        description: '',
        icon: '🏥',
    });

    // Doctors
    const [doctors, setDoctors] = useState([]);
    const [users, setUsers] = useState([]);
    const [newDoctor, setNewDoctor] = useState({
        userId: '',
        specialization: '',
        department: '',
        qualification: '',
        experience: '',
        consultationFee: '',
        bio: '',
    });

    // Appointments
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchDepartments();
        fetchDoctors();
        fetchAppointments();
        fetchUsers();
    }, []);

    const fetchStats = async () => {
        try {
            const [doctorsRes, deptsRes, appointmentsRes] = await Promise.all([
                api.get('/doctors'),
                api.get('/departments'),
                api.get('/appointments'),
            ]);

            setStats({
                totalDoctors: doctorsRes.data.count || 0,
                totalDepartments: deptsRes.data.count || 0,
                totalAppointments: appointmentsRes.data.count || 0,
                pendingAppointments: appointmentsRes.data.data?.filter(a => a.status === 'pending').length || 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data.data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctors');
            setDoctors(response.data.data || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data.data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/departments', newDepartment);
            alert('Department created successfully!');
            setNewDepartment({ name: '', description: '', icon: '🏥' });
            fetchDepartments();
            fetchStats();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create department');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/doctors', {
                ...newDoctor,
                experience: Number(newDoctor.experience),
                consultationFee: Number(newDoctor.consultationFee),
            });
            alert('Doctor created successfully!');
            setNewDoctor({
                userId: '',
                specialization: '',
                department: '',
                qualification: '',
                experience: '',
                consultationFee: '',
                bio: '',
            });
            fetchDoctors();
            fetchStats();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create doctor');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;
        try {
            await api.delete(`/doctors/${id}`);
            alert('Doctor deleted successfully!');
            fetchDoctors();
            fetchStats();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete doctor');
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
        try {
            await api.put(`/users/${userId}`, { role: newRole });
            alert('User role updated successfully!');
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await api.delete(`/users/${userId}`);
            alert('User deleted successfully!');
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleUpdateAppointmentStatus = async (id, status) => {
        try {
            await api.put(`/appointments/${id}`, { status });
            alert('Appointment updated successfully!');
            fetchAppointments();
            fetchStats();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update appointment');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage your hospital system</p>
                </div>

                {/* Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Overview
                    </button>
                    <button
                        className={`tab ${activeTab === 'departments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('departments')}
                    >
                        🏥 Departments
                    </button>
                    <button
                        className={`tab ${activeTab === 'doctors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('doctors')}
                    >
                        👨‍⚕️ Doctors
                    </button>
                    <button
                        className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointments')}
                    >
                        📅 Appointments
                    </button>
                    <button
                        className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Users
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="tab-content">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">👨‍⚕️</div>
                                <div className="stat-content">
                                    <h3>{stats.totalDoctors}</h3>
                                    <p>Total Doctors</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🏥</div>
                                <div className="stat-content">
                                    <h3>{stats.totalDepartments}</h3>
                                    <p>Departments</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📅</div>
                                <div className="stat-content">
                                    <h3>{stats.totalAppointments}</h3>
                                    <p>Total Appointments</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⏳</div>
                                <div className="stat-content">
                                    <h3>{stats.pendingAppointments}</h3>
                                    <p>Pending</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Departments Tab */}
                {activeTab === 'departments' && (
                    <div className="tab-content">
                        <div className="admin-section">
                            <h2>Add New Department</h2>
                            <form onSubmit={handleCreateDepartment} className="admin-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Department Name</label>
                                        <input
                                            type="text"
                                            value={newDepartment.name}
                                            onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Icon (Emoji)</label>
                                        <input
                                            type="text"
                                            value={newDepartment.icon}
                                            onChange={(e) => setNewDepartment({ ...newDepartment, icon: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={newDepartment.description}
                                        onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                                        rows="3"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Department'}
                                </button>
                            </form>
                        </div>

                        <div className="admin-section">
                            <h2>All Departments ({departments.length})</h2>
                            <div className="departments-list">
                                {departments.map((dept) => (
                                    <div key={dept._id} className="department-item">
                                        <span className="dept-icon">{dept.icon}</span>
                                        <div className="dept-info">
                                            <h4>{dept.name}</h4>
                                            <p>{dept.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Doctors Tab */}
                {activeTab === 'doctors' && (
                    <div className="tab-content">
                        <div className="admin-section">
                            <h2>Add New Doctor</h2>
                            <form onSubmit={handleCreateDoctor} className="admin-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Select User</label>
                                        <select
                                            value={newDoctor.userId}
                                            onChange={(e) => setNewDoctor({ ...newDoctor, userId: e.target.value })}
                                            required
                                        >
                                            <option value="">Choose a user</option>
                                            {users.map((u) => (
                                                <option key={u._id} value={u._id}>
                                                    {u.name} ({u.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Department</label>
                                        <select
                                            value={newDoctor.department}
                                            onChange={(e) => setNewDoctor({ ...newDoctor, department: e.target.value })}
                                            required
                                        >
                                            <option value="">Choose department</option>
                                            {departments.map((dept) => (
                                                <option key={dept._id} value={dept.name}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Specialization</label>
                                        <input
                                            type="text"
                                            value={newDoctor.specialization}
                                            onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Qualification</label>
                                        <input
                                            type="text"
                                            value={newDoctor.qualification}
                                            onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Experience (years)</label>
                                        <input
                                            type="number"
                                            value={newDoctor.experience}
                                            onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Consultation Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={newDoctor.consultationFee}
                                            onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: e.target.value })}
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Bio</label>
                                    <textarea
                                        value={newDoctor.bio}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, bio: e.target.value })}
                                        rows="3"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Doctor'}
                                </button>
                            </form>
                        </div>

                        <div className="admin-section">
                            <h2>All Doctors ({doctors.length})</h2>
                            <div className="doctors-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Specialization</th>
                                            <th>Department</th>
                                            <th>Experience</th>
                                            <th>Fee</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doctors.map((doctor) => (
                                            <tr key={doctor._id}>
                                                <td>{doctor.userId?.name}</td>
                                                <td>{doctor.specialization}</td>
                                                <td>{doctor.department}</td>
                                                <td>{doctor.experience} years</td>
                                                <td>₹{doctor.consultationFee}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDeleteDoctor(doctor._id)}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <div className="tab-content">
                        <div className="admin-section">
                            <h2>All Appointments ({appointments.length})</h2>
                            <div className="appointments-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Patient</th>
                                            <th>Doctor</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((appointment) => (
                                            <tr key={appointment._id}>
                                                <td>{appointment.patientId?.name}</td>
                                                <td>{appointment.doctorId?.userId?.name}</td>
                                                <td>{formatDate(appointment.appointmentDate)}</td>
                                                <td>{appointment.timeSlot}</td>
                                                <td>
                                                    <span className={`status-badge status-${appointment.status}`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {appointment.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateAppointmentStatus(appointment._id, 'confirmed')}
                                                                className="btn btn-success btn-sm"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateAppointmentStatus(appointment._id, 'cancelled')}
                                                                className="btn btn-danger btn-sm"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                    {appointment.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => handleUpdateAppointmentStatus(appointment._id, 'completed')}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="tab-content">
                        <div className="admin-section">
                            <h2>All Users ({users.length})</h2>
                            <div className="users-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u._id}>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>{u.phone}</td>
                                                <td>
                                                    <span className={`role-badge role-${u.role}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    {u.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleUpdateUserRole(u._id, 'admin')}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            Make Admin
                                                        </button>
                                                    )}
                                                    {u.role === 'admin' && u._id !== user._id && (
                                                        <button
                                                            onClick={() => handleUpdateUserRole(u._id, 'patient')}
                                                            className="btn btn-outline btn-sm"
                                                        >
                                                            Remove Admin
                                                        </button>
                                                    )}
                                                    {u._id === user._id && (
                                                        <span className="text-muted">You</span>
                                                    )}
                                                    {u._id !== user._id && (
                                                        <button
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            className="btn btn-danger btn-sm"
                                                            style={{ marginLeft: '5px' }}
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
