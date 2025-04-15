const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const inviteCountPath = path.join(__dirname, '../../../inviteCount.json');

function loadInviteCounts() {
    if (!fs.existsSync(inviteCountPath)) {
        fs.writeFileSync(inviteCountPath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(inviteCountPath, 'utf8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite-leaderboard')
        .setDescription('Get the invite leaderboard'),
    async execute(interaction) {
        const inviteCounts = loadInviteCounts();

        const sortedLeaders = Object.entries(inviteCounts)
            .map(([id, { joins, lefts }]) => ({ id, joins, lefts }))
            .sort((a, b) => b.joins - a.joins)
            .slice(0, 10);

        let leaderboardContent = '';
        sortedLeaders.forEach((leader, index) => {
            leaderboardContent += `${index + 1}. <@${leader.id}> **- ${leader.joins} invites (\`${leader.joins}\` Joins, \`${leader.lefts}\` Lefts)**\n`;
        });

        const embed = new EmbedBuilder()
            .setColor(config.ServerColor2)
            .setTitle('Invite Leaderboard')
            .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
            .setTimestamp()
            .setThumbnail(config.ServerIcon)
            .setDescription(leaderboardContent || 'No data available.');

        await interaction.reply({
            embeds: [embed]
        });
    },
};
