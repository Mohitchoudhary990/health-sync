import User from '../models/User.js';

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        console.log('=== UPDATE PROFILE REQUEST ===');
        console.log('User ID:', req.user?._id);
        console.log('Request body:', req.body);

        const { name, phone, dateOfBirth, gender, address, bloodGroup, height, weight } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        console.log('Current user data:', {
            name: user.name,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            address: user.address,
            bloodGroup: user.bloodGroup,
            height: user.height,
            weight: user.weight
        });

        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (gender) user.gender = gender;
        if (address) user.address = address;
        if (bloodGroup) user.bloodGroup = bloodGroup;
        if (height !== undefined) user.height = height;
        if (weight !== undefined) user.weight = weight;

        await user.save();

        console.log('User updated successfully');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                address: user.address,
                profileImage: user.profileImage,
                bloodGroup: user.bloodGroup,
                height: user.height,
                weight: user.weight,
            },
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');

        res.json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        user.role = req.body.role || user.role;
        await user.save();

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await user.deleteOne();

        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
