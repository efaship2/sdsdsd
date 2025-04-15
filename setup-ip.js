const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const fivemIpFilePath = path.join(__dirname, '../../../fivemIpAdress.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-ip')
    .setDescription('[Admin] Setup IP Address')
    .addStringOption(option =>
        option.setName('ip')
          .setDescription('Your IP FiveM Server.')
          .setRequired(true)
      ),
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
        return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    const ip = interaction.options.getString('ip');

    const fivemIpData = {
       FivemIpAdress: ip
    };

    try {
      fs.writeFileSync(fivemIpFilePath, JSON.stringify(fivemIpData, null, 2), 'utf8');
    } catch (error) {
      return interaction.reply({ content: 'Error Saving IP Address.', ephemeral: true });
    }

    await interaction.reply({ content: `**IP Address has been set to \`${ip}\`**`, ephemeral: true });
  }
};
