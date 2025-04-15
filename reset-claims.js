const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const claimsFilePath = path.join(__dirname, '../../../claimsTicket.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset-claims')
    .setDescription('[Admin] Reset Claims')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('User')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
        return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const userId = user.id;

    let claimsData;
    try {
      claimsData = JSON.parse(fs.readFileSync(claimsFilePath, 'utf8'));
    } catch (error) {
      return interaction.reply({ content: 'Error reading claims file.', ephemeral: true });
    }

    if (!claimsData[userId]) {
      return interaction.reply({ content: `${user} אין לו טיקטים.`, ephemeral: true });
    }

    delete claimsData[userId];

    try {
      fs.writeFileSync(claimsFilePath, JSON.stringify(claimsData, null, 2), 'utf8');
    } catch (error) {
      return interaction.reply({ content: 'Error writing to claims file.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Claims`)
      .setDescription(`**Successfully Removed The Claims For ${user}.**`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};