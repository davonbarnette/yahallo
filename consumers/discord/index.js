const discordIntents = require("./discord.intents");
const Logger = require("../../logger");
const UsersApi = require("../../api/yahallo.api/users");
const {BaseConsumer, CONSUMER_TYPES} = require("../base");
const {Client} = require("discord.js");
const {TOKEN, PREFIX} = process.env;
const {DISCORD_EVENTS} = require("./types");

class DiscordConsumer extends BaseConsumer {

    constructor(commandList) {
        super(commandList, CONSUMER_TYPES.DISCORD);

        this.client = new Client({intents: discordIntents});
        this.client.commands = commandList;

        this.client.login(TOKEN);
        this.client.prefix = PREFIX;
        this.client.queue = new Map();

        this.client.on(DISCORD_EVENTS.READY, this.onReady);
        this.client.on(DISCORD_EVENTS.WARN, this.onWarn);
        this.client.on(DISCORD_EVENTS.ERROR, this.onError);
        this.client.on(DISCORD_EVENTS.INTERACTION_CREATE, this.onInteractionCreate);
    }

    onReady = () => {
        Logger.success(`${this.client.user.username} ready!`)
        this.client.user.setActivity(`/help`)
    }

    onWarn = (info) => {
        Logger.warn(info)
    }

    onError = (err) => {
        Logger.error(err);
    }

    onInteractionCreate = async (interaction) => {
        if (interaction.isCommand()) {
            let command = this.client.commands.get(interaction.commandName);
            if (command) {
                let strapiDiscordUser = await UsersApi.getOrCreateUser(interaction.user.id);
                await command.execute(interaction, this.client, strapiDiscordUser);
            }
        }
    }
}

module.exports = DiscordConsumer;