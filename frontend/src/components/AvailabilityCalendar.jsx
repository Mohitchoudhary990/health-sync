import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/AvailabilityCalendar.css';

const AvailabilityCalendar = ({ doctorAvailability, selectedDate, onDateSelect, minDate, maxDate }) => {
    // Generate array of next 30 days
    const generateCalendarDays = () => {
        const days = [];
        const today = new Date();
        const min = new Date(minDate);
        const max = new Date(maxDate);

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i + 1); // Start from tomorrow

            if (date >= min && date <= max) {
                days.push(date);
            }
        }

        return days;
    };

    // Check if a specific date is available based on doctor's availability
    const isDateAvailable = (date) => {
        if (!doctorAvailability || doctorAvailability.length === 0) {
            return false;
        }

        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayAvailability = doctorAvailability.find(a => a.day === dayOfWeek);

        return dayAvailability && dayAvailability.slots && dayAvailability.slots.length > 0;
    };

    // Check if a date is selected
    const isDateSelected = (date) => {
        if (!selectedDate) return false;
        const selected = new Date(selectedDate);
        return date.toDateString() === selected.toDateString();
    };

    // Handle date click
    const handleDateClick = (date) => {
        if (isDateAvailable(date)) {
            const dateString = date.toISOString().split('T')[0];
            onDateSelect(dateString);
        }
    };

    // Check if date is today
    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const calendarDays = generateCalendarDays();

    return (
        <div className="availability-calendar">
            <div className="calendar-header">
                <h4>📅 Select an Available Day</h4>
                <div className="calendar-legend">
                    <span className="legend-item">
                        <span className="legend-color available"></span>
                        Available
                    </span>
                    <span className="legend-item">
                        <span className="legend-color unavailable"></span>
                        Unavailable
                    </span>
                </div>
            </div>

            <div className="calendar-grid">
                {calendarDays.map((date, index) => {
                    const available = isDateAvailable(date);
                    const selected = isDateSelected(date);
                    const today = isToday(date);

                    return (
                        <div
                            key={index}
                            className={`calendar-day ${available ? 'available' : 'unavailable'} ${selected ? 'selected' : ''} ${today ? 'today' : ''}`}
                            onClick={() => handleDateClick(date)}
                            role="button"
                            tabIndex={available ? 0 : -1}
                            aria-label={`${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${available ? 'Available' : 'Unavailable'}`}
                        >
                            <div className="day-name">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="day-number">
                                {date.getDate()}
                            </div>
                            <div className="day-month">
                                {date.toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                            {selected && <div className="selected-indicator">✓</div>}
                        </div>
                    );
                })}
            </div>

            {(!doctorAvailability || doctorAvailability.length === 0) && (
                <div className="no-availability-message">
                    <p>⚠️ This doctor has not set their availability yet.</p>
                </div>
            )}
        </div>
    );
};

AvailabilityCalendar.propTypes = {
    doctorAvailability: PropTypes.arrayOf(
        PropTypes.shape({
            day: PropTypes.string.isRequired,
            slots: PropTypes.arrayOf(
                PropTypes.shape({
                    startTime: PropTypes.string,
                    endTime: PropTypes.string,
                    isBooked: PropTypes.bool,
                })
            ),
        })
    ),
    selectedDate: PropTypes.string,
    onDateSelect: PropTypes.func.isRequired,
    minDate: PropTypes.string.isRequired,
    maxDate: PropTypes.string.isRequired,
};

export default AvailabilityCalendar;
