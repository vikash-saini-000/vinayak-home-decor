import Inquiry from '../models/Inquiry.js';

export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const inquiry = await Inquiry.create({ name, email, phone, message });
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const inquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Inquiry.countDocuments();
    const unread = await Inquiry.countDocuments({ read: false });

    res.json({
      inquiries,
      total,
      unread,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
