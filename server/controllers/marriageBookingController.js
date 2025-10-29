const MarriageBooking = require('../models/MarriageBooking');

exports.createBooking = async (req, res) => {
    const {
        productType,
        eventDate,
        message,
        name,
        email,
        phone,
        address,
        budgetRange,
        numberOfItems,
        customDesignRequest,
        preferredContactMethod
    } = req.body;

    try {
        // Validation
        if (!productType || !eventDate || !name || !email || !phone) {
            return res.status(400).json({
                msg: 'Please provide all required fields: productType, eventDate, name, email, and phone'
            });
        }

        // Validate event date is in the future
        const selectedDate = new Date(eventDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({
                msg: 'Event date must be in the future'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                msg: 'Please provide a valid email address'
            });
        }

        // Validate phone number (basic check for 10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = phone.replace(/\D/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            return res.status(400).json({
                msg: 'Please provide a valid 10-digit phone number'
            });
        }

        const booking = new MarriageBooking({
            user: req.user ? req.user.id : null,
            productType,
            eventDate,
            message: message || '',
            name,
            email,
            phone: cleanPhone,
            address: address || '',
            budgetRange: budgetRange || '',
            numberOfItems: numberOfItems || '',
            customDesignRequest: customDesignRequest || false,
            preferredContactMethod: preferredContactMethod || 'phone',
            status: 'pending'
        });

        await booking.save();

        res.status(201).json({
            success: true,
            booking,
            msg: 'Wedding booking request submitted successfully! We will contact you within 24 hours.'
        });
    } catch (err) {
        console.error('Error creating marriage booking:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error. Please try again later.'
        });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await MarriageBooking.find({ user: req.user.id }).populate('user');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await MarriageBooking.find().populate('user');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    // Basic validation for status
    if (!status || !['pending', 'confirmed', 'completed'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided' });
    }

    try {
        const updatedBooking = await MarriageBooking.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate('user');

        if (!updatedBooking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        res.json(updatedBooking);
    } catch (err) {
        console.error('Error updating booking status:', err);
        res.status(500).json({ msg: 'Server error while updating booking status' });
    }
};