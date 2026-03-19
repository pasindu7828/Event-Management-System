import Event from "../models/Event.js";

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => String(tag).trim().toLowerCase())
      .filter(Boolean);
  }

  return String(tags)
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
};

const normalizeTickets = (tickets) => {
  if (!Array.isArray(tickets)) return [];

  return tickets
    .map((ticket) => ({
      name: String(ticket?.name || "").trim(),
      price:
        ticket?.price === "" || ticket?.price == null
          ? 0
          : Number(ticket.price),
      qty:
        ticket?.qty === "" || ticket?.qty == null
          ? null
          : Number(ticket.qty),
    }))
    .filter((ticket) => ticket.name);
};

// CREATE EVENT - organizer/admin
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      isOnline,
      venue,
      address,
      meetLink,
      capacity,
      deadline,
      visibility,
      tickets,
      tags,
      coverImageUrl,
    } = req.body;

    if (!title || !category || !description || !startDate || !startTime) {
      return res.status(400).json({
        success: false,
        message:
          "Title, category, description, start date, and start time are required",
      });
    }

    if (isOnline && !meetLink) {
      return res.status(400).json({
        success: false,
        message: "Meeting link is required for online events",
      });
    }

    if (!isOnline && !venue) {
      return res.status(400).json({
        success: false,
        message: "Venue is required for physical events",
      });
    }

    const parsedTickets = normalizeTickets(tickets);
    const event = await Event.create({
      title,
      category,
      description,
      startDate,
      endDate: endDate || null,
      startTime,
      endTime: endTime || "",
      isOnline: Boolean(isOnline),
      venue: venue || "",
      address: address || "",
      meetLink: meetLink || "",
      capacity: capacity === "" || capacity == null ? null : Number(capacity),
      deadline: deadline || null,
      visibility: visibility || "public",
      tickets: parsedTickets,
      tags: normalizeTags(tags),
      coverImageUrl: coverImageUrl || "",
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating event",
      error: error.message,
    });
  }
};

// GET CURRENT USER CREATED EVENTS - organizer/admin
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get My Events Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching events",
      error: error.message,
    });
  }
};

// GET PUBLIC EVENTS - all users
export const getPublicEvents = async (req, res) => {
  try {
    const events = await Event.find({ visibility: "public" })
      .populate("createdBy", "firstName lastName role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get Public Events Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching public events",
      error: error.message,
    });
  }
};
