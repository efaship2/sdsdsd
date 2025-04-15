const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const boostChannelFilePath = path.join(__dirname, '../../../boostChannel.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-boosts')
    .setDescription('[Admin] Setup Boost System')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('Server Boost Channel')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
        return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');

    const boostChannelData = {
      boostChannel: channel.id
    };

    try {
      fs.writeFileSync(boostChannelFilePath, JSON.stringify(boostChannelData, null, 2), 'utf8');
    } catch (error) {
      return interaction.reply({ content: 'Error', ephemeral: true });
    }

    await interaction.reply({ content: `**Boost Channel has been set to <#${channel.id}>**`, ephemeral: true });
  }
};
