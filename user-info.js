const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('User Info')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a User')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => role)
            .join('\n') || 'No Roles';

        const embed = new EmbedBuilder()
            .setTitle(`User Info (\`${user.username}\`)`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'User', value: user.toString(), inline: false },
                { name: 'User ID', value: user.id, inline: false },
                { name: 'Account Created At', value: `<t:${parseInt(user.createdTimestamp / 1000)}>`, inline: false },
                { name: 'Joined Date', value: `<t:${parseInt(member.joinedTimestamp / 1000)}>`, inline: false },
                { name: 'Booster', value: member.premiumSince ? '\`✅ Yes Booster\`' : '\`❌ No Booster\`', inline: false },
                { name: 'Roles', value: `Total: \`${member.roles.cache.size - 1}\`\n${roles}`, inline: false }
            )
            .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
            .setTimestamp()
            .setColor(config.ServerColor);

        await interaction.reply({ embeds: [embed] });
    },
};
