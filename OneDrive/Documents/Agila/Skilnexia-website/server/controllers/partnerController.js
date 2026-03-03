const Partner = require('../models/Partner');

// @desc    Get all partners
// @route   GET /api/partners
// @access  Public
const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find({});
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a partner
// @route   POST /api/partners
// @access  Private/Admin
const createPartner = async (req, res) => {
    try {
        const { name, logo, website, description, category } = req.body;
        const partner = new Partner({ name, logo, website, description, category });
        const createdPartner = await partner.save();
        res.status(201).json(createdPartner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a partner
// @route   PUT /api/partners/:id
// @access  Private/Admin
const updatePartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (partner) {
            partner.name = req.body.name || partner.name;
            partner.logo = req.body.logo || partner.logo;
            partner.website = req.body.website || partner.website;
            partner.description = req.body.description || partner.description;
            partner.category = req.body.category || partner.category;
            const updatedPartner = await partner.save();
            res.json(updatedPartner);
        } else {
            res.status(404).json({ message: 'Partner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a partner
// @route   DELETE /api/partners/:id
// @access  Private/Admin
const deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (partner) {
            await Partner.findByIdAndDelete(req.params.id);
            res.json({ message: 'Partner removed' });
        } else {
            res.status(404).json({ message: 'Partner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPartners,
    createPartner,
    updatePartner,
    deletePartner,
};
