import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

export const getAppointments = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'patient') {
            query.patientId = req.user._id;
        } else if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ userId: req.user._id });
            if (doctor) {
                query.doctorId = doctor._id;
            }
        }

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name email phone dateOfBirth gender bloodGroup height weight address profileImage')
            .populate({
                path: 'doctorId',
                populate: {
                    path: 'userId',
                    select: 'name email phone',
                },
            })
            .sort({ appointmentDate: -1 });

        res.json({
            success: true,
            count: appointments.length,
            data: appointments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patientId', 'name email phone dateOfBirth gender bloodGroup height weight address profileImage')
            .populate({
                path: 'doctorId',
                populate: {
                    path: 'userId',
                    select: 'name email phone',
                },
            });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        res.json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate, timeSlot, symptoms } = req.body;

        // Check how many appointments already exist for this doctor at this time slot
        const existingAppointmentsCount = await Appointment.countDocuments({
            doctorId,
            appointmentDate,
            timeSlot,
            status: { $in: ['pending', 'confirmed'] },
        });

        // Maximum 5 appointments per time slot
        const MAX_APPOINTMENTS_PER_SLOT = 5;

        if (existingAppointmentsCount >= MAX_APPOINTMENTS_PER_SLOT) {
            return res.status(400).json({
                success: false,
                message: `This time slot is fully booked. Doctor can only take ${MAX_APPOINTMENTS_PER_SLOT} appointments per time slot.`,
            });
        }

        const appointment = await Appointment.create({
            patientId: req.user._id,
            doctorId,
            appointmentDate,
            timeSlot,
            symptoms,
        });

        res.status(201).json({
            success: true,
            data: appointment,
            message: 'Appointment created successfully.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        // If updating prescription, diagnosis, or notes - only doctors can do this
        if (req.body.prescription || req.body.diagnosis || req.body.notes) {
            if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only doctors can add prescriptions and notes',
                });
            }

            // Verify the doctor owns this appointment
            if (req.user.role === 'doctor') {
                const Doctor = (await import('../models/Doctor.js')).default;
                const doctor = await Doctor.findOne({ userId: req.user._id });

                if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
                    return res.status(403).json({
                        success: false,
                        message: 'You can only add prescriptions to your own appointments',
                    });
                }
            }
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedAppointment,
            message: 'Appointment updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        if (appointment.patientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this appointment',
            });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({
            success: true,
            message: 'Appointment cancelled',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
