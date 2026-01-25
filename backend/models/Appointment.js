import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true,
        },
        appointmentDate: {
            type: Date,
            required: [true, 'Please provide appointment date'],
        },
        timeSlot: {
            type: String,
            required: [true, 'Please provide time slot'],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        symptoms: {
            type: String,
            required: [true, 'Please describe symptoms'],
        },
        notes: {
            type: String,
        },
        prescription: {
            type: String,
        },
        diagnosis: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

appointmentSchema.index({ patientId: 1, appointmentDate: -1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: -1 });

export default mongoose.model('Appointment', appointmentSchema);
