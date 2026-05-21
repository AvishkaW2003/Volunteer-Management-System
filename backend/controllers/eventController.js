import Event from "../models/eventModel.js";

export const createEvent = async (
  req,
  res
) => {
  try {

    const event =
      await Event.create({
        ...req.body,

        userId: req.user.id,
      });

    res.status(201).json({
      message:
        "Event created successfully",

      event,
    });

  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

export const getEvents =
async (
  req,
  res
) => {
  try {

    const events =
      await Event.findAll();

    res.json(events);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};