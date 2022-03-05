const {MessageActionRow, MessageButton} = require("discord.js");
const {PrintUtils} = require("./print.utils");

class OpenPackHelper {

    prints;
    printsById;

    constructor(prints) {
        this.prints = prints;
        prints.forEach(print => this.printsById[print.id] = print);
    }

    getPrintById(printId){
        return this.printsById[printId];
    }

    async getFilesFromPrints(dropRate) {
        let maxCompositeSize = 2;

        let r = dropRate % maxCompositeSize;
        let num = dropRate - r;
        let iterations = num / maxCompositeSize;
        if (r !== 0) {
            iterations += 1;
        }

        let composites = [];

        for (let i = 0; i < iterations; i++) {
            let start = i * maxCompositeSize;
            let end = start + maxCompositeSize;
            let sliced = this.prints.slice(start, end);
            let composite = await PrintUtils.compositePrints(sliced);
            composites.push(composite);
        }

        return composites.map((composite, i) => {
            const {prints, hasAtLeastOneJade, buffer} = composite;
            let curBuffer = Buffer.from(buffer);
            let extension = hasAtLeastOneJade ? "gif" : "png";
            let grabNumbers = [i + 1, i + 2]
            let attachmentName = PrintUtils.getPrintsToAttachmentName(prints, extension, grabNumbers)
            return {attachment: curBuffer, name: attachmentName};
        })
    }

    get discordComponentRow() {
        const row = new MessageActionRow()
        this.prints.forEach((print, i) => {
            row.addComponents(
                new MessageButton()
                    .setCustomId(`${print.id}`)
                    .setLabel(`${i + 1}`)
                    .setStyle('SECONDARY'),
            );
        })
    }
}

module.exports = OpenPackHelper;