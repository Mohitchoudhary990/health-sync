import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DoctorSchedule from '../components/DoctorSchedule';
import '../styles/pages/DoctorDashboard.css';

const DoctorDashboard = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        today: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
    });

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        applyFilter();
        calculateStats();
    }, [appointments, filter]);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            // Filter appointments for this doctor
            const doctorAppointments = response.data.data.filter(
                (apt) => apt.doctorId?.userId?._id === user._id
            );
            setAppointments(doctorAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        if (filter === 'all') {
            setFilteredAppointments(appointments);
        } else if (filter === 'today') {
            const today = new Date().toDateString();
            setFilteredAppointments(
                appointments.filter(
                    (apt) => new Date(apt.appointmentDate).toDateString() === today
                )
            );
        } else {
            setFilteredAppointments(
                appointments.filter((apt) => apt.status === filter)
            );
        }
    };

    const calculateStats = () => {
        const today = new Date().toDateString();
        setStats({
            today: appointments.filter(
                (apt) => new Date(apt.appointmentDate).toDateString() === today
            ).length,
            pending: appointments.filter((apt) => apt.status === 'pending').length,
            confirmed: appointments.filter((apt) => apt.status === 'confirmed').length,
            completed: appointments.filter((apt) => apt.status === 'completed').length,
        });
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/appointments/${id}`, { status });
            fetchAppointments();
        } catch (error) {
            alert('Failed to update appointment status');
        }
    };

    const handleAddNotes = async (id) => {
        const notes = prompt('Enter notes for this appointment:');
        if (notes) {
            try {
                await api.put(`/appointments/${id}`, { notes });
                fetchAppointments();
            } catch (error) {
                alert('Failed to add notes');
            }
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (date) => {
        const appointmentDate = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (appointmentDate.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (appointmentDate.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        }
        return formatDate(date);
    };

    // Profile editing state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        height: '',
        weight: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
        }
    });

    // Initialize profile data when user changes
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                gender: user.gender || '',
                bloodGroup: user.bloodGroup || '',
                height: user.height || '',
                weight: user.weight || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    zipCode: user.address?.zipCode || ''
                }
            });
        }
    }, [user]);


    const handleProfileChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setProfileData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSaveProfile = async () => {
        try {
            console.log('Sending profile data:', profileData);
            const response = await api.put('/users/profile', profileData);
            console.log('Response:', response.data);

            if (response.data.success) {
                updateUser(response.data.data);
                setIsEditingProfile(false);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            console.error('Error response:', error.response);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
            alert(`Failed to update profile: ${errorMessage}`);
        }
    };

    const handleCancelEdit = () => {
        // Reset to original user data
        setProfileData({
            name: user.name || '',
            phone: user.phone || '',
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
            gender: user.gender || '',
            bloodGroup: user.bloodGroup || '',
            height: user.height || '',
            weight: user.weight || '',
            address: {
                street: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                zipCode: user.address?.zipCode || ''
            }
        });
        setIsEditingProfile(false);
    };

    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="doctor-dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome, Dr. {user?.name}! 👨‍⚕️</h1>
                        <p>Manage your appointments and patient care</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <h3>{stats.today}</h3>
                            <p>Today's Appointments</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-content">
                            <h3>{stats.pending}</h3>
                            <p>Pending</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3>{stats.confirmed}</h3>
                            <p>Confirmed</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🎉</div>
                        <div className="stat-content">
                            <h3>{stats.completed}</h3>
                            <p>Completed</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="dashboard-tabs">
                    <button
                        className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointments')}
                    >
                        📅 Appointments
                    </button>
                    <button
                        className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        🗓️ My Schedule
                    </button>
                    <button
                        className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        👤 Profile
                    </button>
                </div>

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <>
                        {/* Filter Tabs */}
                        <div className="filter-tabs">
                            <button
                                className={`tab ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All ({appointments.length})
                            </button>
                            <button
                                className={`tab ${filter === 'today' ? 'active' : ''}`}
                                onClick={() => setFilter('today')}
                            >
                                Today ({stats.today})
                            </button>
                            <button
                                className={`tab ${filter === 'pending' ? 'active' : ''}`}
                                onClick={() => setFilter('pending')}
                            >
                                Pending ({stats.pending})
                            </button>
                            <button
                                className={`tab ${filter === 'confirmed' ? 'active' : ''}`}
                                onClick={() => setFilter('confirmed')}
                            >
                                Confirmed ({stats.confirmed})
                            </button>
                            <button
                                className={`tab ${filter === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilter('completed')}
                            >
                                Completed ({stats.completed})
                            </button>
                        </div>

                        {/* Appointments List */}
                        {loading ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                            </div>
                        ) : filteredAppointments.length > 0 ? (
                            <div className="appointments-grid">
                                {filteredAppointments.map((appointment) => (
                                    <div key={appointment._id} className="appointment-card">
                                        <div className="appointment-header">
                                            <div className="appointment-date">
                                                <span className="date-icon">📅</span>
                                                <div>
                                                    <p className="date">{formatTime(appointment.appointmentDate)}</p>
                                                    <p className="time">{appointment.timeSlot}</p>
                                                </div>
                                            </div>
                                            <span className={`status-badge status-${appointment.status}`}>
                                                {appointment.status}
                                            </span>
                                        </div>

                                        <div className="appointment-body">
                                            <div className="patient-info">
                                                <h4>👤 {appointment.patientId?.name}</h4>
                                                <p>📞 {appointment.patientId?.phone}</p>
                                                <p>📧 {appointment.patientId?.email}</p>
                                            </div>

                                            <div className="symptoms">
                                                <p><strong>Symptoms:</strong></p>
                                                <p>{appointment.symptoms}</p>
                                            </div>

                                            {appointment.notes && (
                                                <div className="notes">
                                                    <p><strong>Notes:</strong></p>
                                                    <p>{appointment.notes}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="appointment-actions">
                                            {appointment.status === 'pending' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(appointment._id, 'confirmed')}
                                                    className="btn btn-success btn-sm"
                                                >
                                                    ✓ Confirm
                                                </button>
                                            )}
                                            {appointment.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    ✓ Complete
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleAddNotes(appointment._id)}
                                                className="btn btn-outline btn-sm"
                                            >
                                                📝 Add Notes
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No {filter !== 'all' ? filter : ''} appointments found</p>
                            </div>
                        )}
                    </>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                    <DoctorSchedule />
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="profile-section">
                        <div className="profile-header-actions">
                            <h2>Doctor Profile</h2>
                            {!isEditingProfile && (
                                <button onClick={() => setIsEditingProfile(true)} className="btn btn-primary">
                                    ✏️ Edit Profile
                                </button>
                            )}
                        </div>

                        <div className="profile-card">

                            {isEditingProfile ? (
                                <div className="profile-edit-form">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleProfileChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Email (Read-only)</label>
                                            <input
                                                type="email"
                                                value={user.email}
                                                className="form-control"
                                                disabled
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Phone *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleProfileChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Gender</label>
                                            <select
                                                name="gender"
                                                value={profileData.gender}
                                                onChange={handleProfileChange}
                                                className="form-control"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={profileData.dateOfBirth}
                                                onChange={handleProfileChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Blood Group</label>
                                            <select
                                                name="bloodGroup"
                                                value={profileData.bloodGroup}
                                                onChange={handleProfileChange}
                                                className="form-control"
                                            >
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Height (cm)</label>
                                            <input
                                                type="number"
                                                name="height"
                                                value={profileData.height}
                                                onChange={handleProfileChange}
                                                className="form-control"
                                                min="0"
                                                placeholder="e.g., 175"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Weight (kg)</label>
                                            <input
                                                type="number"
                                                name="weight"
                                                value={profileData.weight}
                                                onChange={handleProfileChange}
                                                className="form-control"
                                                min="0"
                                                placeholder="e.g., 70"
                                            />
                                        </div>

                                        <div className="form-group full-width">
                                            <label>Street Address</label>
                                            <input
                                                type="text"
                                                name="address.street"
                                                value={profileData.address.street}
                                                onChange={handleProfileChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={profileData.address.city}
                                                onChange={handleProfileChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>State</label>
                                            <input
                                                type="text"
                                                name="address.state"
                                                value={profileData.address.state}
                                                onChange={handleProfileChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Zip Code</label>
                                            <input
                                                type="text"
                                                name="address.zipCode"
                                                value={profileData.address.zipCode}
                                                onChange={handleProfileChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button onClick={handleSaveProfile} className="btn btn-primary">
                                            💾 Save Changes
                                        </button>
                                        <button onClick={handleCancelEdit} className="btn btn-outline">
                                            ❌ Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="profile-details-view">
                                    <div className="details-grid">
                                        <div className="detail-group">
                                            <label>Name</label>
                                            <p>{user.name || 'N/A'}</p>
                                        </div>
                                        <div className="detail-group">
                                            <label>Email</label>
                                            <p>{user.email || 'N/A'}</p>
                                        </div>
                                        <div className="detail-group">
                                            <label>Phone</label>
                                            <p>{user.phone || 'N/A'}</p>
                                        </div>
                                        <div className="detail-group">
                                            <label>Gender</label>
                                            <p>{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A'}</p>
                                        </div>
                                        <div className="detail-group">
                                            <label>Date of Birth</label>
                                            <p>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                        <div className="detail-group">
                                            <label>Age</label>
                                            <p>{calculateAge(user.dateOfBirth)} years</p>
                                        </div>
                                        <div className="detail-group">
                                            <label>Blood Group</label>
                                            <p>{user.bloodGroup || 'N/A'}</p>
                                        </div>
                                        <div className="detail-group">
                                            <label>Height</label>
                                            <p>{user.height ? `${user.height} cm` : 'N/A'}</p>
                                        </div>
                                        <div className="detail-group">
                                            <label>Weight</label>
                                            <p>{user.weight ? `${user.weight} kg` : 'N/A'}</p>
                                        </div>
                                        <div className="detail-group full-width">
                                            <label>Address</label>
                                            <p>
                                                {user.address?.street && `${user.address.street}, `}
                                                {user.address?.city && `${user.address.city}, `}
                                                {user.address?.state && `${user.address.state} `}
                                                {user.address?.zipCode && user.address.zipCode}
                                                {!user.address?.street && !user.address?.city && !user.address?.state && !user.address?.zipCode && 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
