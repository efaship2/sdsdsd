const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock-channel')
        .setDescription('[Admin] Un Lock Channel To Send Messages')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel To Un Lock')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
            return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');

        if (channel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: '**Please Select A Text Channel.**', ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: true
            });

            const membersWithPermissions = channel.permissionOverwrites.cache.filter(overwrite => overwrite.id !== interaction.guild.roles.everyone.id);
            for (const [id, overwrite] of membersWithPermissions) {
                await channel.permissionOverwrites.edit(id, {
                    SendMessages: true
                });
            }

            const embed = new EmbedBuilder()
            .setColor(config.ServerColor)
            .setDescription(`**🔓 Channel ${channel} Has Been Un Locked.**`)

            return interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error(error);
            return;
        }
    },
};