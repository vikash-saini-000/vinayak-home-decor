import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    const fields = [
      'heroTitle', 'heroSubtitle', 'heroTagline', 'heroDescription',
      'aboutTitle', 'aboutDescription', 'whatsappNumber',
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    }

    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
