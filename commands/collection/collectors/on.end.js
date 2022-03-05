async function onEnd(collected, reason, parentInteraction) {
    if (reason === 'time') {
        await parentInteraction.editReply({content: "_You can no longer paginate through this view. Use the_ `collection` _command again._", components: []})
    }
}

module.exports = onEnd;