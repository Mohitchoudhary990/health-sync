import { useState, useEffect } from 'react';
import api from '../utils/api';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/pages/Appointments.css';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            await api.delete(`/appointments/${id}`);
            fetchAppointments();
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            alert('Failed to cancel appointment');
        }
    };

    const handleUpdate = async (id, status) => {
        try {
            await api.put(`/appointments/${id}`, { status });
            fetchAppointments();
        } catch (error) {
            console.error('Error updating appointment:', error);
            alert('Failed to update appointment');
        }
    };

    const filteredAppointments = appointments.filter((appointment) => {
        if (filter === 'all') return true;
        return appointment.status === filter;
    });

    return (
        <div className="appointments-page">
            <div className="container">
                <div className="page-header">
                    <h1>My Appointments</h1>
                    <p>Manage all your appointments in one place</p>
                </div>

                <div className="filter-tabs">
                    <button
                        className={`tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({appointments.length})
                    </button>
                    <button
                        className={`tab ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({appointments.filter(a => a.status === 'pending').length})
                    </button>
                    <button
                        className={`tab ${filter === 'confirmed' ? 'active' : ''}`}
                        onClick={() => setFilter('confirmed')}
                    >
                        Confirmed ({appointments.filter(a => a.status === 'confirmed').length})
                    </button>
                    <button
                        className={`tab ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed ({appointments.filter(a => a.status === 'completed').length})
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : filteredAppointments.length > 0 ? (
                    <div className="appointments-grid">
                        {filteredAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment._id}
                                appointment={appointment}
                                onCancel={handleCancel}
                                onUpdate={handleUpdate}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No {filter !== 'all' ? filter : ''} appointments found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;
