import ticket from '../models/ticket';

//@ts-ignore
export const getReport = async (_req, res) => {
    try {
        const aggregationPipeline = [
            // This stage joins the TicketUser collection on the ticketID field
            {
                $lookup: {
                    from: "ticketusers",
                    localField: "_id",
                    foreignField: "ticketID",
                    as: "ticketUser"
                }
            },
            // This stage unwinds the ticketUser array into individual documents
            {
                $unwind: "$ticketUser"
            },
            // Other stages to calculate the necessary report data...
        ];

        const reportData = await ticket.aggregate(aggregationPipeline).exec();

        // Process reportData to calculate:
        // 1. User with most and least tickets
        // 2. Classroom with most and least incidents
        // 3. Average time to resolve a ticket
        // 4. Most reported categories
        // 5. Number of active, new, and completed tickets
        // 6. Inventory by classroom

        // Send the processed report data back to the frontend
        res.json({ reportData });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
