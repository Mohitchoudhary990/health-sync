import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide department name'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide department description'],
        },
        icon: {
            type: String,
            default: 'hospital',
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

departmentSchema.virtual('doctorCount', {
    ref: 'Doctor',
    localField: 'name',
    foreignField: 'department',
    count: true,
});

export default mongoose.model('Department', departmentSchema);
