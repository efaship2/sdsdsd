const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const xpFilePath = path.join(__dirname, '../../../xpLevels.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-xp')
        .setDescription('[Admin] Add XP To a User')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a User')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount Of XP To Add')
                .setRequired(true)),
    
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
            return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0) {
            return interaction.reply({ content: `**Amount Must Be Greater Than 0.**`, ephemeral: true });
        }

        let xpData = {};
        try {
            xpData = JSON.parse(fs.readFileSync(xpFilePath, 'utf8'));
        } catch (error) {
            console.error('Failed to read xpLevels.json. Creating a new file.');
        }

        if (!xpData[user.id]) {
            xpData[user.id] = { xp: 0, level: 1 };
        }

        xpData[user.id].xp += amount;

        while (xpData[user.id].xp >= (xpData[user.id].level + 1) * 100) {
            xpData[user.id].level++;
        }

        fs.writeFileSync(xpFilePath, JSON.stringify(xpData, null, 2), 'utf8');

        return interaction.reply({ content: `**Added \`${amount}\` XP To ${user}. Current Level: \`${xpData[user.id].level}\`.**`, ephemeral: true });
    },
};
