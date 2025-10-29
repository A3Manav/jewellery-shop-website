const Carousel = require('../models/Carousel');
const cloudinary = require('../utils/cloudinary');

exports.createCarousel = async (req, res) => {
    try {
        const { title, description, link } = req.body;
        let image = {};

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            image = {
                url: result.secure_url,
                public_id: result.public_id
            };
        }

        const carousel = new Carousel({
            title,
            description,
            link,
            image
        });

        await carousel.save();
        res.status(201).json(carousel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateCarousel = async (req, res) => {
    try {
        const { title, description, link, isActive } = req.body;
        const updateData = { title, description, link, isActive, updatedAt: Date.now() };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updateData.image = {
                url: result.secure_url,
                public_id: result.public_id
            };
        }

        const carousel = await Carousel.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!carousel) {
            return res.status(404).json({ message: 'Carousel not found' });
        }
        res.json(carousel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCarousel = async (req, res) => {
    try {
        const carousel = await Carousel.findByIdAndDelete(req.params.id);
        if (!carousel) {
            return res.status(404).json({ message: 'Carousel not found' });
        }
        if (carousel.image.public_id) {
            await cloudinary.uploader.destroy(carousel.image.public_id);
        }
        res.json({ message: 'Carousel deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getActiveCarousels = async (req, res) => {
    try {
        const carousels = await Carousel.find({ isActive: true })
            .sort({ order: 1 })
            .limit(5);
        res.json(carousels);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllCarousels = async (req, res) => {
    try {
        const carousels = await Carousel.find().sort({ order: 1 });
        res.json(carousels);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateCarouselOrder = async (req, res) => {
    try {
        const { order } = req.body;
        const carousel = await Carousel.findByIdAndUpdate(
            req.params.id,
            { order },
            { new: true }
        );
        if (!carousel) {
            return res.status(404).json({ message: 'Carousel not found' });
        }
        res.json(carousel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};