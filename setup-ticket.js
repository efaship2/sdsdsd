const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const config = require('../../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('[Admin] Setup Ticket System')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Ticket Channel')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('button')
                    .setLabel('📨')
                    .setStyle(ButtonStyle.Secondary)
            )

            const embed = new EmbedBuilder()
            .setColor(config.ServerColor)
            .setTitle(`Support Tickets`)
            .setDescription('**Press The \`📨\` Button To Create Ticket.**')
            .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
            .setImage('https://imgur.com/HUI15OD.png')
            .setTimestamp();

        try {
            await channel.send({ embeds: [embed], components: [button] });
            return await interaction.reply({ content: `**Ticket Setup Message Has Been Sent To ${channel}**`, ephemeral: true });
        } catch (error) {
            console.error('Error sending message:', error);
            return await interaction.reply({ content: 'There was an error sending the message. Please check the bot\'s permissions and try again.', ephemeral: true });
        }
    }
};