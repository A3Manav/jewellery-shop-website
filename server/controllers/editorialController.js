const Editorial = require('../models/Editorial');
const cloudinary = require('../utils/cloudinary');

// Get all editorials (for public display)
const getAllEditorials = async (req, res) => {
    try {
        const editorials = await Editorial.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .select('title description image link');

        res.status(200).json({
            success: true,
            data: editorials
        });
    } catch (error) {
        console.error('Get editorials error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch editorials',
            error: error.message
        });
    }
};

// Get all editorials for admin (including inactive)
const getAllEditorialsAdmin = async (req, res) => {
    try {
        const editorials = await Editorial.find()
            .sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            data: editorials
        });
    } catch (error) {
        console.error('Get admin editorials error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch editorials',
            error: error.message
        });
    }
};

// Get single editorial by ID
const getEditorialById = async (req, res) => {
    try {
        const editorial = await Editorial.findById(req.params.id);

        if (!editorial) {
            return res.status(404).json({
                success: false,
                message: 'Editorial not found'
            });
        }

        res.status(200).json({
            success: true,
            data: editorial
        });
    } catch (error) {
        console.error('Get editorial by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch editorial',
            error: error.message
        });
    }
};

// Create new editorial
const createEditorial = async (req, res) => {
    try {
        const { title, description, link, isActive, order } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image is required'
            });
        }

        // Upload image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'editorials',
            transformation: [
                { width: 800, height: 600, crop: 'fill' },
                { quality: 'auto' }
            ]
        });

        const editorial = new Editorial({
            title,
            description,
            image: {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            },
            link,
            isActive: isActive !== undefined ? isActive : true,
            order: order || 0
        });

        await editorial.save();

        res.status(201).json({
            success: true,
            message: 'Editorial created successfully',
            data: editorial
        });
    } catch (error) {
        console.error('Create editorial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create editorial',
            error: error.message
        });
    }
};

// Update editorial
const updateEditorial = async (req, res) => {
    try {
        const { title, description, link, isActive, order } = req.body;
        const editorial = await Editorial.findById(req.params.id);

        if (!editorial) {
            return res.status(404).json({
                success: false,
                message: 'Editorial not found'
            });
        }

        // Update basic fields
        editorial.title = title || editorial.title;
        editorial.description = description || editorial.description;
        editorial.link = link || editorial.link;
        editorial.isActive = isActive !== undefined ? isActive : editorial.isActive;
        editorial.order = order !== undefined ? order : editorial.order;

        // Update image if new one provided
        if (req.file) {
            // Delete old image from Cloudinary
            if (editorial.image?.public_id) {
                await cloudinary.uploader.destroy(editorial.image.public_id);
            }

            // Upload new image
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'editorials',
                transformation: [
                    { width: 800, height: 600, crop: 'fill' },
                    { quality: 'auto' }
                ]
            });

            editorial.image = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            };
        }

        await editorial.save();

        res.status(200).json({
            success: true,
            message: 'Editorial updated successfully',
            data: editorial
        });
    } catch (error) {
        console.error('Update editorial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update editorial',
            error: error.message
        });
    }
};

// Delete editorial
const deleteEditorial = async (req, res) => {
    try {
        const editorial = await Editorial.findById(req.params.id);

        if (!editorial) {
            return res.status(404).json({
                success: false,
                message: 'Editorial not found'
            });
        }

        // Delete image from Cloudinary
        if (editorial.image?.public_id) {
            await cloudinary.uploader.destroy(editorial.image.public_id);
        }

        await Editorial.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Editorial deleted successfully'
        });
    } catch (error) {
        console.error('Delete editorial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete editorial',
            error: error.message
        });
    }
};

// Toggle editorial status
const toggleEditorialStatus = async (req, res) => {
    try {
        const editorial = await Editorial.findById(req.params.id);

        if (!editorial) {
            return res.status(404).json({
                success: false,
                message: 'Editorial not found'
            });
        }

        editorial.isActive = !editorial.isActive;
        await editorial.save();

        res.status(200).json({
            success: true,
            message: `Editorial ${editorial.isActive ? 'activated' : 'deactivated'} successfully`,
            data: editorial
        });
    } catch (error) {
        console.error('Toggle editorial status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle editorial status',
            error: error.message
        });
    }
};

module.exports = {
    getAllEditorials,
    getAllEditorialsAdmin,
    getEditorialById,
    createEditorial,
    updateEditorial,
    deleteEditorial,
    toggleEditorialStatus
};