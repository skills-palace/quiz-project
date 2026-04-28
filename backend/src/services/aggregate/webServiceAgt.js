const webServiceAgt = (query, queryString) => {
    return query.aggregate([
        { $match: { status: { $ne: "inactive" } } },
        {
            $facet: {
                telegram_online_members: [
                    {
                        $match: {
                            serviceType: "telegram-online-members",
                        },
                    },
                ],
                telegram_group_hype: [
                    {
                        $match: {
                            serviceType: "telegram-group-hype",
                        },
                    },
                ],
                chat_moderators: [
                    {
                        $match: {
                            serviceType: "chat-moderators",
                        },
                    },
                ],
                coingecko_fast_track: [
                    {
                        $match: {
                            serviceType: "coingecko-fast-track",
                        },
                    },
                ],
                coingecko_trending: [
                    {
                        $match: {
                            serviceType: "coingecko-trending",
                        },
                    },
                ],
                telegram_ama_member_standard: [
                    {
                        $match: {
                            serviceType: "telegram-ama-members",
                            servicePackage: "standard-members",
                        },
                    },
                ],
                telegram_ama_member_premium: [
                    {
                        $match: {
                            serviceType: "telegram-ama-members",
                            servicePackage: "premium-online-members",
                        },
                    },
                ],
                telegram_ama_member_smart: [
                    {
                        $match: {
                            serviceType: "telegram-ama-members",
                            servicePackage: "smart-members",
                        },
                    },
                ],
                pinksale_trending_24_hours: [
                    {
                        $match: {
                            serviceType: "pinksale-trending",
                            servicePackage: "trending-for-24-hours",
                        },
                    },
                ],
                pinksale_trending_48_hours: [
                    {
                        $match: {
                            serviceType: "pinksale-trending",
                            servicePackage: "trending-for-48-hours",
                        },
                    },
                ],
                pinksale_trending_72_hours: [
                    {
                        $match: {
                            serviceType: "pinksale-trending",
                            servicePackage: "trending-for-72-hours",
                        },
                    },
                ],
                dextools_24_hours: [
                    {
                        $match: {
                            serviceType: "dextools",
                            servicePackage: "trending-for-24-hours",
                        },
                    },
                ],
                dextools_48_hours: [
                    {
                        $match: {
                            serviceType: "dextools",
                            servicePackage: "trending-for-48-hours",
                        },
                    },
                ],
                dextools_72_hours: [
                    {
                        $match: {
                            serviceType: "dextools",
                            servicePackage: "trending-for-72-hours",
                        },
                    },
                ],
            },
        },
    ]);
    // aggrigate end
};

module.exports = webServiceAgt;
