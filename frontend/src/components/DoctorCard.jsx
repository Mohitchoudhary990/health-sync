import { Link } from 'react-router-dom';
import '../styles/components/DoctorCard.css';

const DoctorCard = ({ doctor }) => {
    // Get initials from doctor's name
    const getInitials = (name) => {
        if (!name) return 'DR';
        const names = name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="doctor-card">
            <div className="doctor-image">
                <div className="doctor-avatar">
                    {getInitials(doctor.userId?.name)}
                </div>
                <span className="rating">⭐ {doctor.rating.toFixed(1)}</span>
            </div>

            <div className="doctor-info">
                <h3>{doctor.userId?.name}</h3>
                <p className="specialization">{doctor.specialization}</p>
                <p className="department">{doctor.department}</p>

                <div className="doctor-details">
                    <div className="detail-item">
                        <span className="label">Experience:</span>
                        <span className="value">{doctor.experience} years</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Fee:</span>
                        <span className="value">₹{doctor.consultationFee}</span>
                    </div>
                </div>

                {doctor.bio && (
                    <p className="bio">{doctor.bio.substring(0, 100)}...</p>
                )}

                <Link
                    to={`/book-appointment/${doctor._id}`}
                    className="btn btn-primary btn-block"
                >
                    Book Appointment
                </Link>
            </div>
        </div>
    );
};

export default DoctorCard;
