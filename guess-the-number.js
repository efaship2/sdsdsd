const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.js')

let activeGame = false;
let chosenNumber = 0;
let gameChannel;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guess-the-number')
    .setDescription('[Admin] Start a Guess The Number Game'),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
      return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    if (activeGame) return interaction.reply({ content: '**כבר יש משחק פעיל כרגע**', ephemeral: true });

    activeGame = true;
    gameChannel = interaction.guild.channels.cache.get(config.GuussTheNumberChannelId);

    if (!gameChannel) {
      activeGame = false;
      return interaction.reply({ content: 'Channel Not Found.', ephemeral: true });
    }

    chosenNumber = Math.floor(Math.random() * 1000) + 1;

    await gameChannel.permissionOverwrites.edit(interaction.guild.id, {
      SendMessages: true,
      ViewChannel: true,
    });

    const embed1 = new EmbedBuilder()
      .setTitle(`Guess The Number`)
      .setDescription(`**The Number This:** \`\`\`${chosenNumber}\`\`\``)
      .setFooter({ text: `Developer: CodyDEV`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    await interaction.user.send({ embeds: [embed1] });

    const embed2 = new EmbedBuilder()
      .setTitle(`Guess The Number`)
      .setDescription(`**המשחק התחיל נא לנחש מספר בין 1000-1 בהצלחה לכולם!**`)
      .setFooter({ text: `Developer: CodyDEV`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    await gameChannel.send({ embeds: [embed2] });

    return interaction.reply({ content: `**Game Started!**`, ephemeral: true });
  },
};

module.exports.checkGuess = async (message) => {
  if (!activeGame || message.channel.id !== gameChannel.id || message.author.bot) return;

  const guessedNumber = parseInt(message.content);

  if (isNaN(guessedNumber)) {
    await message.delete();
    return;
  }

  if (guessedNumber === chosenNumber) {
    const embed3 = new EmbedBuilder()
      .setTitle(`\`🎉\` Game End!`)
      .setDescription(`${message.author} **הוא הזוכה שניחש את המספר הנכון! המספר היה:** \`${chosenNumber}\``)
      .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
      .setTimestamp();

    await message.reply({ embeds: [embed3] });
    activeGame = false;

    await gameChannel.permissionOverwrites.edit(message.guild.id, {
      SendMessages: false,
      ViewChannel: true,
    });
  }
};