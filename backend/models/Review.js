import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
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
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
            unique: true, // One review per appointment
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for fast lookups
reviewSchema.index({ doctorId: 1, createdAt: -1 });
reviewSchema.index({ patientId: 1 });

// Static method to calculate average rating for a doctor
reviewSchema.statics.calculateAverageRating = async function (doctorId) {
    const stats = await this.aggregate([
        {
            $match: { doctorId: doctorId }
        },
        {
            $group: {
                _id: '$doctorId',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    try {
        if (stats.length > 0) {
            await mongoose.model('Doctor').findByIdAndUpdate(doctorId, {
                rating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
                reviewCount: stats[0].reviewCount
            });
        } else {
            // No reviews, reset to 0
            await mongoose.model('Doctor').findByIdAndUpdate(doctorId, {
                rating: 0,
                reviewCount: 0
            });
        }
    } catch (error) {
        console.error('Error updating doctor rating:', error);
    }
};

// Update doctor rating after save
reviewSchema.post('save', function () {
    this.constructor.calculateAverageRating(this.doctorId);
});

// Update doctor rating after remove
reviewSchema.post('remove', function () {
    this.constructor.calculateAverageRating(this.doctorId);
});

// Update doctor rating after findOneAndDelete
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await doc.constructor.calculateAverageRating(doc.doctorId);
    }
});

export default mongoose.model('Review', reviewSchema);
