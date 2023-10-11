import ticket from '../models/ticket';

const formatDuration = (milliseconds: number): { days: number, hours: number, minutes: number, seconds: number } => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
};

const calculateAllResolutionTimes = async () => {
    try {
        const aggregationPipeline = [
            {
                $lookup: {
                    from: "ticketusers",
                    localField: "_id",
                    foreignField: "ticketID",
                    as: "ticketUsers"
                }
            },
            { $unwind: "$ticketUsers" },
            {
                $lookup: {
                    from: "users",
                    localField: "ticketUsers.userID",
                    foreignField: "_id",
                    as: "interactingUsers"
                }
            },
            { $unwind: "$interactingUsers" },
            {
                $group: {
                    _id: { ticketId: "$_id", userId: "$interactingUsers._id" },
                    username: { $first: "$interactingUsers.username" },
                    individualCount: { $sum: 1 },
                    classification: { $first: "$classification" },
                    subclassification: { $first: "$subclassification" },
                    priority: { $first: "$priority" },
                    resolutionTime: { 
                        $first: {
                            $subtract: [
                                "$resolution.closureTime",
                                "$ticketUsers.interactionDate"
                            ]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.ticketId",
                    classification: { $first: "$classification" },
                    subclassification: { $first: "$subclassification" },
                    priority: { $first: "$priority" },
                    interactingUsers: {
                        $push: {
                            id: "$_id.userId",
                            username: "$username",
                            timesInteracted: "$individualCount"
                        }
                    },
                    interactionCount: { $sum: "$individualCount" },
                    resolutionTime: { $first: "$resolutionTime" }
                }
            },
            {
                $project: {
                    ticketId: "$_id",
                    classification: 1,
                    subclassification: 1,
                    priority: 1,
                    interactingUsers: 1,
                    interactionCount: 1,
                    resolutionTime: 1
                }
            }
        ];

        const result = await ticket.aggregate(aggregationPipeline).exec();

        const resolutionTimesWithTicketsAndUsers = result.map(item => ({
            ticketId: item.ticketId,
            classification: item.classification,
            subclassification: item.subclassification,
            priority: item.priority,
            isResolved: item.isResolved,
            interactingUsers: item.interactingUsers,
            interactionCount: item.interactionCount,
            resolutionTime: formatDuration(item.resolutionTime)
        }));

        return resolutionTimesWithTicketsAndUsers;


    } catch (error) {
        console.error(error);
        throw new Error('Error calculating resolution times');
    }
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
        $lookup: {
            from: "users",
            localField: "ticketUser.userID",
            foreignField: "_id",
            as: "interactingUsers"
        }
    },
    { $unwind: "$interactingUsers" },
    {
        $group: {
            _id: "$ticketUser.userID",
            username: { $first: "$interactingUsers.username" },  // Added username here
            ticketCount: { $sum: 1 },
        }
    },
    { $sort: { ticketCount: 1 } },  // Sort in ascending order
    {
        $group: {
            _id: null,
            maxTicketUser: { $last: "$_id" },
            maxTicketUsername: { $last: "$username" },  // Added username here
            maxTicketCount: { $last: "$ticketCount" },
            minTicketUser: { $first: "$_id" },
            minTicketUsername: { $first: "$username" },  // Added username here
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

const calculateMostReportedCategories = async () => {
    try {
       const aggregationPipeline = [
    {
        $group: {
            _id: { classification: "$classification", subclassification: "$subclassification" },
            subCount: { $sum: 1 },
        }
    },
    {
        $group: {
            _id: "$_id.classification",
            totalCount: { $sum: "$subCount" },
            subcategories: {
                $push: {
                    subclassification: "$_id.subclassification",
                    count: "$subCount"
                }
            }
        }
    },
    { $sort: { totalCount: -1 } }  // Sort categories in descending order of count
];

        const result = await ticket.aggregate(aggregationPipeline as any).exec();
        return result;

    } catch (error) {
        console.error(error);
        throw new Error('Error calculating most reported categories');
    }
};

const calculateTicketStats = async () => {
    try {
        // Current date and start of the week (7 days ago)
        const now = new Date();
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

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
                $project: {
                    closureTimeExists: { $gt: [{ $ifNull: ["$resolution.closureTime", null] }, null] },
                    createdThisWeek: {
                        $and: [
                            { $eq: ["$ticketUser.interactionType", "create"] },
                            { $gte: ["$ticketUser.interactionDate", startOfWeek] },
                            { $lte: ["$ticketUser.interactionDate", now] }
                        ]
                    },
                    resolvedThisWeek: {
                        $and: [
                            { $gte: ["$resolution.closureTime", startOfWeek] },
                            { $lte: ["$resolution.closureTime", now] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    allActiveTickets: {
                        $sum: {
                            $cond: [
                                { $eq: ["$closureTimeExists", false] },
                                1,
                                0
                            ]
                        }
                    },
                    newTicketsThisWeek: {
                        $sum: { $cond: ["$createdThisWeek", 1, 0] }
                    },
                    completedThisWeek: {
                        $sum: { $cond: ["$resolvedThisWeek", 1, 0] }
                    }
                }
            }
        ];

        const result = await ticket.aggregate(aggregationPipeline).exec();
        return result[0] || { allActiveTickets: 0, newTicketsThisWeek: 0, completedThisWeek: 0 };

    } catch (error) {
        console.error(error);
        throw new Error('Error calculating ticket stats');
    }
};



//@ts-ignore
const calculateInventoryByClassification = async () => {
    return await ticket.aggregate([
        {
            $match: {
                classification: { $in: ["Mobiliario", "Materiales"] }
            }
        },
        {
            $group: {
                _id: "$subclassification",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                subclassification: "$_id",
                count: 1
            }
        }
    ]);
}

//@ts-ignore
export const getReport = async (_req, res) => {
    try {

        const ticketCounts = await calculateTicketCounts();
        const avgResolutionTime = await calculateAvgResolutionTime();
        const mostReportedCategories = await calculateMostReportedCategories();
        const ticketStats = await calculateTicketStats();
        const inventoryByClassification = await calculateInventoryByClassification();
        const allTicketQueryData = await calculateAllResolutionTimes()
        
        res.json({ ticketCounts, avgResolutionTime, mostReportedCategories, ticketStats, inventoryByClassification, allTicketQueryData});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

