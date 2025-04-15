const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const giveawaysFilePath = path.join(__dirname, '../../../giveaways.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start-giveaway')
    .setDescription('[Admin] Start a New Giveaway')
    .addStringOption(option =>
      option.setName('prize')
        .setDescription('The Prize For The Giveaway')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount-winners')
        .setDescription('The Number Of Winners For This Giveaway')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('time')
        .setDescription('Duration For The Giveaway (1d, 2h, 30m)')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
      return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    const prize = interaction.options.getString('prize');
    const amountWinners = interaction.options.getInteger('amount-winners');
    const duration = interaction.options.getString('time');

    const endTime = Date.now() + parseDuration(duration);

    const giveawayEmbed = new EmbedBuilder()
      .setTitle(`__${prize}__`)
      .setThumbnail(config.ServerIcon)
      .setDescription(`**Press The \`🎉 Enter Giveaway\` To Enter Giveaway.**\n\n**Ends:** <t:${Math.floor(endTime / 1000)}:R> (<t:${Math.floor(endTime / 1000)}>)\n**Hosted By:** ${interaction.user}\n**Winners:** ${amountWinners}`)
      .setColor('#ffbc49')
      .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
      .setTimestamp();

    const joinButton = new ButtonBuilder()
      .setCustomId('join_giveaway')
      .setLabel('Enter Giveaway')
      .setStyle(ButtonStyle.Primary);

    const leaveButton = new ButtonBuilder()
      .setCustomId('leave_giveaway')
      .setLabel('Leave Giveaway')
      .setStyle(ButtonStyle.Danger);

    const showParticipantsButton = new ButtonBuilder()
      .setCustomId('show_participants')
      .setLabel('Participants')
      .setEmoji('<:Member2:1292951804895563917>')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(joinButton, leaveButton, showParticipantsButton);

    const channel = await interaction.client.channels.fetch(config.GiveawayChannelId);
    const giveawayMessage = await channel.send({ embeds: [giveawayEmbed], components: [row], fetchReply: true });
    interaction.reply({ content: `**Giveaway Started In <#${config.GiveawayChannelId}>**`, ephemeral: true })

    const giveawayData = {
      prize: prize,
      hostedby: interaction.user.id,
      amount: amountWinners,
      time: endTime,
      membersJoins: []
    };

    let giveaways = {};
    if (fs.existsSync(giveawaysFilePath)) {
      giveaways = JSON.parse(fs.readFileSync(giveawaysFilePath));
    }
    giveaways[giveawayMessage.id] = giveawayData;
    fs.writeFileSync(giveawaysFilePath, JSON.stringify(giveaways, null, 2));

    setTimeout(async () => {
      giveawayEmbed.setDescription(`\`🪁\` **This Giveaway Has Ended.**\n\n**Ended:** <t:${parseInt(Date.now() / 1000)}:R> (<t:${parseInt(Date.now() / 1000)}>)\n**Hosted By:** ${interaction.user}\n**Entries:** ${giveawayData.membersJoins.length + amountWinners}\n**Winners:** ${giveawayData.giveawayWinner}`)
        .setColor('Red');

      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('join_giveaway')
          .setLabel('Enter Giveaway')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('leave_giveaway')
          .setLabel('Leave Giveaway')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
        showParticipantsButton
      );

      await giveawayMessage.edit({ embeds: [giveawayEmbed], components: [disabledRow] });

    }, parseDuration(duration));
  }
};

function parseDuration(duration) {
  const timeRegex = /(\d+)([dhms])/g;
  let totalDuration = 0;
  let match;

  while ((match = timeRegex.exec(duration)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'd':
        totalDuration += value * 24 * 60 * 60 * 1000;
        break;
      case 'h':
        totalDuration += value * 60 * 60 * 1000;
        break;
      case 'm':
        totalDuration += value * 60 * 1000;
        break;
      case 's':
        totalDuration += value * 1000;
        break;
    }
  }
  return totalDuration;
}