import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import '../styles/pages/BookAppointment.css';

const BookAppointment = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [formData, setFormData] = useState({
        appointmentDate: '',
        timeSlot: '',
        symptoms: '',
    });
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [slotsMessage, setSlotsMessage] = useState('');

    useEffect(() => {
        fetchDoctor();
    }, [doctorId]);

    const fetchDoctor = async () => {
        try {
            const response = await api.get(`/doctors/${doctorId}`);
            setDoctor(response.data.data);
        } catch (error) {
            console.error('Error fetching doctor:', error);
            setError('Doctor not found');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async (date) => {
        if (!date) return;

        setLoadingSlots(true);
        setSlotsMessage('');
        setAvailableSlots([]);

        try {
            const response = await api.get('/doctors/availability/slots', {
                params: {
                    doctorId,
                    date,
                },
            });

            if (response.data.success) {
                const slots = response.data.data;
                if (slots.length === 0) {
                    setSlotsMessage('No available slots for this date. Please select another date.');
                } else {
                    setAvailableSlots(slots);
                }
            }
        } catch (error) {
            console.error('Error fetching available slots:', error);
            setSlotsMessage('Unable to fetch available slots. Please try again.');
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        // Fetch available slots when date is selected
        if (name === 'appointmentDate') {
            setFormData(prev => ({
                ...prev,
                appointmentDate: value,
                timeSlot: '', // Reset time slot when date changes
            }));
            fetchAvailableSlots(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await api.post('/appointments', {
                doctorId,
                ...formData,
            });

            alert('Appointment booked successfully!');
            navigate('/appointments');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setSubmitting(false);
        }
    };

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        // Allow booking up to 60 days in advance
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 60);
        return maxDate.toISOString().split('T')[0];
    };

    const isDateAvailable = (dateString) => {
        if (!doctor || !doctor.availability || doctor.availability.length === 0) {
            return false;
        }

        const date = new Date(dateString);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

        // Check if doctor has availability for this day
        const dayAvailability = doctor.availability.find(a => a.day === dayOfWeek);
        return dayAvailability && dayAvailability.slots && dayAvailability.slots.length > 0;
    };

    const getAvailableDays = () => {
        if (!doctor || !doctor.availability || doctor.availability.length === 0) {
            return 'No availability set';
        }

        const days = doctor.availability
            .filter(a => a.slots && a.slots.length > 0)
            .map(a => a.day);

        if (days.length === 0) {
            return 'No availability set';
        }

        return days.join(', ');
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;

        // Check if the selected date is available
        if (!isDateAvailable(selectedDate)) {
            setError(`Doctor is not available on this day. Available days: ${getAvailableDays()}`);
            setFormData(prev => ({
                ...prev,
                appointmentDate: '',
                timeSlot: '',
            }));
            setAvailableSlots([]);
            return;
        }

        // Clear error and proceed
        setError('');
        setFormData(prev => ({
            ...prev,
            appointmentDate: selectedDate,
            timeSlot: '',
        }));
        fetchAvailableSlots(selectedDate);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error && !doctor) {
        return (
            <div className="container">
                <div className="error-state">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="book-appointment-page">
            <div className="container">
                <div className="booking-container">
                    <div className="doctor-summary">
                        <img
                            src={doctor.userId?.profileImage || '/default-avatar.png'}
                            alt={doctor.userId?.name}
                            className="doctor-avatar"
                        />
                        <div>
                            <h2>{doctor.userId?.name}</h2>
                            <p className="specialization">{doctor.specialization}</p>
                            <p className="department">{doctor.department}</p>
                            <p className="fee">Consultation Fee: ₹{doctor.consultationFee}</p>
                        </div>
                    </div>

                    <div className="booking-form-container">
                        <h3>Book Appointment</h3>

                        {error && <div className="alert alert-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="booking-form">
                            {/* Visual Availability Calendar */}
                            {doctor && doctor.availability && (
                                <AvailabilityCalendar
                                    doctorAvailability={doctor.availability}
                                    selectedDate={formData.appointmentDate}
                                    onDateSelect={handleDateChange}
                                    minDate={getMinDate()}
                                    maxDate={getMaxDate()}
                                />
                            )}

                            <div className="form-group">
                                <label htmlFor="appointmentDate">Select Date</label>
                                {doctor && doctor.availability && doctor.availability.length > 0 && (
                                    <p className="availability-info">
                                        📅 Doctor is available on: <strong>{getAvailableDays()}</strong>
                                    </p>
                                )}
                                <input
                                    type="date"
                                    id="appointmentDate"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleDateChange}
                                    min={getMinDate()}
                                    max={getMaxDate()}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="timeSlot">Select Time Slot</label>
                                {!formData.appointmentDate ? (
                                    <p className="info-message">Please select a date first</p>
                                ) : loadingSlots ? (
                                    <div className="loading-slots">
                                        <div className="spinner-small"></div>
                                        <span>Loading available slots...</span>
                                    </div>
                                ) : slotsMessage ? (
                                    <p className="warning-message">{slotsMessage}</p>
                                ) : (
                                    <select
                                        id="timeSlot"
                                        name="timeSlot"
                                        value={formData.timeSlot}
                                        onChange={handleChange}
                                        required
                                        disabled={availableSlots.length === 0}
                                    >
                                        <option value="">Choose a time</option>
                                        {availableSlots.map((slot, index) => (
                                            <option key={index} value={slot.displayTime}>
                                                {slot.displayTime}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="symptoms">Describe Your Symptoms</label>
                                <textarea
                                    id="symptoms"
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                    placeholder="Please describe your symptoms or reason for visit..."
                                    rows="4"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                                disabled={submitting}
                            >
                                {submitting ? 'Booking...' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
