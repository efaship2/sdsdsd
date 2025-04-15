const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('[Admin] Say Message')
    .addStringOption(option => 
      option.setName('message')
        .setDescription('Type Message To Say')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
        return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    const message = interaction.options.getString('message');
    await interaction.reply({ content: `**Message Was Sent Successfully.**`, ephemeral: true });
    await interaction.channel.send(message);
  },
};