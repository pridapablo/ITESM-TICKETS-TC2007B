import ticket from '../models/ticket';

const formatDuration = (milliseconds: number): { days: number, hours: number, minutes: number, seconds: number } => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
};

const calculateAvgResolutionTime = async () => {
    try {
        const aggregationPipeline = [
            {
                $lookup: {
                    from: "ticketusers",
                    localField: "_id",
                    foreignField: "ticketID",
                    as: "ticketUser"
                }
            },
            { $unwind: "$ticketUser" },
            {
                $match: { "ticketUser.interactionType": "create" }  // only consider 'create' interactions
            },
            {
                $group: {
                    _id: null,  // group all tickets together
                    avgResolutionTime: {
                        $avg: {
                            $subtract: [
                                "$resolution.closureTime",
                                "$ticketUser.interactionDate"
                            ]
                        }
                    }
                }
            }
        ];

        const result = await ticket.aggregate(aggregationPipeline).exec();
        const avgResolutionTime = result[0]?.avgResolutionTime || null;

        if (avgResolutionTime !== null) {
            return formatDuration(avgResolutionTime);
        } else {
            return null;
        }


    } catch (error) {
        console.error(error);
        throw new Error('Error calculating average resolution time');
    }
};

const calculateTicketCounts = async () => {
    try {
        const aggregationPipeline = [
            {
                $lookup: {
                    from: "ticketusers",
                    localField: "_id",
                    foreignField: "ticketID",
                    as: "ticketUser"
                }
            },
            { $unwind: "$ticketUser" },
            {
                $group: {
                    _id: "$ticketUser.userID",
                    ticketCount: { $sum: 1 },
                }
            },
            { $sort: { ticketCount: 1 } },  // Sort in ascending order
            {
                $group: {
                    _id: null,
                    maxTicketUser: { $last: "$_id" },
                    maxTicketCount: { $last: "$ticketCount" },
                    minTicketUser: { $first: "$_id" },
                    minTicketCount: { $first: "$ticketCount" },
                }
            },
        ];

        const result = await ticket.aggregate(aggregationPipeline as any).exec();
        return result[0] || null;

    } catch (error) {
        console.error(error);
        throw new Error('Error calculating ticket counts');
    }
};

//@ts-ignore
export const getReport = async (_req, res) => {
    try {
        
        const ticketCounts = await calculateTicketCounts();
        const avgResolutionTime = await calculateAvgResolutionTime();
        res.json({ ticketCounts, avgResolutionTime});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};