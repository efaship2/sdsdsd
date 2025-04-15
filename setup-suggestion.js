const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const path = require('path');
const filePath = path.join(__dirname, '../../../suggestionChannel.json');

const loadChannelData = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return {};
};

const saveChannelData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-suggestion')
        .setDescription('[Admin] Setup a Suggestion System')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select The Suggestion Channel')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }
        const selectedChannel = interaction.options.getChannel('channel');
        const guildId = interaction.guild.id;

        const channelData = loadChannelData();

        channelData[guildId] = selectedChannel.id;

        saveChannelData(channelData);

        await interaction.reply({ content: `**Suggestion Channel Has Been Set To <#${selectedChannel.id}>**`, ephemeral: true });
    }
};