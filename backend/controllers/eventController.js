import Event from "../models/eventModel.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ message: "Events fetched successfully", events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, category, description, date, time, location, maxVolunteers, skills } = req.body;
    const event = await Event.create({
      title, category, description, date, time,
      location, maxVolunteers, skills,
      createdBy: req.user.id,
      status: "Upcoming",
    });
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const { title, category, description, date, time, location, maxVolunteers, skills, status } = req.body;
    await event.update({ title, category, description, date, time, location, maxVolunteers, skills, status });
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await event.destroy();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
