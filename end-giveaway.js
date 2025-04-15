const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const giveawaysFilePath = path.join(__dirname, '../../../giveaways.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('end-giveaway')
    .setDescription('[Admin] End An Active Giveaway Manually')
    .addStringOption(option =>
      option.setName('messageid')
        .setDescription('The Message ID Of The Giveaway To End')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
        return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    const messageID = interaction.options.getString('messageid');

    if (!fs.existsSync(giveawaysFilePath)) {
      return interaction.reply({ content: '**No Giveaways Found!**', ephemeral: true });
    }

    const giveaways = JSON.parse(fs.readFileSync(giveawaysFilePath));
    const giveaway = giveaways[messageID];

    if (!giveaway) {
      return interaction.reply({ content: `**No Active Giveaway Found With ID \`${messageID}\`**`, ephemeral: true });
    }

    const winners = selectWinners(giveaway.membersJoins, giveaway.amount);

    const channel = await interaction.client.channels.fetch(config.GiveawayChannelId);
    if (!channel) return interaction.reply({ content: '**Unable to find the giveaway channel.**', ephemeral: true });

    const giveawayMessage = await channel.messages.fetch(messageID).catch(() => null);
    if (!giveawayMessage) {
      return interaction.reply({ content: '**Unable To Find The Giveaway Message.**', ephemeral: true });
    }

    const buttonRow = new ActionRowBuilder().addComponents(
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
      new ButtonBuilder()
        .setCustomId('show_participants')
        .setLabel('Participants')
        .setEmoji('<:Member2:1292951804895563917>')
        .setStyle(ButtonStyle.Secondary)
    );

    const message12 = `\`🎉\` **__Giveaway Ended!__ Congratulations! ${winners.length > 0 ? winners.map(winner => `<@${winner}>`).join(', ') : 'No Winners Selected.'} You Won __${giveaway.prize}__!**`;
    
    const updatedEmbed = new EmbedBuilder(giveawayMessage.embeds[0])
      .setDescription(`\`🪁\` **This Giveaway Has Ended.**\n\n**Ended:** <t:${parseInt(Date.now() / 1000)}:R> (<t:${parseInt(Date.now() / 1000)}>)\n**Hosted By:** <@${giveaway.hostedby}>\n**Entries:** ${giveaway.membersJoins.length + giveaway.amount}\n**Winners:** ${winners.length > 0 ? winners.map(winner => `<@${winner}>`).join(', ') : 'No Winners Selected.'}`)
      .setTitle(`__${giveaway.prize}__`)
      .setColor('Red')
      .setThumbnail(config.ServerIcon)
      .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
      .setTimestamp();

      const button2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setURL(`https://discord.com/channels/${config.GuildId}/${channel.id}/${messageID}`)
          .setLabel(`Link To Giveaway`)
          .setStyle('Link')
      );

    await giveawayMessage.edit({ embeds: [updatedEmbed], components: [buttonRow] });
    channel.send({ content: message12, components: [button2] })

    giveaway.giveawayEnd = true;
    fs.writeFileSync(giveawaysFilePath, JSON.stringify(giveaways, null, 2));

    await interaction.reply({ content: '**The Giveaway Has Been Successfully Ended!**', ephemeral: true });
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