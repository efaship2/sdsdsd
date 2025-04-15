const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const xpChannelFilePath = path.join(__dirname, '../../../xpChannel.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-xp')
    .setDescription('[Admin] Setup XP System')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('XP Level Up Channel')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
        return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');

    const xpChannelData = {
      xpChannel: channel.id
    };

    try {
      fs.writeFileSync(xpChannelFilePath, JSON.stringify(xpChannelData, null, 2), 'utf8');
    } catch (error) {
      return interaction.reply({ content: 'Error', ephemeral: true });
    }

    await interaction.reply({ content: `**XP Channel has been set to <#${channel.id}>**`, ephemeral: true });
  }
};
