const {MessageButton, MessageActionRow, MessageEmbed} = require("discord.js");

const RARITY_EMOJI_MAP = {
    SILVER:"⬜",
    GOLD: "🟨",
    DIAMOND: "🟦",
    JADE: "🟩",
}

const CONDITION_UNICODE_MAP = {
    POOR: "◔",
    GOOD: "◑",
    EXCELLENT: "◕",
    MINT: "⬤"
}

class CollectionHelper {
    prints;
    discordUserId;

    constructor(prints, discordUserId) {
        this.prints = prints;
        this.discordUserId = discordUserId;
    }

    setPrints(prints) {
        this.prints = prints;
        return this;
    }

    get maxSizes() {
        let maxSizes = {
            conditionMaxSize: 0,
            printNumberMaxSize: 0,
            printIdMaxSize: 0,
            rarityMaxSize: 0,
        }
        this.prints.forEach(print => {
            let {printNumber, condition, card} = print.attributes;
            let {rarity} = card.data.attributes;
            let curSizes = {
                conditionMaxSize: condition,
                printNumberMaxSize: printNumber.toString(),
                printIdMaxSize: print.id.toString(),
                rarityMaxSize: rarity
            }
            Object.keys(curSizes).forEach(key => {
                let curMaxSize = maxSizes[key];
                let curSize = curSizes[key].length
                if (curSize > curMaxSize) {
                    maxSizes[key] = curSize;
                }
            })
        })
        return maxSizes;
    }

    stringToMaxSize(string, maxSize) {
        let curString = string;
        if (string.length < maxSize) {
            let diff = maxSize - string.length;
            for (let i = 0; i < diff; i++) {
                curString += " ";
            }
        } else {
            curString = curString.slice(0, maxSize);
        }
        return curString;
    }

    getDescriptionFromPrints() {
        let description = ``;
        let maxSizes = this.maxSizes;
        this.prints.forEach(print => {
            let {printNumber, condition, card} = print.attributes;
            let {rarity, character} = card.data.attributes;
            let {name, animeTitle} = character.data.attributes;

            let maxedPrintId = this.stringToMaxSize(print.id.toString(), 4);
            let maxedCondition = CONDITION_UNICODE_MAP[condition]
            let maxedPrintNumber = this.stringToMaxSize(printNumber.toString(), maxSizes.printNumberMaxSize);
            let rarityAsSquare = RARITY_EMOJI_MAP[rarity];

            description += `\n${rarityAsSquare} ▸ \`${maxedCondition}\` · \`${maxedPrintId}\` · \`#${maxedPrintNumber}\` · **${name}** - ${animeTitle}`
        })
        return description;
    }

    getCollectionEmbed(page, pageSize, total) {
        let starting = ((page - 1) * pageSize) + 1;
        let ending = page * pageSize;
        return new MessageEmbed()
            .setTitle(`:card_box: Collection`)
            .setDescription(this.getDescriptionFromPrints())
            .setFooter({text: `Showing ${starting}-${ending} of ${total}`})
    }

    getDiscordComponentRow() {
        const row = new MessageActionRow()
        row.addComponents([
            new MessageButton()
                    .setCustomId(`first`)
                    .setLabel(`First`)
                    .setStyle('SECONDARY'),
            new MessageButton()
                    .setCustomId(`previous`)
                    .setLabel(`Previous`)
                    .setStyle('SECONDARY'),
            new MessageButton()
                    .setCustomId(`next`)
                    .setLabel(`Next`)
                    .setStyle('SECONDARY'),
            new MessageButton()
                    .setCustomId(`last`)
                    .setLabel(`Last`)
                    .setStyle('SECONDARY'),
        ]);
        return row;
    }

}

module.exports = CollectionHelper;