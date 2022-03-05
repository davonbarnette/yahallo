const Command = require("../base");
const execute = require('./execute');
const {SlashCommandBuilder} = require("@discordjs/builders");

let params = {
    name: "open",
    aliases: ["op"],
    description: "Opens a pack of cards.",
    execute,
    disabled:false,
}

params.slashCommand = new SlashCommandBuilder()
    .setName(params.name)
    .setDescription(params.description)

module.exports = new Command(params);



