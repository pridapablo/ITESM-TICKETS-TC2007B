import { Response } from "express";

// @ts-ignore
import ticket from "../models/ticket";
import ticketUser from "../models/ticketUser";
import mongoose from "mongoose";
import { RequestWithRole } from "../types/ReqWithUserRole";

export const getTickets = async (req: RequestWithRole, res: Response) => {
  try {
    let query: any = {
      interactionType: "create",
    };

    let sortKey = "interactionDate";

    // Verificar si el parámetro 'filter' está presente y es 'true'
    if (req.query.isDeleted === "true") {
      console.log("Filtering tickets");
      query["ticketID.isDeleted"] = { $ne: true }; // Tickets where isDeleted is not true or doesn't exist
    }

    // Check if the role is 'user'
    if (req.userRole?.includes("user")) {
      // Find the tickets created by this user
      const userTickets = await ticketUser
        .find({ userID: req.userID, interactionType: "create" })
        .select("ticketID");
      const ticketIds = userTickets.map((t) => t.ticketID);
      // Add to query
      query.ticketID = { $in: ticketIds };
    }

    // Buscar los TicketUser y poblar los datos del Ticket
    const ticketUsers = await ticketUser
      .find(query)
      .populate([
        {
          path: "ticketID",
        },
        {
          path: "userID",
          select: "username _id",
        },
      ])
      .sort({ [sortKey]: -1 });

    let validTicketUsers = ticketUsers.filter(
      (tu: any) => tu.ticketID !== null
    );

    // Si req.query.sortByPriority es true, ordenar por priority después de recuperar los datos
    if (req.query.sortByPriority === "true") {
      console.log("Sorting by priority");
      validTicketUsers.sort(
        (a: any, b: any) => b.ticketID.priority - a.ticketID.priority
      );
    }

    // Convert _id to id
    const modifiedTickets = validTicketUsers.map((ticketUser: any) => {
      const { _id, ...otherProps } = ticketUser.ticketID.toObject();
      const userData = ticketUser.userID ? ticketUser.userID.toObject() : {};

      return {
        id: _id.toString(),
        ...otherProps,
        createdOn: ticketUser.interactionDate,
        creator: userData,
      };
    });

    // Set the X-Total-Count header
    res.setHeader("X-Total-Count", modifiedTickets.length);

    return res.status(200).json(modifiedTickets);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTicket = async (req: RequestWithRole, res: Response) => {
  let t;
  try {
    // Check if the role is 'user'
    if (req.userRole?.includes("user")) {
      // Find the tickets created by this user
      const userTickets = await ticketUser
        .find({ userID: req.userID, interactionType: "create" })
        .select("ticketID");
      const ticketIds = userTickets.map((t) => t?.ticketID?.toString());

      // Check if the requested ticket ID was created by the user
      if (!ticketIds.includes(req.params.id.toString())) {
        return res
          .status(403)
          .json({ message: "Forbidden: You did not create this ticket." });
      }
    }

    t = await ticket.findById(req.params.id);

    if (!t) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Find the corresponding entry in TicketUser to get the creation date and the creator
    const tUser = await ticketUser.findOne({ ticketID: t._id }).populate({
      path: "userID",
      select: "username _id",
    });

    if (!tUser) {
      return res.status(404).json({ message: "TicketUser not found" });
    }

    const { _id, ...otherProps } = t.toObject();
    const userData = tUser.userID
      ? {
          _id: (tUser.userID as any)._id,
          username: (tUser.userID as any).username,
        }
      : {};

    // Build the response object
    const responseObj = {
      id: _id.toString(),
      ...otherProps,
      createdOn: tUser.interactionDate,
      creator: userData,
    };

    console.log("Ticket", responseObj);
    return res.status(200).json(responseObj);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTicket = async (req: RequestWithRole, res: Response) => {
  const { id } = req.params;
  const userID = req.userID;

  // Check if the role is 'user'
  if (req.userRole?.includes("user")) {
    // Find the tickets created by this user
    const userTickets = await ticketUser
      .find({ userID: userID, interactionType: "create" })
      .select("ticketID");
    const ticketIds = userTickets.map((t) => t?.ticketID?.toString()); // Convert to string for comparison

    // Check if the requested ticket ID was created by the user
    if (!ticketIds.includes(id.toString())) {
      // Convert to string for comparison
      return res
        .status(403)
        .json({ message: "Forbidden: You did not create this ticket." });
    }
  }

  if (!userID || !id) {
    return res.status(400).json({ message: "Missing data" });
  }

  let ticketUpdateResult;
  let ticketUserCreateRes;

  try {
    // Mark the ticket as deleted
    ticketUpdateResult = await ticket.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    // Register the interaction in ticketUser
    ticketUserCreateRes = await ticketUser.create({
      userID,
      ticketID: id,
      interactionDate: new Date(),
      interactionType: "delete",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }

  if (!ticketUpdateResult || !ticketUserCreateRes) {
    return res.status(500).json({
      message:
        "Error while marking the ticket as deleted or registering the interaction",
    });
  }

  // Create a new object with the desired structure
  const responseObj = {
    id: ticketUpdateResult._id.toString(), // Convert to string for consistency
    ...ticketUpdateResult.toObject(),
  };
  return res.status(200).json(responseObj);
};

export const createTicket = async (req: RequestWithRole, res: Response) => {
  const {
    classification,
    subclassification,
    priority,
    description,
    folio,
    topic,
    responsible,
  } = req.body;

  const userID = req.userID;

  if (!userID) {
    return res.status(400).json({ message: "Token no válido" });
  }

  console.log("classification", classification);
  console.log("subclassification", subclassification);
  console.log("priority", priority);
  console.log("description", description);
  console.log("userID", userID);
  console.log("folio", folio);
  console.log("topic", topic);
  console.log("responsible", responsible);

  if (
    !classification ||
    !subclassification ||
    !priority ||
    !description ||
    !mongoose.Types.ObjectId.isValid(userID)
  ) {
    res.status(400).json({ message: "Faltan datos" });
    return;
  }

  const t = new ticket({
    classification,
    subclassification,
    priority,
    description,
    topic,
    folio,
    responsible,
    status: 1,
  });

  let ticketResult;
  let userResult;

  try {
    ticketResult = await t.save();

    userResult = await ticketUser.create({
      userID,
      ticketID: ticketResult._id,
      interactionDate: new Date(),
      interactionType: "create",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }

  if (!ticketResult || !userResult) {
    return res
      .status(500)
      .json({ message: "Error al crear ticket o usuario del ticket" });
  }

  console.log("Ticket updated", ticketResult);
  console.log("Ticket user created", userResult);

  // Create a new object with the desired structure
  const responseObj = {
    id: ticketResult._id,
    ...ticketResult.toObject(),
  };
  return res.status(200).json(responseObj);
};

export const updateTicket = async (req: RequestWithRole, res: Response) => {
  const { id } = req.params;
  const userID = req.userID;
  console.log("body", req.body);
  const {
    classification,
    subclassification,
    priority,
    description,
    resolution,
  } = req.body;
  let status = req.body.status;

  // Check if the ticket is deleted
  const ticketData = await ticket.findById(id);
  if (ticketData && ticketData.isDeleted) {
    return res
      .status(400)
      .json({
        message:
          "Este ticket ha sido eliminado permanentemente y no puede ser modificado",
      });
  }

  if (resolution && resolution.closureTime) {
    status = 5;
  }

  if (!userID) {
    return res.status(400).json({ message: "Token no válido" });
  }

  if (!id || !mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  // Check if the role is 'user' and if the user created this ticket
  let userCreatedThisTicket = false;
  const userTickets = await ticketUser
    .find({ userID: userID, interactionType: "create" })
    .select("ticketID");
  const ticketIds = userTickets.map((t) => t?.ticketID?.toString());

  if (ticketIds.includes(id.toString())) {
    userCreatedThisTicket = true;
  }

  if (req.userRole?.includes("user") && !userCreatedThisTicket) {
    return res
      .status(403)
      .json({ message: "Forbidden: You did not create this ticket." });
  }

  let allowedUpdates = {};

  // Check roles to determine allowed fields to update
  if (req.userRole?.includes("user")) {
    // User can't mark ticket as resolved
    allowedUpdates = {
      classification,
      subclassification,
      priority,
      description,
    };
  } else if (
    req.userRole?.includes("admin") ||
    req.userRole?.includes("agent")
  ) {
    if (userCreatedThisTicket) {
      // If admin or agent created this ticket, they can update everything except 'isDeleted'
      allowedUpdates = {
        classification,
        subclassification,
        priority,
        description,
        resolution,
        status,
      };
    } else {
      // If admin or agent did not create this ticket, they can only update 'resolution'
      allowedUpdates = { resolution, status };
    }
  } else {
    return res.status(403).json({
      message: "Forbidden: You are not authorized to update this ticket.",
    });
  }

  let ticketUpdateResult;
  let ticketUserCreateRes;

  try {
    ticketUpdateResult = await ticket.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
    });

    ticketUserCreateRes = await ticketUser.create({
      userID,
      ticketID: id,
      interactionDate: new Date(),
      interactionType: "update",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }

  if (!ticketUpdateResult || !ticketUserCreateRes) {
    return res
      .status(500)
      .json({ message: "Error al actualizar ticket o usuario del ticket" });
  }

  // Create a new object with the desired structure
  const responseObj = {
    id: ticketUpdateResult._id,
    ...ticketUpdateResult.toObject(),
  };
  return res.status(200).json(responseObj);
};
