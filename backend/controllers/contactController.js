import Contact from '../models/Contact.js';

export const getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({});
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create(req.body);
    } else {
      Object.assign(contact, req.body);
      await contact.save();
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
