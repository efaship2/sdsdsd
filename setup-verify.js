const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const config = require('../../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-verify')
        .setDescription('[Admin] Setup Verify System')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Verify Channel')
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
                    .setCustomId('verify')
                    .setLabel('Verify')
                    .setEmoji('✔')
                    .setStyle(ButtonStyle.Success)
        )

        const embed = new EmbedBuilder()
            .setColor(config.ServerColor)
            .setTitle(`\`✅\` Verification System`)
            .setDescription(`**Click The \`Verify\` Button Below To Gain Access To All Server Rooms.**\n-# \`⚠️\` Make Sure To Follow The Rules To Avoid Penalties.`)
            .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
            .setTimestamp();

        try {
            await channel.send({ embeds: [embed], components: [button] });
            return await interaction.reply({ content: `**Verify Setup Message Has Been Sent To ${channel}**`, ephemeral: true });
        } catch (error) {
            console.error('Error sending message:', error);
            return await interaction.reply({ content: 'There was an error sending the message. Please check the bot\'s permissions and try again.', ephemeral: true });
        }
    }
};