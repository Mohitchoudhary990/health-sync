import { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/components/DoctorSchedule.css';

const DoctorSchedule = () => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [newSlot, setNewSlot] = useState({
        startTime: '09:00',
        endTime: '10:00',
    });

    useEffect(() => {
        fetchCurrentAvailability();
    }, []);

    const fetchCurrentAvailability = async () => {
        try {
            // Get current doctor's availability
            const response = await api.get('/users/me');
            const userId = response.data.data._id;

            // Get doctor profile
            const doctorsResponse = await api.get('/doctors');
            const doctor = doctorsResponse.data.data.find(d => d.userId._id === userId);

            if (doctor && doctor.availability) {
                setAvailability(doctor.availability);
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };

    const handleAddSlot = () => {
        const dayIndex = availability.findIndex(a => a.day === selectedDay);

        if (dayIndex >= 0) {
            // Day exists, add slot
            const updatedAvailability = [...availability];
            updatedAvailability[dayIndex].slots.push({
                startTime: newSlot.startTime,
                endTime: newSlot.endTime,
                isBooked: false,
            });
            setAvailability(updatedAvailability);
        } else {
            // Day doesn't exist, create it
            setAvailability([
                ...availability,
                {
                    day: selectedDay,
                    slots: [{
                        startTime: newSlot.startTime,
                        endTime: newSlot.endTime,
                        isBooked: false,
                    }],
                },
            ]);
        }
    };

    const handleRemoveSlot = (day, slotIndex) => {
        const updatedAvailability = availability.map(a => {
            if (a.day === day) {
                return {
                    ...a,
                    slots: a.slots.filter((_, index) => index !== slotIndex),
                };
            }
            return a;
        }).filter(a => a.slots.length > 0); // Remove days with no slots

        setAvailability(updatedAvailability);
    };

    const handleSaveSchedule = async () => {
        setLoading(true);
        try {
            await api.put('/doctors/availability/update', { availability });
            alert('Schedule updated successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update schedule');
        } finally {
            setLoading(false);
        }
    };

    const getDaySlots = (day) => {
        const dayAvailability = availability.find(a => a.day === day);
        return dayAvailability ? dayAvailability.slots : [];
    };

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                times.push(time);
            }
        }
        return times;
    };

    return (
        <div className="doctor-schedule">
            <div className="schedule-header">
                <h2>Manage Your Availability</h2>
                <p>Set your working days and time slots</p>
            </div>

            {/* Add New Slot */}
            <div className="add-slot-section">
                <h3>Add Time Slot</h3>
                <div className="slot-form">
                    <div className="form-group">
                        <label>Day</label>
                        <select
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                        >
                            {daysOfWeek.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Start Time</label>
                        <select
                            value={newSlot.startTime}
                            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                        >
                            {generateTimeOptions().map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>End Time</label>
                        <select
                            value={newSlot.endTime}
                            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                        >
                            {generateTimeOptions().map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleAddSlot} className="btn btn-primary">
                        ➕ Add Slot
                    </button>
                </div>
            </div>

            {/* Current Schedule */}
            <div className="current-schedule">
                <h3>Current Schedule</h3>
                <div className="schedule-grid">
                    {daysOfWeek.map(day => {
                        const slots = getDaySlots(day);
                        return (
                            <div key={day} className="day-card">
                                <div className="day-header">
                                    <h4>{day}</h4>
                                    <span className="slot-count">{slots.length} slots</span>
                                </div>
                                <div className="slots-list">
                                    {slots.length > 0 ? (
                                        slots.map((slot, index) => (
                                            <div key={index} className="slot-item">
                                                <span className="slot-time">
                                                    {slot.startTime} - {slot.endTime}
                                                </span>
                                                {slot.isBooked && (
                                                    <span className="booked-badge">Booked</span>
                                                )}
                                                {!slot.isBooked && (
                                                    <button
                                                        onClick={() => handleRemoveSlot(day, index)}
                                                        className="btn-remove"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-slots">No slots available</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Save Button */}
            <div className="schedule-actions">
                <button
                    onClick={handleSaveSchedule}
                    className="btn btn-success btn-lg"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : '💾 Save Schedule'}
                </button>
            </div>
        </div>
    );
};

export default DoctorSchedule;
