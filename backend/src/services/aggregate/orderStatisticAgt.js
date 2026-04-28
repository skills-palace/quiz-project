const orderStatisticAgt = (query) => {
    return query.aggregate([
        {
            $facet: {
                metadata: [{ $count: "total" }],
                cancelled: [
                    { $match: { status: "cancelled" } },
                    { $count: "cancelled" },
                ],
                pending: [
                    { $match: { status: "pending" } },
                    { $count: "pending" },
                ],
                completed: [
                    { $match: { status: "completed" } },
                    { $count: "completed" },
                ],
            },
        },
        {
            $project: {
                cancelled: { $arrayElemAt: ["$cancelled.cancelled", 0] },
                pending: { $arrayElemAt: ["$pending.pending", 0] },
                completed: { $arrayElemAt: ["$completed.completed", 0] },
                total: { $arrayElemAt: ["$metadata.total", 0] },
            },
        },
    ]);
    // aggrigate end
};

module.exports = orderStatisticAgt;
