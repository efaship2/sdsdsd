const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp-leaderboard')
        .setDescription('Show The Top 10 Users With The Highest XP'),

    async execute(interaction) {
        const xpFile = './xpLevels.json';
        let xpData = {};

        try {
            xpData = JSON.parse(fs.readFileSync(xpFile, 'utf8'));
        } catch (error) {
            console.error('Failed to read xpLevels.json');
            return;
        }

        const sortedUsers = Object.entries(xpData)
            .map(([userId, { xp, level }]) => ({ userId, xp, level }))
            .sort((a, b) => b.level - a.level);

        const top10Users = sortedUsers.slice(0, 10);

        if (top10Users.length === 0) {
            return interaction.reply('No Users Have Levels Yet.');
        }

        let leaderboard = '';
        top10Users.forEach((user, index) => {
            leaderboard += `${index + 1}. <@${user.userId}> - Level **${user.level}** with **${user.xp}** XP\n`;
        });

        const embed = new EmbedBuilder()
            .setColor(config.ServerColor2)
            .setTitle('XP Leaderboard ')
            .setDescription(leaderboard)
            .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};
