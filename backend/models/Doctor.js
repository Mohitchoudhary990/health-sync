import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        specialization: {
            type: String,
            required: [true, 'Please provide specialization'],
        },
        department: {
            type: String,
            required: [true, 'Please provide department'],
        },
        qualification: {
            type: String,
            required: [true, 'Please provide qualification'],
        },
        experience: {
            type: Number,
            required: [true, 'Please provide years of experience'],
            min: 0,
        },
        consultationFee: {
            type: Number,
            required: [true, 'Please provide consultation fee'],
            min: 0,
        },
        availability: [
            {
                day: {
                    type: String,
                    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                },
                slots: [
                    {
                        startTime: String,
                        endTime: String,
                        isBooked: {
                            type: Boolean,
                            default: false,
                        },
                    },
                ],
            },
        ],
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

doctorSchema.index({ specialization: 1, department: 1 });

export default mongoose.model('Doctor', doctorSchema);
