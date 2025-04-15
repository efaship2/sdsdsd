const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const logsChannelFilePath = path.join(__dirname, '../../../logsChannel.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-logs')
    .setDescription('[Admin] Setup Logs')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('Logs Channel')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
        return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');

    const logsChannelData = {
      logsChannel: channel.id
    };

    try {
      fs.writeFileSync(logsChannelFilePath, JSON.stringify(logsChannelData, null, 2), 'utf8');
    } catch (error) {
      return interaction.reply({ content: 'Error', ephemeral: true });
    }

    await interaction.reply({ content: `**Logs Channel has been set to <#${channel.id}>**`, ephemeral: true });
  }
};
