const Contact = require('../models/Contact');

// Submit a new contact form
exports.submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        // Create new contact
        const contact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            subject,
            message: message.trim()
        });

        await contact.save();

        res.status(201).json({
            message: 'Contact form submitted successfully',
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                status: contact.status,
                createdAt: contact.createdAt
            }
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({
            message: 'Server error while submitting contact form'
        });
    }
};

// Get all contacts (admin only)
exports.getAllContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status; // 'unread', 'read', 'responded'
        const subject = req.query.subject;

        const query = {};
        if (status) query.status = status;
        if (subject) query.subject = subject;

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');

        const total = await Contact.countDocuments(query);

        res.json({
            contacts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalContacts: total
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            message: 'Server error while fetching contacts'
        });
    }
};

// Get single contact by ID (admin only)
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: 'Contact not found'
            });
        }

        res.json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({
            message: 'Server error while fetching contact'
        });
    }
};

// Update contact status (admin only)
exports.updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['unread', 'read', 'responded'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status. Must be unread, read, or responded'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                message: 'Contact not found'
            });
        }

        res.json({
            message: 'Contact status updated successfully',
            contact
        });
    } catch (error) {
        console.error('Error updating contact status:', error);
        res.status(500).json({
            message: 'Server error while updating contact status'
        });
    }
};

// Delete contact (admin only)
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: 'Contact not found'
            });
        }

        res.json({
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            message: 'Server error while deleting contact'
        });
    }
};

// Get contact statistics (admin only)
exports.getContactStats = async (req, res) => {
    try {
        const totalContacts = await Contact.countDocuments();
        const unreadContacts = await Contact.countDocuments({ status: 'unread' });
        const readContacts = await Contact.countDocuments({ status: 'read' });
        const respondedContacts = await Contact.countDocuments({ status: 'responded' });

        // Get contacts by subject
        const subjectStats = await Contact.aggregate([
            { $group: { _id: '$subject', count: { $sum: 1 } } }
        ]);

        // Get recent contacts (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentContacts = await Contact.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            total: totalContacts,
            unread: unreadContacts,
            read: readContacts,
            responded: respondedContacts,
            recent: recentContacts,
            bySubject: subjectStats
        });
    } catch (error) {
        console.error('Error fetching contact stats:', error);
        res.status(500).json({
            message: 'Server error while fetching contact statistics'
        });
    }
};