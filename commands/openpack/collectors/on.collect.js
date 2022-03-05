const PrintsApi = require("../../../api/yahallo.api/prints");
const DiscordCodeColors = require("../../../utils/discord.code.colors");
const UsersApi = require("../../../api/yahallo.api/users");
const {GRAB_FIGHT_STATUS} = require("../../../classes/grab.fight");
const {MessageEmbed} = require("discord.js");
const {MessageAttachment} = require("discord.js");
const {MessageActionRow} = require("discord.js");
const {CARD_RARITY_TO_COLOR} = require("../../../utils/yahallo.colors");
const {pickRandomElement} = require("../../../utils/utils");
const {GrabFightsStore} = require("../../../stores/grab.fights.store");

async function onCollect(buttonInteraction, openPackHelper, parentReply, parentInteraction) {
    const {customId: printId, user} = buttonInteraction;
    let curPrint = openPackHelper.getPrintById(printId);

    let {printNumber, condition, card} = curPrint;
    let {rarity, image, character} = card;
    let {name, animeTitle} = character;

    let grabFight = GrabFightsStore.getGrabFight(printId);
    if (!grabFight) {
        grabFight = GrabFightsStore.addGrabFight(printId, timeoutFn, 5000)
    }

    async function timeoutFn() {
        GrabFightsStore.changeGrabFightStatus(printId, GRAB_FIGHT_STATUS.ENDING);
        let usersInFight = GrabFightsStore.getUsersInGrabFight(printId);
        let randomUserId = pickRandomElement(usersInFight)

        let strapiDiscordUser = await UsersApi.getOrCreateUser(randomUserId);
        await PrintsApi.updatePrint(printId, {discordUser: strapiDiscordUser.id});

        let description = `<@${strapiDiscordUser.attributes.discordUserId}> just grabbed \`${name}\` from \`${animeTitle}\`.`;
        if (usersInFight.length > 1) {
            let text = `\`${usersInFight.length - 1}\` other people`
            if (usersInFight.length === 2) {
                text = `1 other person`
            }
            description = `<@${strapiDiscordUser.attributes.discordUserId}> just fought off ${text} to grab \`${name}\` from \`${animeTitle}\`.`;
        }
        let messageAttachment = new MessageAttachment(`http://localhost:1337${image.url}`, image.name);
        let characterGrabMessageEmbed = new MessageEmbed()
            .setTitle(":sparkles: Card Grabbed!")
            .setDescription(description)
            .setThumbnail(`attachment://${image.name}`)
            .setColor(CARD_RARITY_TO_COLOR[rarity])
            .setFields([
                {name: "Rarity", value: DiscordCodeColors.toWhite(rarity), inline: true},
                {name: "Condition", value: DiscordCodeColors.toWhite(condition), inline: true},
                {name: "Print", value: DiscordCodeColors.toWhite(`#${printNumber}`), inline: true},
            ])

        let row = new MessageActionRow()
        parentReply.components[0].components.forEach(messageButton => {
            if (printId === messageButton.customId) {
                messageButton.disabled = true;
            }
            row.addComponents(messageButton)
        })

        await parentInteraction.editReply({components: [row]})
        await grabFight.discordReply.edit({
            content: `<@${strapiDiscordUser.attributes.discordUserId}>, nice grab!`,
            embeds: [characterGrabMessageEmbed],
            files: [messageAttachment]
        });
        GrabFightsStore.removeGrabFight(printId);
    }

    grabFight.setTimeout();
    let userIsInFight = GrabFightsStore.userIsInGrabFight(printId, user.id);
    if (!userIsInFight) {
        GrabFightsStore.addUserToGrabFight(printId, user.id);

        let users = grabFight.users;
        let description = "";

        users.forEach((userId, i) => {
            description += `<@${userId}>`;
            if (i !== users.length - 1) {
                description += ", ";
            }
        })
        let messageAttachment = new MessageAttachment(`http://localhost:1337${image.url}`, image.name);

        let replyMessageEmbed = new MessageEmbed()
            .setTitle(`:punch: Grab Battle Initiated!`)
            .setThumbnail(`attachment://${image.name}`)
            // .setDescription(description)
            .addField("Card", `\`\`\`yaml\n${name}\`\`\``)
            .addField("In Fight", description)

        if (!grabFight.discordReply) {
            grabFight.discordReply = await buttonInteraction.message.reply({
                embeds: [replyMessageEmbed],
                files: [messageAttachment],
                fetchReply: true
            })
            await buttonInteraction.deferUpdate();
        } else {
            await grabFight.discordReply.edit({embeds: [replyMessageEmbed], files: [messageAttachment]})
            await buttonInteraction.deferUpdate();
        }
    } else {
        await buttonInteraction.deferUpdate();
    }
}

module.exports = onCollect;