const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Server Info'),

    async execute(interaction) {
        const { guild } = interaction;

        const rolesCount = guild.roles.cache.size;
        const membersCount = guild.members.cache.filter(member => !member.user.bot).size;
        const botsCount = guild.members.cache.filter(member => member.user.bot).size;
        const totalMembers = guild.memberCount;

        const owner = await guild.fetchOwner();

        const channelsCount = guild.channels.cache.size;
        const lockedChannelsCount = guild.channels.cache.filter(channel => channel.permissionOverwrites.cache.some(
            perm => perm.deny.has('ViewChannel')
        )).size;

        const boostLevel = guild.premiumTier;
        const boostCount = guild.premiumSubscriptionCount;

        const emojisCount = guild.emojis.cache.size;
        const animatedEmojis = guild.emojis.cache.filter(emoji => emoji.animated).size;
        const staticEmojis = emojisCount - animatedEmojis;

        const createdAtTimestamp = Math.floor(guild.createdTimestamp / 1000);
        const createdAt = `<t:${createdAtTimestamp}:f>`;

        const embed = new EmbedBuilder()
            .setTitle(`**Server Info**`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '__Server Name__', value: `**${guild.name}**`, inline: false },
                { name: '__Server ID__', value: `**${guild.id}**`, inline: false },
                { name: '__Server Owner__', value: `${owner.user} **(${owner.user.id})**`, inline: false },
                { name: '__Server Created Date__', value: `${createdAt}`, inline: false },
                { name: '__Members__', value: `**Total: \`${totalMembers}\`**\n**Members: \`${membersCount}\`**\n**Bots: \`${botsCount}\`**`, inline: false },
                { name: '__Roles__', value: `**${rolesCount}**`, inline: false },
                { name: '__Channels__', value: `**${channelsCount}** **(${lockedChannelsCount} Locked)**`, inline: false },
                { name: '__Boosts__', value: `**Level: \`${boostLevel}\`**\n**Boost Count: \`${boostCount}\`**`, inline: false },
                { name: '__Emojis__', value: `**Total: \`${emojisCount}\`**\n**Normal: \`${staticEmojis}\`**\n**Gif: \`${animatedEmojis}\`**`, inline: false },
            )
            .setColor(config.ServerColor)
            .setFooter({ text: `Developer: CodyDEV`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};