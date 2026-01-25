import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

export const getDoctors = async (req, res) => {
    try {
        const { specialization, department, search } = req.query;

        let query = { isActive: true };

        if (specialization) {
            query.specialization = specialization;
        }

        if (department) {
            query.department = department;
        }

        const doctors = await Doctor.find(query).populate('userId', 'name email phone profileImage');

        if (search) {
            const filteredDoctors = doctors.filter(doctor =>
                doctor.userId.name.toLowerCase().includes(search.toLowerCase()) ||
                doctor.specialization.toLowerCase().includes(search.toLowerCase())
            );
            return res.json({
                success: true,
                count: filteredDoctors.length,
                data: filteredDoctors,
            });
        }

        res.json({
            success: true,
            count: doctors.length,
            data: doctors,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email phone profileImage address');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        res.json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createDoctor = async (req, res) => {
    try {
        const { userId, specialization, department, qualification, experience, consultationFee, availability, bio } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user.role !== 'doctor') {
            user.role = 'doctor';
            await user.save();
        }

        const doctor = await Doctor.create({
            userId,
            specialization,
            department,
            qualification,
            experience,
            consultationFee,
            availability,
            bio,
        });

        res.status(201).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedDoctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        // Store userId before deleting doctor
        const userId = doctor.userId;

        // Delete the doctor profile
        await doctor.deleteOne();

        // Update the user's role back to 'patient'
        // This keeps the user account but removes doctor privileges
        await User.findByIdAndUpdate(userId, {
            role: 'patient',
        });

        res.json({
            success: true,
            message: 'Doctor profile removed and user role updated to patient',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateDoctorAvailability = async (req, res) => {
    try {
        const { availability } = req.body;

        // Find doctor by user ID
        const doctor = await Doctor.findOne({ userId: req.user._id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found',
            });
        }

        doctor.availability = availability;
        await doctor.save();

        res.json({
            success: true,
            data: doctor,
            message: 'Availability updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getDoctorAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.query;

        if (!doctorId || !date) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID and date are required',
            });
        }

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        // Get day of week from date
        const appointmentDate = new Date(date);
        const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });

        // Find availability for that day
        const dayAvailability = doctor.availability.find(a => a.day === dayOfWeek);

        if (!dayAvailability || !dayAvailability.slots || dayAvailability.slots.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: 'Doctor not available on this day',
            });
        }

        // Import Appointment model to check existing bookings
        const Appointment = (await import('../models/Appointment.js')).default;

        // Get all booked appointments for this doctor on this date
        const bookedAppointments = await Appointment.find({
            doctorId: doctorId,
            appointmentDate: {
                $gte: new Date(date).setHours(0, 0, 0, 0),
                $lt: new Date(date).setHours(23, 59, 59, 999),
            },
            status: { $in: ['pending', 'confirmed'] },
        }).select('timeSlot');

        // Count appointments per time slot
        const slotBookingCounts = {};
        bookedAppointments.forEach(apt => {
            const timeSlot = apt.timeSlot;
            slotBookingCounts[timeSlot] = (slotBookingCounts[timeSlot] || 0) + 1;
        });

        // Maximum appointments per slot
        const MAX_APPOINTMENTS_PER_SLOT = 5;

        // Filter slots: only show slots that haven't reached the maximum
        const availableSlots = dayAvailability.slots
            .filter(slot => !slot.isBooked) // Respect doctor's manual blocking
            .map(slot => {
                const displayTime = `${slot.startTime} - ${slot.endTime}`;
                const currentBookings = slotBookingCounts[displayTime] || 0;
                const spotsRemaining = MAX_APPOINTMENTS_PER_SLOT - currentBookings;

                return {
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    displayTime: displayTime,
                    spotsRemaining: spotsRemaining,
                    isAvailable: spotsRemaining > 0,
                };
            })
            .filter(slot => slot.isAvailable); // Only return slots with available spots

        res.json({
            success: true,
            data: availableSlots,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateDoctorProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file',
            });
        }

        const doctor = await Doctor.findOne({ userId: req.user._id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found',
            });
        }

        // Construct the image URL (relative path)
        // Note: In production, this might be a cloud storage URL
        const imageUrl = `/uploads/doctors/${req.file.filename}`;

        doctor.profileImage = imageUrl;
        await doctor.save();

        res.json({
            success: true,
            message: 'Profile image updated successfully',
            data: {
                profileImage: imageUrl
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
