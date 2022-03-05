async function onCollect(
    buttonInteraction,
    collectionHelper,
    paginator,
    parentReply,
    parentInteraction,
    discordUserId
) {
    switch (buttonInteraction.customId) {

        case "next":
            await paginator.paginateRight();
            break;
        case "first":
            await paginator.goToPage(1);
            break;
        case "last":
            await paginator.goToPage(paginator.pageCount);
            break
        case "previous":
            await paginator.paginateLeft(1);
            break;
    }
    collectionHelper.setPrints(paginator.curItems);
    await parentInteraction.editReply({
        content: `<@${discordUserId}>, here's your card collection.`,
        embeds: [collectionHelper.getCollectionEmbed(paginator.page, paginator.pageSize, paginator.total)],
        components: [collectionHelper.getDiscordComponentRow()],
        fetchReply: true
    });
    await buttonInteraction.deferUpdate();
}

module.exports = onCollect;