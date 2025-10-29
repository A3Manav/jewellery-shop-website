const Rate = require('../models/Rate');

exports.updateRate = async (req, res) => {
    const { goldRate, silverRate } = req.body;
    try {
        let rate = await Rate.findOne();
        if (!rate) {
            rate = new Rate({ goldRate, silverRate });
        } else {
            rate.goldRate = goldRate;
            rate.silverRate = silverRate;
        }
        await rate.save();
        res.json(rate);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getRate = async (req, res) => {
    try {
        const rate = await Rate.findOne();
        res.json(rate);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};