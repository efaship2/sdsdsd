const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../../config.js');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Check Your XP Or Another User\'s XP')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a User')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const xpData = JSON.parse(fs.readFileSync('./xpLevels.json', 'utf8'));

        const embed1 = new EmbedBuilder()
        .setColor(config.ServerColor2)
        .setTitle(`${user.username}'s XP `)
        .setDescription(`${user} Has No XP Yet, Level **1**`)
        .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
        .setTimestamp();

        if (!xpData[user.id]) {
            xpData[user.id] = { xp: 0, level: 1 };
            fs.writeFileSync('./xpLevels.json', JSON.stringify(xpData, null, 2), 'utf8');
            return interaction.reply({ embeds: [embed1] });
        }

        const { xp, level } = xpData[user.id];
        const embed2 = new EmbedBuilder()
        .setColor(config.ServerColor2)
        .setTitle(`${user.username}'s XP `)
        .setDescription(`${user} Has **${xp}** XP, Level **${level}**`)
        .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
        .setTimestamp();

        interaction.reply({ embeds: [embed2] });
    },
};