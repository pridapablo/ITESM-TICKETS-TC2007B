import ticket from '../models/ticket';

//7 days
const calculateAvgResolutionTime = async () => {
    try {
        // Calculate the date 7 days ago from the current date
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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
                $match: {
                    "ticketUser.interactionType": "create",  // only consider 'create' interactions
                    "resolution.closureTime": { $ne: null }, // Only consider tickets with non-null closureTime
                    $expr: { $gt: [{ $subtract: ["$resolution.closureTime", "$ticketUser.interactionDate"] }, 0] }, // Only consider resolution times > 0
                    "ticketUser.interactionDate": { $gte: sevenDaysAgo } // Filter for the last 7 days
                }
            },
            {
                $group: {
                    _id: null,  // group all tickets together
                    avgResolutionTime: {
                        $avg: {
                            $divide: [
                                { $subtract: ["$resolution.closureTime", "$ticketUser.interactionDate"] },
                                3600000 // Convert milliseconds to hours
                            ]
                        }
                    }
                }
            }
        ];

        const result = await ticket.aggregate(aggregationPipeline).exec();
        const avgResolutionTime = result[0]?.avgResolutionTime || null;

        if (avgResolutionTime !== null) {
            return avgResolutionTime;
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
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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
                $match: {
                    "ticketUser.interactionDate": { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        userId: "$ticketUser.userID",
                        username: "$interactingUsers.username",
                        priority: "$priority",
                        ticketId: "$_id"
                    },
                    firstInteractionDate: { $min: "$ticketUser.interactionDate" },
                }
            },
            {
                $group: {
                    _id: {
                        userId: "$_id.userId",
                        username: "$_id.username",
                        priority: "$_id.priority",
                    },
                    ticketCount: { $sum: 1 },
                }
            },
            { $sort: { "_id.userId": 1, "_id.priority": 1 } },  // Sort by userId and priority
        ];

        const result = await ticket.aggregate(aggregationPipeline as any).exec();

        const usersData: Record<string, Record<string, any>> = {};

        const priorityLabel: Record<number, string> = {
            1: "Muy baja",
            2: "Baja",
            3: "Media",
            4: "Alta",
            5: "Muy alta"
        };

        result.forEach(user => {
            const { userId, username, priority } = user._id;
            const ticketCount = user.ticketCount;

            if (!usersData[userId]) {
                usersData[userId] = {
                    username,
                    "Muy baja": 0,
                    "Baja": 0,
                    "Media": 0,
                    "Alta": 0,
                    "Muy alta": 0,
                    muybajaColor: "hsl(354, 70%, 50%)",
                    bajaColor: "hsl(24, 70%, 50%)",
                    mediaColor: "hsl(0, 70%, 50%)",
                    altaColor: "hsl(127, 70%, 50%)",
                    muyaltaColor: "hsl(164, 70%, 50%)"
                };
            }

            const priorityLabelName = priorityLabel[priority];

            if (priorityLabelName) {
                usersData[userId][priorityLabelName] = ticketCount;
            }
        });

        const usersWithPriorityBreakdown = Object.values(usersData);

        return usersWithPriorityBreakdown;
    } catch (error) {
        console.error(error);
        throw new Error('Error calculating ticket counts');
    }
};


//7 days
const calculateMostReportedCategories = async () => {
        try {
        // Calculate the date 7 days ago from the current date
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Sample MongoDB aggregation pipeline (customize as per your data model)
        const aggregationPipeline = [
            {
                $lookup: {
                    from: "ticketusers",
                    localField: "_id",
                    foreignField: "ticketID",
                    as: "ticketUser"
                }
            },
            {
                $unwind: "$ticketUser"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "ticketUser.userID",
                    foreignField: "_id",
                    as: "interactingUsers"
                }
            },
            {
                $unwind: "$interactingUsers"
            },
            {
                $group: {
                    _id: "$_id",
                    firstInteractionDate: { $min: "$ticketUser.interactionDate" }
                }
            },
            {
                $match: {
                    firstInteractionDate: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { classification: "$classification", subclassification: "$subclassification" },
                    subCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.classification",
                    subcategories: {
                        $push: {
                            subclassification: "$_id.subclassification",
                            count: "$subCount"
                        }
                    }
                }
            }
        ];

        // Execute the aggregation query
        const result = await ticket.aggregate(aggregationPipeline).exec();

        // Transform the data
        const transformedData = result.map((category) => ({
            name: category._id,
            color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
            children: category.subcategories.map((subcategory:any) => ({
                name: subcategory.subclassification,
                color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
                loc: subcategory.count
            }))
        }));

        // Create the final data structure
        const dataWrapper = {
            name: "admin",
            color: "hsl(275, 70%, 50%)",
            children: transformedData,
        };

        return dataWrapper;
    } catch (error) {
        console.error(error);
        throw new Error('Error calculating most reported categories');
    }
};





