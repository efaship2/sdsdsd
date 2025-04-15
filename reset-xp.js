const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../../config.js');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-xp')
        .setDescription('Reset The XP Of a User')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The User To Reset XP For')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const xpFile = './xpLevels.json';

        let xpData = {};
        try {
            xpData = JSON.parse(fs.readFileSync(xpFile, 'utf8'));
        } catch (error) {
            console.error('Failed to read xpLevels.json');
            return;
        }

        if (!xpData[user.id]) {
            return;
        }

        xpData[user.id].xp = 0;
        xpData[user.id].level = 1;

        fs.writeFileSync(xpFile, JSON.stringify(xpData, null, 2), 'utf8');

        const embed = new EmbedBuilder()
        .setColor(config.ServerColor2)
        .setTitle(`${user.username}'s Reset XP `)
        .setDescription(`${user} **XP Has Been Reset By** ${interaction.user}`)
        .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
        .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};
