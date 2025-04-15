const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const statsFilePath = path.join(__dirname, '../../../ticketStats.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-stats')
        .setDescription('Show Your Ticket Stats')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Select a User')
                .setRequired(false)
        ),
    async execute(interaction) {
        try {
            if (!fs.existsSync(statsFilePath)) {
                return interaction.reply({ content: 'No Ticket Statistics Are Available At The Moment.', ephemeral: true });
            }

            const ticketStats = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));

            const targetUser = interaction.options.getUser('user') || interaction.user;
            const userStats = ticketStats[targetUser.id];

            if (!userStats) {
                return interaction.reply({ content: `${targetUser} Has Not Opened Any Tickets.`, ephemeral: true });
            }

            const { ticketOpening, date } = userStats;

            const formattedDates = date
                .map((d, index) => `\`${index + 1}.\` <t:${Math.floor(new Date(d).getTime() / 1000)}>`)
                .join('\n');

            const embed = new EmbedBuilder()
            .setColor(config.ServerColor2)
            .setTitle(`\`📩\` ${targetUser.username}'s Ticket Stats `)
            .setDescription(`**User:**\nMention: ${targetUser} | ID: ${targetUser.id}\n\n**Amount:**\nHas Opened \`${ticketOpening}\` Tickets\n\n**Dates:**\n${formattedDates}`)
            .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
            .setThumbnail(config.ServerIcon)
            .setTimestamp();

            return interaction.reply({
                embeds: [embed],
            });

        } catch (error) {
            console.error('Error fetching ticket stats:', error);
            return;
        }
    },
};