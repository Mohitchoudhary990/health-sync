import Department from '../models/Department.js';

export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({ isActive: true });

        res.json({
            success: true,
            count: departments.length,
            data: departments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createDepartment = async (req, res) => {
    try {
        const { name, description, icon } = req.body;

        const department = await Department.create({
            name,
            description,
            icon,
        });

        res.status(201).json({
            success: true,
            data: department,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
