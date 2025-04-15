const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require('../../config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say-embed')
    .setDescription('[Admin] Say Embed Message'),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
        return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
    }

    const modal = new ModalBuilder()
        .setCustomId('sayembed:modal')
        .setTitle('Create Embed Message');

    const one = new TextInputBuilder()
        .setCustomId('sayembed:message')
        .setLabel('Message')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const two = new TextInputBuilder()
        .setCustomId('sayembed:title')
        .setLabel('Title')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const three = new TextInputBuilder()
        .setCustomId('sayembed:imageURL')
        .setLabel('Image URL')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const four = new TextInputBuilder()
        .setCustomId('sayembed:thumbnail')
        .setLabel('Small Image')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const firstActionRow = new ActionRowBuilder().addComponents(one);
    const secondActionRow = new ActionRowBuilder().addComponents(two);
    const threeActionRow = new ActionRowBuilder().addComponents(three);
    const fourActionRow = new ActionRowBuilder().addComponents(four);

    modal.addComponents(firstActionRow, secondActionRow, threeActionRow, fourActionRow);

    await interaction.showModal(modal);

    }
};
