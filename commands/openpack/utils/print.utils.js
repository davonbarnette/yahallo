const sharp = require("sharp");
const path = require("path");
const axios = require("axios");

class PrintUtils {
    static async compositePrints(prints) {

        let printsWithJadeOrHigher = prints.filter(print => print.card.rarity === "JADE");
        let hasAtLeastOneJade = printsWithJadeOrHigher.length > 0;

        let padding = 24;
        let cardWidth = 225;
        let cardHeight = 350;

        let width =
            (prints.length * cardWidth) +
            (padding * (prints.length - 1)) +
            (padding * 2)

        let height = cardHeight + (padding * 2);

        let printComposite = []
        let curLeft = 0;

        for (let i = 0; i < prints.length; i++) {
            const print = prints[i];
            const imageResponse = await axios.get(`http://localhost:1337${print.card.image.url}`, {responseType: 'arraybuffer'})
            const buffer = Buffer.from(imageResponse.data, 'binary')
            curLeft += padding;
            printComposite.push({input: buffer, left: curLeft, top: padding})
            curLeft += cardWidth;
        }

        let overlay = await sharp({
            create: {
                width,
                height,
                channels: 4,
                background: {r: 255, g: 255, b: 255, alpha: 0}
            }
        })
            .composite(printComposite)
            .png()
            .toBuffer()

        let buffer, imageToUse;

        if (hasAtLeastOneJade) {
            imageToUse = path.resolve(__dirname, "../assets/MEGAPULL20FRAMES.gif");
            buffer = await sharp(imageToUse, {animated: true,})
                .composite([{input: Buffer.from(overlay), tile: true, gravity: "southeast"}])
                .gif({dither: 0})
                .toBuffer()
        } else {
            imageToUse = path.resolve(__dirname, "../assets/PullBG.png");
            buffer = await sharp(imageToUse)
                .composite([{input: Buffer.from(overlay), tile: true, gravity: "southeast"}])
                .png()
                .toBuffer()
        }
        return { buffer, hasAtLeastOneJade, prints }
    }

    static getPrintsToAttachmentName(prints, extension, grabNumbers){
        return `${prints.map((print, i) => `${grabNumbers[i]}_${print.id}`).join("-")}.${extension}`;
    }

    static getAttachmentNameToPrintIdToGrabNumberMap(attachmentName){
        let removedExtensionArray = attachmentName.split(".");
        let printAndGrabNumbers = removedExtensionArray[0].split("-");

        let map = {};
        printAndGrabNumbers.forEach(printAndGrabNumber => {
            let split = printAndGrabNumber.split("_");
            map[split[0]] = split[1];
        })
        return map;
    }

}

module.exports = {PrintUtils};