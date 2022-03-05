const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config();
const { YAHALLO_CLIENT_ID:clientId, TOKEN:token, ARIGATU_ISLAND_GUILD_ID:guildId } = process.env;
const commandList = require("./commands.list");

const commands = [];

for (const command of commandList.values()) {
    if (!command.disabled){
        commands.push(command.slashCommand.toJSON());
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();