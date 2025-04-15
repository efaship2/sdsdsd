const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const welcomeChannelFilePath = path.join(__dirname, '../../../welcomeChannel.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-welcome')
    .setDescription('[Admin] Setup Welcome System')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('Welcome Channel')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
      return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');

    const welcomeChannelData = {
      welcomeChannel: channel.id
    };

    try {
      fs.writeFileSync(welcomeChannelFilePath, JSON.stringify(welcomeChannelData, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing to welcomeChannel.json:', error);
      return interaction.reply({ content: 'Error', ephemeral: true });
    }

    await interaction.reply({ content: `**Welcome Channel has been set to <#${channel.id}>**`, ephemeral: true });
  }
};
