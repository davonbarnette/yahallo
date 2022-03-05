async function onEnd(collected, reason, parentInteraction) {
    if (reason === 'time') {
        await parentInteraction.editReply({content: "_This drop has expired._", components: []})
    }
}

module.exports = onEnd;