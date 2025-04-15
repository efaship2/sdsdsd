const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-bugreport')
        .setDescription('[Admin] Setup a Bug Reports System')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('Channel For Bug Reports')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('development-channel')
                .setDescription('Channel For Developers')
                .setRequired(true)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }
        const channelId1 = interaction.options.getChannel('channel').id;
        const channelId2 = interaction.options.getChannel('development-channel').id;

        const filePath = path.join(__dirname, '../../../bugReportChannels.json');
        const channelsData = {
            BugReportChannel1: channelId1,
            BugReportChannel2: channelId2
        };

        fs.writeFileSync(filePath, JSON.stringify(channelsData, null, 2));

        await interaction.reply({ content: `**Bug Reports Setup, Channels | <#${channelId1}> | <#${channelId2}>**`, ephemeral: true });
    }
};
