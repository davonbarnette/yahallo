const Command = require("../base");
const execute = require('./execute');
const {SlashCommandBuilder} = require("@discordjs/builders");

let params = {
    name: "collection",
    aliases: ["c"],
    description: "View your collection of cards.",
    execute,
    disabled:false,
}

params.slashCommand = new SlashCommandBuilder()
    .setName(params.name)
    .setDescription(params.description)
    .addStringOption(option =>
        option.setName("filter")
            .setDescription("Filter by rarity, anime, or condition"))

module.exports = new Command(params);



