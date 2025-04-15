const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const config = require('../../config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Send Feedback')
    .addIntegerOption(option =>
      option.setName('stars')
        .setDescription('Rating from 1 to 5 stars.')
        .setRequired(true)
        .addChoices(
          { name: '⭐', value: 1 },
          { name: '⭐⭐', value: 2 },
          { name: '⭐⭐⭐', value: 3 },
          { name: '⭐⭐⭐⭐', value: 4 },
          { name: '⭐⭐⭐⭐⭐', value: 5 }
        )
    )
    .addStringOption(option =>
      option.setName('feedback')
        .setDescription('Your Feedback Message.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const stars = interaction.options.getInteger('stars');
    const feedback = interaction.options.getString('feedback');

    const starEmoji = '⭐';
    const starsText = starEmoji.repeat(stars);

    const feedbackEmbed = new EmbedBuilder()
      .setColor(config.ServerColor)
      .setAuthor({ name: `${config.ServerName} | Feedback`, iconURL: config.ServerIcon })
      .setDescription(
        `__**User:**__ ${interaction.user} \n\n` +
        `**__Rating:__** \`${starsText}\` (\`${stars}/5\`) \n\n` +
        `**__Feedback:__** \`${feedback}\``
      )
      .setThumbnail(interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 }))
      .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
      .setTimestamp();

    try {
      const channelId = config.FeedbackChannelId;
      const channel = interaction.client.channels.cache.get(channelId);
      await channel.send({ embeds: [feedbackEmbed] });
      await interaction.reply({ content: '\`🤍\` **| Your Feedback Has Been Sent Successfully!**', ephemeral: true });
    } catch (error) {
      console.error('Error sending feedback:', error);
      await interaction.reply({ content: 'Failed to send feedback. Please try again later.', ephemeral: true });
    }
  },
};