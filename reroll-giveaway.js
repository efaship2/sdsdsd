const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js')

const giveawaysFilePath = path.join(__dirname, '../../../giveaways.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reroll-giveaway')
    .setDescription('[Admin] Reroll a Giveaway')
    .addStringOption(option =>
      option.setName('message-id')
        .setDescription('The Message ID Of The Ended Giveaway')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
        return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    const messageID = interaction.options.getString('message-id');

    if (!fs.existsSync(giveawaysFilePath)) {
      return interaction.reply({ content: '**No Giveaways Found.**', ephemeral: true });
    }

    const giveaways = JSON.parse(fs.readFileSync(giveawaysFilePath));
    const giveaway = giveaways[messageID];

    if (!giveaway || !giveaway.giveawayEnd) {
      return interaction.reply({ content: '**Giveaway Not Found Or Not Ended Yet.**', ephemeral: true });
    }

    const winners = selectWinners(giveaway.membersJoins, giveaway.amount);

    const channel = await interaction.client.channels.fetch(config.GiveawayChannelId);
    if (channel) {
        const button2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setURL(`https://discord.com/channels/${config.GuildId}/${channel.id}/${messageID}`)
              .setLabel(`Link To Giveaway`)
              .setStyle('Link')
          );
    
        await interaction.reply({ content: `\`🎉\` **Reroll Giveaway!** ${winners.map(winner => `<@${winner}>`).join(', ')} **You Won __${giveaway.prize}__!**`, components: [button2] });
    }
  }
};

function selectWinners(members, amount) {
  if (members.length === 0) return [];

  const winners = [];
  while (winners.length < amount && members.length > 0) {
    const randomIndex = Math.floor(Math.random() * members.length);
    winners.push(members.splice(randomIndex, 1)[0]);
  }
  return winners;
}