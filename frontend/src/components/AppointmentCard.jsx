import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ReviewForm from './ReviewForm';
import PrescriptionForm from './PrescriptionForm';
import '../styles/components/AppointmentCard.css';

const AppointmentCard = ({ appointment, onCancel, onUpdate, onReviewSubmitted }) => {
    const { user } = useAuth();
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [showPrescriptionView, setShowPrescriptionView] = useState(false);
    const [showPatientDetails, setShowPatientDetails] = useState(false);

    const getStatusClass = (status) => {
        const statusClasses = {
            pending: 'status-pending',
            confirmed: 'status-confirmed',
            completed: 'status-completed',
            cancelled: 'status-cancelled',
        };
        return statusClasses[status] || '';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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

    const handleReviewSuccess = () => {
        setShowReviewForm(false);
        if (onReviewSubmitted) {
            onReviewSubmitted();
        }
    };

    const handlePrescriptionSuccess = () => {
        setShowPrescriptionForm(false);
        if (onReviewSubmitted) {
            onReviewSubmitted(); // Refresh appointment data
        }
    };

    return (
        <>
            <div className="appointment-card">
                <div className="appointment-header">
                    <div className="appointment-date">
                        <span className="date-icon">📅</span>
                        <div>
                            <p className="date">{formatDate(appointment.appointmentDate)}</p>
                            <p className="time">{appointment.timeSlot}</p>
                        </div>
                    </div>
                    <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                        {appointment.status}
                    </span>
                </div>

                <div className="appointment-body">
                    <div className="doctor-info">
                        <h4>{appointment.doctorId?.userId?.name}</h4>
                        <p>{appointment.doctorId?.specialization}</p>
                        <p>{appointment.doctorId?.department}</p>
                    </div>

                    <div className="patient-info">
                        <p><strong>Patient:</strong> {appointment.patientId?.name}</p>
                        <p><strong>Phone:</strong> {appointment.patientId?.phone}</p>
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
                    {appointment.status === 'pending' && onCancel && (
                        <button
                            onClick={() => onCancel(appointment._id)}
                            className="btn btn-danger"
                        >
                            Cancel
                        </button>
                    )}
                    {/* Only doctors can confirm appointments */}
                    {appointment.status === 'pending' && onUpdate && user?.role === 'doctor' && (
                        <>
                            <button
                                onClick={() => setShowPatientDetails(true)}
                                className="btn btn-info"
                            >
                                👤 View Patient Details
                            </button>
                            <button
                                onClick={() => onUpdate(appointment._id, 'confirmed')}
                                className="btn btn-success"
                            >
                                ✓ Confirm
                            </button>
                        </>
                    )}
                    {/* Doctors can complete confirmed appointments */}
                    {appointment.status === 'confirmed' && onUpdate && user?.role === 'doctor' && (
                        <button
                            onClick={() => onUpdate(appointment._id, 'completed')}
                            className="btn btn-success"
                        >
                            ✅ Complete Appointment
                        </button>
                    )}
                    {appointment.status === 'completed' && !appointment.hasReview && user?.role === 'patient' && (
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="btn btn-primary"
                        >
                            ⭐ Write Review
                        </button>
                    )}
                    {appointment.status === 'completed' && user?.role === 'doctor' && !appointment.prescription && (
                        <button
                            onClick={() => setShowPrescriptionForm(true)}
                            className="btn btn-success"
                        >
                            💊 Add Prescription
                        </button>
                    )}
                    {appointment.prescription && (
                        <button
                            onClick={() => setShowPrescriptionView(true)}
                            className="btn btn-info"
                        >
                            📋 View Prescription
                        </button>
                    )}
                </div>
            </div>

            {/* Patient Details Modal */}
            {showPatientDetails && (
                <div className="modal-overlay" onClick={() => setShowPatientDetails(false)}>
                    <div className="modal-content patient-details-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="patient-details-container">
                            <h3>👤 Patient Details</h3>

                            <div className="patient-profile-header">
                                <img
                                    src={appointment.patientId?.profileImage || '/images/default-avatar.png'}
                                    alt={appointment.patientId?.name}
                                    className="patient-profile-image"
                                    onError={(e) => { e.target.src = '/images/default-avatar.png'; }}
                                />
                                <div>
                                    <h4>{appointment.patientId?.name}</h4>
                                    <p>{appointment.patientId?.email}</p>
                                </div>
                            </div>

                            <div className="patient-details-grid">
                                <div className="detail-item">
                                    <label>📞 Phone</label>
                                    <p>{appointment.patientId?.phone || 'N/A'}</p>
                                </div>
                                <div className="detail-item">
                                    <label>🚻 Gender</label>
                                    <p>{appointment.patientId?.gender ? appointment.patientId.gender.charAt(0).toUpperCase() + appointment.patientId.gender.slice(1) : 'N/A'}</p>
                                </div>
                                <div className="detail-item">
                                    <label>🎂 Age</label>
                                    <p>{calculateAge(appointment.patientId?.dateOfBirth)} years</p>
                                </div>
                                <div className="detail-item">
                                    <label>🩸 Blood Group</label>
                                    <p>{appointment.patientId?.bloodGroup || 'N/A'}</p>
                                </div>
                                <div className="detail-item">
                                    <label>📏 Height</label>
                                    <p>{appointment.patientId?.height ? `${appointment.patientId.height} cm` : 'N/A'}</p>
                                </div>
                                <div className="detail-item">
                                    <label>⚖️ Weight</label>
                                    <p>{appointment.patientId?.weight ? `${appointment.patientId.weight} kg` : 'N/A'}</p>
                                </div>
                                <div className="detail-item full-width">
                                    <label>📍 Address</label>
                                    <p>
                                        {appointment.patientId?.address?.street && `${appointment.patientId.address.street}, `}
                                        {appointment.patientId?.address?.city && `${appointment.patientId.address.city}, `}
                                        {appointment.patientId?.address?.state && `${appointment.patientId.address.state} `}
                                        {appointment.patientId?.address?.zipCode && appointment.patientId.address.zipCode}
                                        {!appointment.patientId?.address?.street && !appointment.patientId?.address?.city && !appointment.patientId?.address?.state && !appointment.patientId?.address?.zipCode && 'N/A'}
                                    </p>
                                </div>
                                <div className="detail-item full-width">
                                    <label>🤒 Symptoms</label>
                                    <p>{appointment.symptoms}</p>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    onClick={() => {
                                        setShowPatientDetails(false);
                                        onUpdate(appointment._id, 'confirmed');
                                    }}
                                    className="btn btn-success"
                                >
                                    ✓ Confirm Appointment
                                </button>
                                <button
                                    onClick={() => setShowPatientDetails(false)}
                                    className="btn btn-secondary"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showReviewForm && (
                <div className="modal-overlay" onClick={() => setShowReviewForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <ReviewForm
                            appointmentId={appointment._id}
                            doctorName={appointment.doctorId?.userId?.name || 'Doctor'}
                            onSuccess={handleReviewSuccess}
                            onCancel={() => setShowReviewForm(false)}
                        />
                    </div>
                </div>
            )}

            {showPrescriptionForm && (
                <div className="modal-overlay" onClick={() => setShowPrescriptionForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <PrescriptionForm
                            appointmentId={appointment._id}
                            onSuccess={handlePrescriptionSuccess}
                            onCancel={() => setShowPrescriptionForm(false)}
                        />
                    </div>
                </div>
            )}

            {showPrescriptionView && (
                <div className="modal-overlay" onClick={() => setShowPrescriptionView(false)}>
                    <div className="modal-content prescription-view" onClick={(e) => e.stopPropagation()}>
                        <div className="prescription-view-container">
                            <h3>💊 Prescription Details</h3>

                            {appointment.diagnosis && (
                                <div className="prescription-section">
                                    <h4>Diagnosis</h4>
                                    <p>{appointment.diagnosis}</p>
                                </div>
                            )}

                            <div className="prescription-section">
                                <h4>Prescription</h4>
                                <pre>{appointment.prescription}</pre>
                            </div>

                            {appointment.notes && (
                                <div className="prescription-section">
                                    <h4>Additional Notes</h4>
                                    <p>{appointment.notes}</p>
                                </div>
                            )}

                            <div className="prescription-footer">
                                <p><strong>Doctor:</strong> {appointment.doctorId?.userId?.name}</p>
                                <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                            </div>

                            <button
                                onClick={() => setShowPrescriptionView(false)}
                                className="btn btn-secondary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppointmentCard;
