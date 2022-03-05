const PrintsApi = require("../../api/yahallo.api/prints");
const CollectionHelper = require("./utils/collection.helper");
const onCollect = require("./collectors/on.collect");
const onEnd = require("./collectors/on.end");
const CollectionOptionsHandler = require("./options/collection.options.handler");
const {StrapiPaginator} = require("../../utils/strapi.paginator");

module.exports = async (parentInteraction, client, strapiDiscordUser) => {
    let partialQuery = {
        filters: {
            discordUser: {
                discordUserId: strapiDiscordUser.attributes.discordUserId
            },
        },
        populate: {
            card: {
                populate: {
                    character: "*",
                }
            }
        }
    }

    let optionsHandler = new CollectionOptionsHandler(parentInteraction.options._hoistedOptions);
    let strapiFilters = optionsHandler.getStrapiFiltersFromFilter();
    if (strapiFilters){
        partialQuery.filters = {...partialQuery.filters, ...strapiFilters}
    }

    let queryFunction = (q) => PrintsApi.getPrints(q);
    let paginator = new StrapiPaginator(queryFunction, partialQuery);
    let initialPrints = await paginator.initialize();

    let collectionHelper = new CollectionHelper(initialPrints, strapiDiscordUser.attributes.discordUserId);

    let parentReply = await parentInteraction.reply({
        content: `<@${strapiDiscordUser.attributes.discordUserId}>, here's your card collection.`,
        embeds: [collectionHelper.getCollectionEmbed(paginator.page, paginator.pageSize, paginator.total)],
        components: [collectionHelper.getDiscordComponentRow()],
        fetchReply: true
    });

    const collector = parentInteraction.channel.createMessageComponentCollector({
        filter: (i) => !i.user.bot,
        componentType: "BUTTON",
        time: 60000
    });

    collector.on('collect', i => onCollect(
        i,
        collectionHelper,
        paginator,
        parentReply,
        parentInteraction,
        strapiDiscordUser.attributes.discordUserId
    ));

    collector.on('end', (c, r) => onEnd(c, r, parentInteraction));
}





