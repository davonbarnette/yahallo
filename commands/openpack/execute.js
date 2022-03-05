const PrintsApi = require("../../api/yahallo.api/prints");
const DropsApi = require("../../api/yahallo.api/drops");
const OpenPackHelper = require("./utils/open.pack.helper");
const onCollect = require("./collectors/on.collect");
const onEnd = require("./collectors/on.end");

module.exports = async (parentInteraction, client, strapiDiscordUser) => {
    let dropRate = 4;
    let parentReply = await parentInteraction.reply({
        content: `<@${parentInteraction.user.id}> is opening a pack of ${dropRate}.`,
        fetchReply: true
    });
    let data = await PrintsApi.createPrints();
    const {prints} = data;

    let openPackHelper = new OpenPackHelper(prints);
    let files = openPackHelper.getFilesFromPrints(dropRate);

    await parentInteraction.editReply({
        content: `<@${parentInteraction.user.id}> is opening a pack of ${dropRate}.`,
        files,
        components: [openPackHelper.discordComponentRow]
    });

    await DropsApi.createDrop({
        prints: prints.map(print => print.id),
        discordCreatedTimestamp: new Date().toISOString(),
        dropDiscordUser: strapiDiscordUser.id,
        discordMessageId: parentInteraction.id
    })

    const collector = parentInteraction.channel.createMessageComponentCollector({
        filter: (i) => !i.user.bot,
        componentType: "BUTTON",
        time: 60000
    });

    collector.on('collect', i => onCollect(i, openPackHelper, parentReply, parentInteraction));
    collector.on('end', (c, r) => onEnd(c, r, parentInteraction));

    return parentInteraction;
}





