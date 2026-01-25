import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';
import '../styles/components/PrescriptionForm.css';

const PrescriptionForm = ({ appointmentId, onSuccess, onCancel }) => {
    const [prescription, setPrescription] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!prescription.trim()) {
            setError('Please enter prescription details');
            return;
        }

        setError('');
        setSubmitting(true);

        try {
            await api.put(`/appointments/${appointmentId}`, {
                prescription,
                diagnosis,
                notes,
            });

            alert('Prescription added successfully!');
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add prescription');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="prescription-form-container">
            <h3>Add Prescription</h3>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="prescription-form">
                <div className="form-group">
                    <label htmlFor="diagnosis">Diagnosis</label>
                    <input
                        type="text"
                        id="diagnosis"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Enter diagnosis..."
                        maxLength="200"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="prescription">Prescription *</label>
                    <textarea
                        id="prescription"
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        placeholder="Enter medications, dosage, and instructions...&#10;Example:&#10;1. Paracetamol 500mg - 1 tablet twice daily after meals&#10;2. Amoxicillin 250mg - 1 capsule three times daily"
                        rows="8"
                        required
                    />
                    <small>Be specific with medication names, dosages, and instructions</small>
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional instructions or follow-up recommendations..."
                        rows="4"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : 'Save Prescription'}
                    </button>
                </div>
            </form>
        </div>
    );
};

PrescriptionForm.propTypes = {
    appointmentId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
};

export default PrescriptionForm;