//7 days
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

        const formattedResult = result[0] || { allActiveTickets: 0, newTicketsThisWeek: 0, completedThisWeek: 0 };

        // Create an array of objects for each value
        const formattedData = [
            {
                id: "Activos",
                label: "Todos los Tickets Activos",
                value: formattedResult.allActiveTickets,
                color: "#FF5733" // You can set a specific color here
            },
            {
                id: "Nuevos",
                label: "Nuevos esta semana",
                value: formattedResult.newTicketsThisWeek,
                color: "#33FF57" // Another color
            },
            {
                id: "Completados",
                label: "Completados esta semana",
                value: formattedResult.completedThisWeek,
                color: "#5733FF" // Another color
            }
        ];

        return formattedData;

    } catch (error) {
        console.error(error);
        throw new Error('Error calculating ticket stats');
    }
};

//7 days
const calculateInventoryByClassification = async () => {
    try {
        // Calculate the date 7 days ago from the current date
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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
                $match: {
                    "ticketUser.interactionType": "create",  // only consider 'create' interactions
                    "ticketUser.interactionDate": { $gte: sevenDaysAgo } // Filter for the last 7 days
                }
            },
            {
                $group: {
                    _id: {
                        userId: "$ticketUser.userID",
                        username: "$interactingUsers.username",
                        subclassification: "$subclassification"
                    },
                    ticketCount: { $sum: 1 },
                }
            },
            { $sort: { "_id.userId": 1 } },  // Sort by userId
        ];

        const result = await ticket.aggregate(aggregationPipeline as any).exec();

        const usersData: Record<string, any> = {};

        result.forEach(user => {
            const { userId, username, subclassification } = user._id;
            const ticketCount = user.ticketCount;

            if (!usersData[userId]) {
                usersData[userId] = {
                    name: username,
                    color: "hsl(50, 70%, 50%)",
                    children: [],
                };
            }

            // Create a child object for the subclassification
            const child = {
                name: subclassification,
                color: "hsl(20, 70%, 50%)", // Set the desired color here
                loc: ticketCount,
            };

            // Add the child object to the user's "children" array
            usersData[userId].children.push(child);
        });

        // Convert the object to an array and wrap it in a "children" array
        const usersWithHierarchy = {
            name: "Aulas",
            color: "hsl(50, 70%, 50%)",
            children: Object.values(usersData),
        };

        return usersWithHierarchy;
    } catch (error) {
        console.error(error);
        throw new Error('Error calculating ticket counts');
    }
};


//7 days
const fetchTicketsWithResolutionTime = async () => {
    try {
        // Calculate the date 7 days ago from the current date
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const aggregationPipeline = [
            {
                $lookup: {
                    from: "ticketusers",
                    localField: "_id",
                    foreignField: "ticketID",
                    as: "ticketUser"
                }
            },
            {
                $unwind: "$ticketUser"
            },
            {
                $match: {
                    // Filter tickets created in the last 7 days
                    "ticketUser.interactionDate": { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        priority: "$priority",
                        createdTime: {
                            $min: {
                                $dateToString: {
                                    date: "$ticketUser.interactionDate",
                                    format: "%Y-%m-%d"
                                }
                            }
                        }
                    },
                    resolutionTime: {
                        $first: {
                            $cond: {
                                if: { $and: [{ $ne: ["$resolution.closureTime", null] }, { $gt: ["$resolution.closureTime", "$ticketUser.interactionDate"] }] },
                                then: {
                                    $divide: [
                                        { $subtract: ["$resolution.closureTime", "$ticketUser.interactionDate"] },
                                        3600000
                                    ]
                                },
                                else: null
                            }
                        }
                    }
                }
            }
        ];

        const results = await ticket.aggregate(aggregationPipeline).exec();


        // Define the priority mapping
        const priorityMapping: Record<number, string> = {
            1: "Muy baja",
            2: "Baja",
            3: "Media",
            4: "Alta",
            5: "Muy alta"
        };

        // Initialize an object to group the results by priority
        const groupedResults: Record<number, { id: string, data: any[] }> = {};

        results.forEach((result) => {
            const priority = result._id.priority;
            const createdTime = result._id.createdTime;
            const resolutionTime = result.resolutionTime;

            // Only add to the group if resolutionTime > 0
            if (resolutionTime > 0) {
                // Create a new group for the priority if it doesn't exist
                if (!groupedResults[priority]) {
                    groupedResults[priority] = {
                        id: priorityMapping[priority],
                        data: []
                    };
                }

                // Add the data for the createdTime and resolutionTime to the group
                groupedResults[priority].data.push({ x: createdTime, y: resolutionTime });
            }
        });

        // Convert the groupedResults object to an array
        const groupedResultsArray = Object.values(groupedResults);

        return groupedResultsArray;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching tickets grouped by priority');
    }
};



//@ts-ignore
export const getReport = async (_req, res) => {
    try {

        const ticketCounts = await calculateTicketCounts();
        const avgResolutionTime = await calculateAvgResolutionTime();
        const allResoultionTime = await fetchTicketsWithResolutionTime();
        const mostReportedCategories = await calculateMostReportedCategories();
        const ticketStats = await calculateTicketStats();
        const inventoryByClassification = await calculateInventoryByClassification();
        
        res.json({ ticketCounts, avgResolutionTime, allResoultionTime, mostReportedCategories, ticketStats, inventoryByClassification});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

